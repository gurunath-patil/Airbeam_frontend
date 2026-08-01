import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { IConnector } from '@/models/connector'

export const PeerContext = createContext<any>(null)

export default function UsePeer({ children }: { children: ReactNode }) {
	const [senderPeer, setSenderPeer] = useState<IConnector | null>(null)
	const [receiverPeer, setReceiverPeer] = useState<IConnector | null>(null)
	const [filesToSend, setFilesToSend] = useState<Blob[] | []>([])
	const [transferProgress, setTransferProgress] = useState<number>(0)
	const [requestedSenderName, setRequestedSenderName] = useState<string>('')
	const [userName, setUserName] = useState<string>('')

	function removeFile(index: number) {
		const newFiles = [...filesToSend]
		newFiles.splice(index, 1)
		setFilesToSend(newFiles)
	}

	return (
		<PeerContext.Provider
			value={{
				senderPeer,
				setSenderPeer,
				receiverPeer,
				setReceiverPeer,
				filesToSend,
				setFilesToSend,
				transferProgress,
				setTransferProgress,
				requestedSenderName,
				setRequestedSenderName,
				userName,
				setUserName,
				removeFile,
			}}>
			{children}
		</PeerContext.Provider>
	)
}

export function usePeerContext() {
	const {
		senderPeer,
		setSenderPeer,
		receiverPeer,
		setReceiverPeer,
		filesToSend,
		setFilesToSend,
		transferProgress,
		setTransferProgress,
		requestedSenderName,
		setRequestedSenderName,
		userName,
		setUserName,
		removeFile,
	} = useContext(PeerContext)
	return {
		senderPeer,
		setSenderPeer,
		receiverPeer,
		setReceiverPeer,
		filesToSend,
		setFilesToSend,
		transferProgress,
		setTransferProgress,
		requestedSenderName,
		setRequestedSenderName,
		userName,
		setUserName,
		removeFile,
	}
}
