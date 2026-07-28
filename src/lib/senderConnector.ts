import Connector from '@/lib/connector'
import type { UserRole, ISenderConnector } from '@/models/connector'
import JSZip from 'jszip'

export default class SenderConnector extends Connector implements ISenderConnector {
	fileToSend: Blob[] | [] = []
	userRole: UserRole | undefined = 'SENDER'
	transferProgress: (prev: number) => number
	totalBatchSize: number = 0
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
		this.totalBatchSize = this.fileToSend.reduce((acc, file) => acc + file.size, 0)
		let file: Blob
		if (this.fileToSend.length > 1) {
			file = await this.handleMultipleFile()
		} else {
			file = this.fileToSend[0]
		}

		if (file) {
			this.sendFileMetaData()
			await this.sendFiles(file)
			this.totalBatchSize = 0
		}
	}

	async handleMultipleFile() {
		const zip = new JSZip()
		if (this.fileToSend.length > 1) {
			for (const file of this.fileToSend) {
				const fileName = (file as File).name || 'file'
				zip.file(fileName, file)
			}
		}
		const zipBlob = await zip.generateAsync({
			type: 'blob',
			compression: 'DEFLATE',
			compressionOptions: { level: 6 },
		})

		const zipFileName = this.generateZipName()
		this.totalBatchSize = zipBlob.size
		Object.defineProperty(zipBlob, 'name', { value: zipFileName })
		return zipBlob
	}

	private generateZipName(prefix = 'Archive'): string {
		const now = new Date()
		const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD
		const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '') // HHMMSS

		return `${prefix}_${dateStr}_${timeStr}.zip`
		// Example output: Archive_2026-07-27_202915.zip
	}

	sendFileMetaData() {
		this.dataChannel?.send(
			JSON.stringify({
				type: 'batch-start',
				totalFiles: 1,
				totalSize: this.totalBatchSize,
			}),
		)
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

							this.transferProgress((offset / this.totalBatchSize) * 100)
							sendChunk()
						}
					}

					reader.onerror = (error) => reject(error)
					reader.readAsArrayBuffer(slice)
					return
				}

				console.log(`File ${fileName} sent successfully!`)
				this.transferProgress(100)
				resolve() // Resolve promise when file transfer finishes
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
			window.location.href = '/'
		}
	}
}
