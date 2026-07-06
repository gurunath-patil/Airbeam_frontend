import type { IConnector, UserRole, IICECandidate, ISDP } from '@/models/connector.ts'
import SocketConnector from './socket-connector'

export default class Connector extends SocketConnector implements IConnector {
	peerConnection: RTCPeerConnection | undefined
	dataChannel: RTCDataChannel | undefined
	isBothConnected: boolean = false
	fileToSend: Blob | undefined
	private iceCandidatesQueue: RTCIceCandidateInit[] = []

	constructor(userRole: UserRole) {
		super(userRole)
	}

	createRTCPeerConnection(): void {
		this.peerConnection = new RTCPeerConnection({
			iceServers: [
				{
					urls: 'stun:stun.l.google.com:19302',
				},
			],
		})

		this.peerConnection.oniceconnectionstatechange = () => this.hasBothConnected()

		this.peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) =>
			this.createICECandidate(event)

		this.peerConnection.ondatachannel = (event: RTCDataChannelEvent) => {
			this.dataChannel = event.channel
			if (this.dataChannel) {
				this.dataChannel.binaryType = 'arraybuffer'
			}
			this.setupDataChannelHandlers()
		}
	}

	setupDataChannelHandlers(): void {
		if (!this.dataChannel) return

		let fileMetadata: { name: string; size: number } | null = null
		let receivedChunks: ArrayBuffer[] = []
		let receivedSize = 0

		this.dataChannel.onopen = () => {
			console.log(`[${this.userRole}] Data channel opened`)
			if (this.userRole === 'SENDER') {
				this.dataChannel?.send('hello from SENDER')
				if (this.fileToSend) {
					this.sendFiles(this.fileToSend)
				}
			}
		}

		this.dataChannel.onclose = () => {
			console.log(`[${this.userRole}] Data channel closed`)
		}

		this.dataChannel.onerror = (error) => {
			console.error(`[${this.userRole}] Data channel error:`, error)
		}

		this.dataChannel.onmessage = (event: MessageEvent) => {
			if (typeof event.data === 'string') {
				try {
					const message = JSON.parse(event.data)
					if (message.type === 'file-metadata') {
						fileMetadata = message
						receivedChunks = []
						receivedSize = 0
						console.log(`[${this.userRole}] Preparing to receive file: ${fileMetadata?.name} (${fileMetadata?.size} bytes)`)
					} else {
						console.log(`[${this.userRole}] Received data channel text:`, event.data)
					}
				} catch (e) {
					console.log(`[${this.userRole}] Received data channel text:`, event.data)
				}
			} else {
				// Binary data chunk
				const buffer = event.data as ArrayBuffer
				receivedChunks.push(buffer)
				receivedSize += buffer.byteLength

				if (fileMetadata) {
					console.log(`Received chunk. Progress: ${(receivedSize / fileMetadata.size * 100).toFixed(1)}%`)
					if (receivedSize >= fileMetadata.size) {
						const blob = new Blob(receivedChunks)
						const url = URL.createObjectURL(blob)
						const a = document.createElement('a')
						a.href = url
						a.download = fileMetadata.name
						a.click()
						URL.revokeObjectURL(url)
						console.log(`[${this.userRole}] File received and downloaded: ${fileMetadata.name}`)
						fileMetadata = null
						receivedChunks = []
						receivedSize = 0
					}
				}
			}
		}
	}

	async createSDPOffer(): Promise<void> {
		if (!this.receiverChannelName) {
			console.warn('No receiver channel name set. Cannot create SDP Offer.')
			return
		}
		try {
			await this.waitForSocketOpen()
			this.createDataChannel()
			const offer = await this.peerConnection!.createOffer()
			await this.peerConnection!.setLocalDescription(offer)
			const payload = {
				type: 'share_sdp',
				receiver_channel_name: this.receiverChannelName,
				SDP: offer,
			}
			this.sendMessage(payload)
		} catch (error) {
			console.error('Error creating SDP Offer:', error)
		}
	}

	async createSDPAns(): Promise<void> {
		if (!this.receiverChannelName) {
			console.warn('No receiver channel name set. Cannot create SDP Answer.')
			return
		}
		try {
			const ans = await this.peerConnection!.createAnswer()
			await this.peerConnection!.setLocalDescription(ans)
			const payload = {
				type: 'share_sdp',
				receiver_channel_name: this.receiverChannelName,
				SDP: ans,
			}
			this.sendMessage(payload)
		} catch (error) {
			console.error('Error creating SDP Answer:', error)
		}
	}

	async setSDP(payload: ISDP): Promise<void> {
		try {
			await this.peerConnection!.setRemoteDescription(payload.SDP)

			// Process any queued ICE candidates now that remote description is set
			if (this.iceCandidatesQueue.length > 0) {
				for (const candidate of this.iceCandidatesQueue) {
					await this.peerConnection!.addIceCandidate(candidate).catch((err) => {
						console.error('Error adding queued ICE candidate:', err)
					})
				}
				this.iceCandidatesQueue = []
			}

			if (this.userRole === 'RECEIVER') {
				await this.createSDPAns()
			}
		} catch (error) {
			console.error('Error in setSDP:', error)
		}
	}

	createICECandidate(event: RTCPeerConnectionIceEvent): void {
		if (event.candidate) {
			if (!this.receiverChannelName) {
				console.warn('No receiver channel name set. Cannot send ICE candidate.')
				return
			}
			const payload: IICECandidate = {
				type: 'share_candidate',
				receiver_channel_name: this.receiverChannelName,
				candidate: event.candidate,
			}
			this.sendMessage(payload)
		}
	}

	async setICECandidate(payload: IICECandidate): Promise<void> {
		try {
			if (this.peerConnection && this.peerConnection.remoteDescription) {
				await this.peerConnection.addIceCandidate(payload.candidate)
			} else {
				this.iceCandidatesQueue.push(payload.candidate)
			}
		} catch (error) {
			console.error('Error adding ICE candidate:', error)
		}
	}

	createDataChannel(): void {
		this.dataChannel = this.peerConnection?.createDataChannel('File')
		if (this.dataChannel) {
			this.dataChannel.binaryType = 'arraybuffer'
		}
		this.setupDataChannelHandlers()
	}

	async sendFiles(file: Blob): Promise<void> {
		if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
			console.error('Data channel is not open. Cannot send file.')
			return
		}
		
		const fileName = (file as File).name || 'file'
		const fileSize = file.size
		
		// Send metadata first
		this.dataChannel.send(JSON.stringify({
			type: 'file-metadata',
			name: fileName,
			size: fileSize
		}))

		console.log(`Sending file metadata: ${fileName} (${fileSize} bytes)`)

		// Send file chunks
		const chunkSize = 16384 // 16KB
		let offset = 0

		const sendChunk = () => {
			while (offset < fileSize) {
				// If buffered amount is too high, pause and wait for bufferedamountlow event
				if (this.dataChannel && this.dataChannel.bufferedAmount > 65535) {
					this.dataChannel.onbufferedamountlow = () => {
						this.dataChannel!.onbufferedamountlow = null
						sendChunk()
					}
					return
				}

				const slice = file.slice(offset, offset + chunkSize)
				const reader = new FileReader()
				reader.onload = (e) => {
					if (e.target?.result && this.dataChannel && this.dataChannel.readyState === 'open') {
						this.dataChannel.send(e.target.result as ArrayBuffer)
						offset += slice.size
						sendChunk()
					}
				}
				reader.readAsArrayBuffer(slice)
				return // Wait for readAsArrayBuffer to complete
			}
			console.log(`File ${fileName} sent successfully!`)
		}

		sendChunk()
	}

	hasBothConnected(): void {
		const state = this.peerConnection?.iceConnectionState
		console.log(`[${this.userRole}] connection status`, state)
		this.isBothConnected = state === 'connected' || state === 'completed'
	}
}
