import FileTransferNotification from '@/components/FileTransferNotification'
import WaitingForTransfer from '@/components/WaitingForTransfer'
import { usePeerContext } from '@/context/usePeerContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Receiver() {
	const { transferProgress, receiverPeer, requestedSenderName, filesToSend } = usePeerContext()
	const [isSenderRequest, setIsSenderRequest] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		receiverPeer.setSenderRequest(setIsSenderRequest)
	}, [])

	function handleAcceptBtn() {
		receiverPeer.sendRequestAns(true)
		navigate('/progress')
	}

	function handleDeclineBtn() {
		receiverPeer.sendRequestAns(true)
		navigate('/')
	}

	useEffect(() => {
		console.log('sender side transferProgress', transferProgress)
	}, [transferProgress])

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
