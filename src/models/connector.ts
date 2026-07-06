interface IConnector {
	socketRef: undefined | WebSocket
	peerConnection: undefined | RTCPeerConnection
	socketID: string
	userRole: UserRole | undefined
	dataChannel: RTCDataChannel | undefined
	isBothConnected: boolean
	registerInSocket(): void
	socketMessageHandler(data: MessageEvent): Promise<void>

	createRTCPeerConnection(): void
	createDataChannel(): void
	createSDPOffer(channelName: string): Promise<void>
	createSDPAns(channelName: string): Promise<void>
	setSDP(payload: ISDP): Promise<void>
	createICECandidate(event: RTCPeerConnectionIceEvent, channelName?: string): void
	setICECandidate(payload: IICECandidate): Promise<void>
	hasBothConnected(): void
	sendFiles(files:Blob): Promise<void>
}

type PayloadType =
	| 'add_user'
	| 'delete_user'
	| 'share_sdp'
	| 'share_candidate'
	| 'exchange_sdp'
	| 'exchange_ice_candidate'
	| 'set_sender'
	
type UserRole = 'SENDER' | 'RECEIVER'

interface IPayload {
	type: PayloadType
}

interface ISocketIDPayload extends IPayload {
	userRole: UserRole
}

interface IICECandidate extends IPayload {
	receiver_channel_name?: string
	sender_channel_name?: string
	candidate: any
}

interface ISDP extends IPayload {
	receiver_channel_name?: string
	sender_channel_name?: string
	SDP: RTCSessionDescriptionInit
}

interface IUserList{
	id:number
	channel_name: string
	role:string
	update_at:string
}

export type { IConnector, IPayload, ISocketIDPayload, UserRole, PayloadType, IICECandidate, ISDP, IUserList }
