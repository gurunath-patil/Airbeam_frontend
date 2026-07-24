import Connector from '@/lib/connector'
import type { UserRole, IReceiverConnector, canYouNeedThisFile } from '@/models/connector'

export default class ReceiverConnector extends Connector implements IReceiverConnector {
	userRole: UserRole | undefined = 'RECEIVER'
	fileMetadata: { name: string; size: number } | null = null
	receivedChunks: ArrayBuffer[] = []
	receivedSize = 0

	handleReceiverFiles(event: MessageEvent) {
		if (typeof event.data === 'string') {
			try {
				const message = JSON.parse(event.data)
				if (message.type === 'file-metadata') {
					this.fileMetadata = message
					this.receivedChunks = []
					this.receivedSize = 0
					console.log(
						`[${this.userRole}] Preparing to receive file: ${this.fileMetadata?.name} (${this.fileMetadata?.size} bytes)`,
					)
				} else {
					console.log(`[${this.userRole}] Received data channel text:`, event.data)
				}
			} catch (e) {
				console.log(`[${this.userRole}] Received data channel text:`, event.data)
			}
		} else {
			// Binary data chunk
			const buffer = event.data as ArrayBuffer
			this.receivedChunks.push(buffer)
			this.receivedSize += buffer.byteLength

			if (this.fileMetadata) {
				console.log(
					`Received chunk. Progress: ${((this.receivedSize / this.fileMetadata.size) * 100).toFixed(1)}%`,
				)
				if (this.receivedSize >= this.fileMetadata.size) {
					const blob = new Blob(this.receivedChunks)
					const url = URL.createObjectURL(blob)
					const a = document.createElement('a')
					a.href = url
					a.download = this.fileMetadata.name
					a.click()
					URL.revokeObjectURL(url)
					console.log(`[${this.userRole}] File received and downloaded: ${this.fileMetadata.name}`)
					this.fileMetadata = null
					this.receivedChunks = []
					this.receivedSize = 0
				}
			}
		}
	}

	handleSenderFileRequest(metaData: canYouNeedThisFile) {
		console.log(
			`[${this.userRole}] Received file request from ${metaData.sender_user_name}:`,
			metaData.files,
		)
	}
}
