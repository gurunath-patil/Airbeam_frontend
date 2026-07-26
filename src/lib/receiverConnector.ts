import Connector from '@/lib/connector'
import type { UserRole, IReceiverConnector, canYouNeedThisFile } from '@/models/connector'
import JSZip from 'jszip'
export default class ReceiverConnector extends Connector implements IReceiverConnector {
	userRole: UserRole | undefined = 'RECEIVER'
	fileMetadata: { name: string; size: number } | null = null
	receivedChunks: ArrayBuffer[] = []
	receivedSize: number = 0
	transferProgress: (prev: number) => number
	requestedFiles: (payload: Blob[]) => void = () => {}
	requestedSenderName: (payload: string) => void
	isSenderRequest: (state: boolean) => void = () => {}
	receivedFiles: { name: string; blob: Blob }[] = []
	expectedFileCount: number = 0

	constructor(
		transferProgress: (prev: number) => number,
		setRequestedSenderName: (payload: string) => void,
		requestedFiles: (payload: Blob[]) => void,
	) {
		super()
		this.methodRef = {
			...this.methodRef,
			can_you_need_this_files: (payload) => this.handleSenderFileRequest(payload),
		}
		this.transferProgress = transferProgress
		this.requestedSenderName = setRequestedSenderName
		this.requestedFiles = requestedFiles
	}

	async handleReceiverFiles(event: MessageEvent) {
		if (typeof event.data === 'string') {
			try {
				const message = JSON.parse(event.data)
				if (message.type === 'file-metadata') {
					this.fileMetadata = message
					this.receivedChunks = []
					this.receivedSize = 0
					this.transferProgress(0)
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
				const progress = Math.min((this.receivedSize / this.fileMetadata.size) * 100, 100)
				this.transferProgress(progress)

				if (this.receivedSize >= this.fileMetadata.size) {
					const blob = new Blob(this.receivedChunks)
					this.receivedFiles.push({
						name: this.fileMetadata.name,
						blob: blob,
					})

					// console.log(`[${this.userRole}] File received and downloaded: ${this.fileMetadata.name}`)

					// Cleanup after download complete
					this.fileMetadata = null
					this.receivedChunks = []
					this.receivedSize = 0

					// 👈 3. Check if all files have arrived
					if (this.receivedFiles.length >= this.expectedFileCount) {
						await this.triggerDownload()
					}
				}
			}
		}
	}

	handleSenderFileRequest(payload: canYouNeedThisFile) {
		const { files, user_name } = payload

		if ((!files && !Array.isArray(files)) || !user_name) return

		this.expectedFileCount = files.length
		this.receivedFiles = [] // Reset file collection

		const proxyFiles = files.map((file) => {
			const mockFile = new File([''], file.name, {
				type: file.type || 'application/octet-stream',
				lastModified: Date.now(),
			})

			Object.defineProperty(mockFile, 'size', {
				value: file.size,
				writable: false,
			})
			return mockFile
		})

		this.isSenderRequest(true)
		this.requestedFiles(proxyFiles)
		this.requestedSenderName(user_name)
	}

	setSenderRequest(setter: (state: boolean) => void) {
		this.isSenderRequest = setter
	}

	sendRequestAns(decision: boolean) {
		this.sendMessage({
			type: 'can_you_need_this_files_answer',
			receiver_channel_name: this.receiverChannelName,
			answer: decision,
		})
	}

	async triggerDownload() {
		if (this.receivedFiles.length === 0) return

		// If single file sent, download directly
		if (this.receivedFiles.length === 1) {
			const file = this.receivedFiles[0]
			this.downloadBlob(file.blob, file.name)
		} else {
			// Multiple files: Zip them together
			console.log(`[${this.userRole}] Zipping ${this.receivedFiles.length} files...`)
			const zip = new JSZip()

			for (const file of this.receivedFiles) {
				zip.file(file.name, file.blob)
			}

			const zipBlob = await zip.generateAsync({ type: 'blob' })
			this.downloadBlob(zipBlob, `bundle_${Date.now()}.zip`)
		}

		// Cleanup
		this.receivedFiles = []
		this.expectedFileCount = 0
	}

	private downloadBlob(blob: Blob, filename: string) {
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		setTimeout(() => URL.revokeObjectURL(url), 1000)
	}

	exitSession() {
		debugger
		if (this.socketRef && this.socketRef.readyState === WebSocket.OPEN) {
			this.socketRef.close()
		}
	}
}
