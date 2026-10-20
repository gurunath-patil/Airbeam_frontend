import { useNavigate } from 'react-router-dom'
import { usePeerContext } from '@/context/usePeerContext'
import SenderConnector from '@/lib/senderConnector'
import ReceiverConnector from '@/lib/receiverConnector'

export default function HomePage() {
	const {
		setSenderPeer,
		setReceiverPeer,
		setTransferProgress,
		setRequestedSenderName,
		setFilesToSend,
		setUserName,
	} = usePeerContext()
	const navigate = useNavigate()

	function handleSenderClick() {
		setSenderPeer(new SenderConnector(setTransferProgress))
		setReceiverPeer(null)
		navigate('/sender')
	}
	function handleReceiverClick() {
		const receiverPeerInstance = new ReceiverConnector(
			setTransferProgress,
			setRequestedSenderName,
			setFilesToSend,
			setUserName,
		)
		setReceiverPeer(receiverPeerInstance)
		setSenderPeer(null)
		receiverPeerInstance?.registerInSocket()
		navigate('/receiver')
	}
	return (
		<div className='flex flex-col justify-center gap-y-5 md:gap-y-15 items-center h-screen'>
			<div className='flex flex-col gap-y-3 items-center'>
				<div className='flex items-center gap-2 text-gray-400'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='size-9 text-sky-600'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z'
						/>
					</svg>
				</div>
				<h3 className='capitalize text-4xl font-thin'>who are you?</h3>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
				<button
					className='w-[260px] h-[230px] md:h-[260px] bg-white border border-gray-200 text-left p-8 flex flex-col justify-start items-start transition-all hover:border-gray-400 hover:shadow-sm focus:outline-none group shadow-xl rounded-xl'
					onClick={handleSenderClick}>
					<div className='mb-7 text-gray-500 group-hover:text-gray-800 transition-colors'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-10 text-blue-600'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
							/>
						</svg>
					</div>

					<div className='space-y-3'>
						<h2 className='text-xl font-medium text-gray-900 tracking-wide font-sans'>Sender</h2>
						<p className='text-sm text-gray-500 leading-relaxed font-mono'>
							Upload and push files to a peer.
						</p>
					</div>
				</button>
				<button
					className='w-[260px] h-[230px] md:h-[260px] bg-white border border-gray-200 text-left p-8 flex flex-col justify-start items-start transition-all hover:border-gray-400 hover:shadow-sm focus:outline-none group shadow-xl rounded-xl'
					onClick={handleReceiverClick}>
					<div className='mb-7 text-gray-500 group-hover:text-gray-800 transition-colors'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-10 text-green-600'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
							/>
						</svg>
					</div>

					<div className='space-y-3'>
						<h2 className='text-xl font-medium text-gray-900 tracking-wide font-sans'>Receiver</h2>
						<p className='text-sm text-gray-500 leading-relaxed font-mono'>
							Receive files from a nearby device.
						</p>
					</div>
				</button>
			</div>
			<div className='flex justify-center items-center p-5 bg-indigo-100 rounded-2xl mx-6 md:mx-0'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='currentColor'
					className='size-5 me-2 text-amber-700'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25'
					/>
				</svg>

				<p className='text-dark font-mono'>
					Devices on the same network will discover automatically.
				</p>
			</div>
		</div>
	)
}
