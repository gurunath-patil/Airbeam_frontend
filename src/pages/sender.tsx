import { useEffect, useState } from 'react'
import FileUpload from '@/components/FileUpload'
import Header from '@/components/Header'
import ReceiverList from '@/components/ReceiverList'
import FileAttachment from '@/components/DocumentView'
import { usePeerContext } from '@/context/usePeerContext'
import { useNavigate } from 'react-router-dom'

export default function Sender() {
	const { senderPeer, filesToSend } = usePeerContext()
	const navigate = useNavigate()

	useEffect(() => {
		if (!senderPeer) {
			navigate('/')
		}
	}, [])
	return (
		<>
			<Header subtitle='Sender' />
			<div className='grid grid-cols-2 px-30 py-20 gap-x-15'>
				<div className=''>
					<FileUpload />
				</div>
				<div>
					<ReceiverList />
				</div>
				<div className='mt-5'>
					<FileAttachment files={filesToSend} />
				</div>
			</div>
		</>
	)
}
