import { useEffect } from 'react'
import FileUpload from '@/components/FileUpload'
import Header from '@/components/Header'
import ReceiverList from '@/components/ReceiverList'
import FileAttachment from '@/components/DocumentView'
import { usePeerContext } from '@/context/usePeerContext'
import { useNavigate } from 'react-router-dom'

export default function Sender() {
	const { senderPeer, filesToSend, transferProgress } = usePeerContext()
	const navigate = useNavigate()

	useEffect(() => {
		if (!senderPeer) {
			navigate('/')
		}
	}, [])

	useEffect(() => {
		console.log('sender side transferProgress', transferProgress)
	}, [transferProgress])
	return (
		<>
			<Header subtitle='Sender' />
			<div className='grid grid-cols-1 gap-y-14 md:grid-cols-2 p-8 md:px-30 md:py-20 gap-x-20'>
				<div className='flex flex-col gap-y-5'>
					<FileUpload />
					<div>
						<FileAttachment files={filesToSend} />
					</div>
				</div>
				<div className=' border-amber-600'>
					<ReceiverList />
				</div>
			</div>
		</>
	)
}
