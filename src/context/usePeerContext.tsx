import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { IConnector } from '@/models/connector'

export const PeerContext = createContext<any>(null)

export default function UsePeer({ children }: { children: ReactNode }) {
	const [senderPeer, setSenderPeer] = useState<IConnector | null>(null)
	const [receiverPeer, setReceiverPeer] = useState<IConnector | null>(null)
	const [filesToSend, setFilesToSend] = useState<Blob[] | []>([])

	return (
		<PeerContext.Provider
			value={{
				senderPeer,
				setSenderPeer,
				receiverPeer,
				setReceiverPeer,
				filesToSend,
				setFilesToSend,
			}}>
			{children}
		</PeerContext.Provider>
	)
}

export function usePeerContext() {
	const { senderPeer, setSenderPeer, receiverPeer, setReceiverPeer, filesToSend, setFilesToSend } =
		useContext(PeerContext)
	return { senderPeer, setSenderPeer, receiverPeer, setReceiverPeer, filesToSend, setFilesToSend }
}
