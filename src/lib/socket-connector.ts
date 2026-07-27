import type { ISocketIDPayload, UserRole, IPayload, IUserList } from '@/models/connector.ts'
import { senderReceiver } from '@/services/base.service'

export default abstract class SocketConnector {
	socketRef: WebSocket | undefined
	userDetails: IUserList | undefined
	socketBaseUrl: string = import.meta.env.VITE_WEB_SOCKET_BASE_URL
	userRole: UserRole | undefined
	receiverChannelName: string = ''
	onStatusChange?: (status: string, details?: string) => void
	onProgress?: (progress: number) => void
	protected wsMessageQueue: any[] = []
	private socketOpenPromise: Promise<void> | undefined
	private resolveSocketOpen: (() => void) | undefined
	private rejectSocketOpen: ((reason: any) => void) | undefined
	methodRef: Record<string, (payload: any) => void> | undefined
	setUserName: ((state: string) => void) | undefined

	constructor() {
		this.methodRef = {
			...this.methodRef,
			added_user_details: (payload) => this.added_user_details(payload),
		}
	}

	async added_user_details(payload: { type: string; user_details: IUserList }) {
		this.userDetails = payload.user_details
		if (this.setUserName) {
			this.setUserName(this.userDetails.user_name)
		}
	}

	setReceiverChannel(channelName: string) {
		this.receiverChannelName = channelName
	}

	sendMessage(payload: any): void {
		if (this.socketRef && this.socketRef.readyState === WebSocket.OPEN) {
			this.socketRef.send(JSON.stringify(payload))
		} else {
			this.wsMessageQueue.push(payload)
		}
	}

	sendMyChannelname() {
		if (!this.receiverChannelName) {
			console.warn('No receiver channel name set. Cannot send channel name.')
			return
		}
		const payload = {
			type: 'sender_channel_name',
			receiver_channel_name: this.receiverChannelName,
		}
		this.sendMessage(payload)
	}

	registerInSocket(): void {
		this.onStatusChange?.('connecting-socket')
		this.socketRef = new WebSocket(this.socketBaseUrl)
		this.createRTCPeerConnection()

		if (!this.socketOpenPromise) {
			this.socketOpenPromise = new Promise((resolve, reject) => {
				this.resolveSocketOpen = resolve
				this.rejectSocketOpen = reject
			})
		}

		this.socketRef.onopen = () => {
			console.log(`[${this.userRole}] WebSocket connection opened`)
			this.onStatusChange?.('socket-open')
			const payload: ISocketIDPayload = {
				type: 'add_user',
				userRole: this.userRole!,
			}
			this.socketRef!.send(JSON.stringify(payload))

			// Flush message queue
			while (this.wsMessageQueue.length > 0) {
				const queuedPayload = this.wsMessageQueue.shift()
				this.socketRef!.send(JSON.stringify(queuedPayload))
			}

			if (this.resolveSocketOpen) {
				this.resolveSocketOpen()
			}
		}

		this.socketRef.onmessage = (event: MessageEvent) => {
			this.socketMessageHandler(event)
		}

		this.socketRef.onerror = (event) => {
			console.error(`[${this.userRole}] WebSocket error:`, event)
			this.onStatusChange?.('socket-error', 'WebSocket connection failed')
			if (this.rejectSocketOpen) {
				this.rejectSocketOpen(event)
			}
		}

		this.socketRef.onclose = (event) => {
			console.log(`[${this.userRole}] WebSocket connection closed:`, event)
			this.onStatusChange?.('socket-closed')
		}
	}

	async socketMessageHandler(event: MessageEvent): Promise<void> {
		try {
			const parseData: IPayload = JSON.parse(event.data)
			if (!this.methodRef) throw new Error('socket message handler: methodRef not defined')

			if (Object.hasOwn(this.methodRef, parseData.type) && this.methodRef[parseData.type]) {
				this.methodRef[parseData.type](parseData)
			} else {
				throw new Error('socket message handler: method not found')
			}
		} catch (error) {
			console.error(error)
		}
	}

	waitForSocketOpen(): Promise<void> {
		if (this.socketRef && this.socketRef.readyState === WebSocket.OPEN) {
			return Promise.resolve()
		}
		if (!this.socketOpenPromise) {
			this.socketOpenPromise = new Promise((resolve, reject) => {
				this.resolveSocketOpen = resolve
				this.rejectSocketOpen = reject
			})
		}
		return this.socketOpenPromise
	}

	abstract createRTCPeerConnection(): void
}
