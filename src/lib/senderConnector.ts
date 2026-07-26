import Connector from '@/lib/connector'
import type { UserRole, ISenderConnector } from '@/models/connector'

export default class SenderConnector extends Connector implements ISenderConnector {
	fileToSend: Blob[] | [] = []
	userRole: UserRole | undefined = 'SENDER'
	transferProgress: (prev: number) => number

	constructor(transferProgress: (prev: number) => number) {
		super()
		this.transferProgress = transferProgress

		this.methodRef = {
			...this.methodRef,
			can_you_need_this_files_answer: (payload) => this.canIStartSending(payload),
		}
	}
	async handleSenderFiles() {
		console.log(`[${this.userRole}] Data channel opened`)
		this.dataChannel?.send('hello from SENDER')
		if (this.fileToSend.length > 0) {
			for (let file of this.fileToSend) {
				await this.sendFiles(file)
			}
		}
	}

	async sendFiles(file: Blob): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
				console.error('Data channel is not open. Cannot send file.')
				return resolve()
			}

			const fileName = (file as File).name || 'file'
			const fileSize = file.size

			// Send metadata first
			this.dataChannel.send(
				JSON.stringify({
					type: 'file-metadata',
					name: fileName,
					size: fileSize,
				}),
			)

			console.log(`Sending file metadata: ${fileName} (${fileSize} bytes)`)

			const chunkSize = 16384 // 16KB
			let offset = 0

			const sendChunk = () => {
				this.transferProgress((offset / fileSize) * 100)

				while (offset < fileSize) {
					// Backpressure check
					if (this.dataChannel && this.dataChannel.bufferedAmount > 65535) {
						this.dataChannel.onbufferedamountlow = () => {
							if (this.dataChannel) this.dataChannel.onbufferedamountlow = null
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

					reader.onerror = (error) => reject(error)
					reader.readAsArrayBuffer(slice)
					return
				}

				console.log(`File ${fileName} sent successfully!`)
				this.transferProgress(100)
				resolve() // ✅ Resolve promise when file transfer finishes
			}

			sendChunk()
		})
	}

	canYouNeedThisFile(): void {
		let payload = []

		for (let file of this.fileToSend) {
			payload.push({
				name: (file as File).name,
				size: file.size,
				type: (file as File).type,
			})
		}

		this.sendMessage({
			type: 'can_you_need_this_files',
			receiver_channel_name: this.receiverChannelName,
			files: payload,
		})
	}

	canIStartSending(payload: { sender_channel_name: string; answer: boolean }): void {
		const { answer } = payload
		if (answer) {
			this.createSDPOffer()
		} else {
			console.log('receiver Declined request!')
		}
	}
}
