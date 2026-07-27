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
	totalBatchSize: number = 0
	totalReceivedBytes: number = 0
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
				if (message.type === 'batch-start') {
					this.totalBatchSize = message.totalSize
					// FIX 1: Set expectedFileCount so the receiver knows when all files arrived
					this.expectedFileCount = message.totalFiles || 1
				}
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
			this.totalReceivedBytes += buffer.byteLength

			if (this.fileMetadata) {
				const totalSizeToCompare =
					this.totalBatchSize > 0 ? this.totalBatchSize : this.fileMetadata.size
				const progressBytes = this.totalBatchSize > 0 ? this.totalReceivedBytes : this.receivedSize
				const progress = Math.min((progressBytes / totalSizeToCompare) * 100, 100)
				this.transferProgress(progress)

				if (this.receivedSize >= this.fileMetadata.size) {
					// FIX 2: Explicitly pass MIME type if receiving a zip directly
					const isZip = this.fileMetadata.name.endsWith('.zip')
					const blobOptions = isZip ? { type: 'application/zip' } : undefined
					const blob = new Blob(this.receivedChunks, blobOptions)

					this.receivedFiles.push({
						name: this.fileMetadata.name,
						blob: blob,
					})

					// Cleanup per-file state
					this.fileMetadata = null
					this.receivedChunks = []
					this.receivedSize = 0

					// Check if batch is complete
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

		// Scenario A: Sender already compressed everything into 1 ZIP file (OR user sent 1 raw file)
		const file = this.receivedFiles[0]
		// this.downloadBlob(file.blob, file.name)
		const url = URL.createObjectURL(file.blob)
		const a = document.createElement('a')
		a.href = url
		a.download = file.name || 'sharedFiles.zip'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)

		// FIX 3: Increased timeout to 10s so browser finishes disk write for larger ZIPs
		setTimeout(() => URL.revokeObjectURL(url), 10000)

		// Reset state
		this.receivedFiles = []
		this.expectedFileCount = 0
		this.totalBatchSize = 0
		this.totalReceivedBytes = 0
	}

	exitSession() {
		if (this.socketRef && this.socketRef.readyState === WebSocket.OPEN) {
			this.socketRef.close()
		}
	}
}
