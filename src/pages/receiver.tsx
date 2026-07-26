import FileTransferNotification from '@/components/FileTransferNotification'
import WaitingForTransfer from '@/components/WaitingForTransfer'
import { usePeerContext } from '@/context/usePeerContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Receiver() {
	const { receiverPeer, requestedSenderName, filesToSend } = usePeerContext()
	const [isSenderRequest, setIsSenderRequest] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		if (!receiverPeer) {
			navigate('/')
		}else{
			receiverPeer.setSenderRequest(setIsSenderRequest)
		}
	}, [])

	function handleAcceptBtn() {
		receiverPeer.sendRequestAns(true)
		navigate('/progress')
	}

	function handleDeclineBtn() {
		receiverPeer.sendRequestAns(true)
		navigate('/')
	}

	return isSenderRequest ? (
		<FileTransferNotification
			files={filesToSend}
			senderName={requestedSenderName}
			onAccept={handleAcceptBtn}
			onDecline={handleDeclineBtn}
		/>
	) : (
		<WaitingForTransfer />
	)
}
