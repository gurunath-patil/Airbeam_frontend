import type {
	ISocketIDPayload,
	UserRole,
	IICECandidate,
	ISDP,
	IPayload,
} from '@/models/connector.ts'

export default abstract class SocketConnector {
	socketRef: WebSocket | undefined
	socketID = ''
	socketBaseUrl = import.meta.env.VITE_WEB_SOCKET_BASE_URL
	userRole: UserRole | undefined
	receiverChannelName = ''
	onStatusChange?: (status: string, details?: string) => void
	onProgress?: (progress: number) => void
	protected wsMessageQueue: any[] = []
	private socketOpenPromise: Promise<void> | undefined
	private resolveSocketOpen: (() => void) | undefined
	private rejectSocketOpen: ((reason: any) => void) | undefined

	constructor(userRole: UserRole) {
		this.userRole = userRole
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

	sendMyChannelname(){
		if (!this.receiverChannelName) {
			console.warn("No receiver channel name set. Cannot send channel name.")
			return
		}
		const payload = {
			"type":"sender_channel_name",
			"receiver_channel_name": this.receiverChannelName
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
			const methodRef: Record<string, (payload: any) => void> = {
				exchange_sdp: (payload) => this.setSDP(payload),
				exchange_ice_candidate: (payload) => this.setICECandidate(payload),
				set_sender: (payload) => this.setReceiverChannel(payload.sender_channel_name),
			}
			if (Object.hasOwn(methodRef, parseData.type)) {
				methodRef[parseData.type](parseData)
			}
		} catch (error) {
			console.error('Error handling WebSocket message:', error)
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
	abstract setSDP(payload: ISDP): Promise<void>
	abstract setICECandidate(payload: IICECandidate): Promise<void>
}
