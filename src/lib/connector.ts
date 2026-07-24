import type { canYouNeedThisFile, IConnector, IFileMetaData, IICECandidate, ISDP } from '@/models/connector.ts'
import SocketConnector from './socket-connector'

export default class Connector extends SocketConnector implements IConnector {
	peerConnection: RTCPeerConnection | undefined
	dataChannel: RTCDataChannel | undefined
	isBothConnected: boolean = false
	private iceCandidatesQueue: RTCIceCandidateInit[] = []

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

		this.dataChannel.onopen = () => this.handleSenderFiles()

		this.dataChannel.onclose = () => {
			console.log(`[${this.userRole}] Data channel closed`)
		}

		this.dataChannel.onerror = (error) => {
			console.error(`[${this.userRole}] Data channel error:`, error)
		}

		this.dataChannel.onmessage = (event: MessageEvent) => this.handleReceiverFiles(event)
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

	hasBothConnected(): void {
		const state = this.peerConnection?.iceConnectionState
		console.log(`[${this.userRole}] connection status`, state)
		this.isBothConnected = state === 'connected' || state === 'completed'
	}

	handleReceiverFiles(event: MessageEvent) {
		throw new Error('Method not implemented.')
	}

	handleSenderFiles() {
		throw new Error('Method not implemented.')
	}

	handleSenderFileRequest(payload: canYouNeedThisFile): void {
		throw new Error('Method not implemented.')
	}
}
