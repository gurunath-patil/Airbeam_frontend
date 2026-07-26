import type { IUserList } from '@/models/connector'
import { senderReceiver } from '@/services/base.service'
import { useEffect, useState } from 'react'
import { usePeerContext } from '@/context/usePeerContext'
import { useNavigate } from 'react-router-dom'

export default function ReceiverList() {
	const { senderPeer, filesToSend } = usePeerContext()
	const [receiverList, setReceiverList] = useState<IUserList[]>([])
	const [disableSendBtn, setDisableSendBtn] = useState(true)
	const navigate = useNavigate()
	function getInitials(name: string) {
		if (!name) return ''

		return name
			.trim() // Remove leading/trailing whitespace
			.split(/\s+/) // Split by any amount of whitespace
			.map((word) => word[0].toUpperCase()) // Take the first letter of each word and uppercase it
			.join('') // Combine them back together
	}
	async function fetchReceiverList() {
		const res = await senderReceiver.get()
		setReceiverList(res)
	}
	useEffect(() => {
		fetchReceiverList()
	}, [])

	useEffect(() => {
		if (filesToSend.length > 0) {
			setDisableSendBtn(false)
		}
	}, [filesToSend])

	async function handleReceiverClick(receiver: IUserList) {
		if (!senderPeer) {
			console.error('Sender peer is not initialized.')
			return
		}
		senderPeer.fileToSend = filesToSend
		senderPeer.registerInSocket()
		senderPeer.setReceiverChannel(receiver.channel_name)
		senderPeer.canYouNeedThisFile()
		senderPeer.socketOpenPromise.then(() => {
			senderPeer.sendMyChannelname()
		})
		navigate('/progress')
	}

	return (
		<div className='space-y-4'>
			<div>
				<div className='flex justify-between items-center'>
					<h5 className='text-2xl font-semibold text-gray-900'>Nearby devices</h5>
					<button
						className='flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md bg-white hover:bg-gray-50 cursor-pointer transition-colors'
						onClick={fetchReceiverList}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
							/>
						</svg>
						Refresh
					</button>
				</div>
				<p className='text-gray-500 text-sm mt-1'>{receiverList.length} devices on network.</p>
			</div>

			<div className='border border-gray-200 rounded-xl p-4'>
				{receiverList.length === 0 ? (
					<p className='text-sm text-gray-400 text-center py-6'>No devices found nearby.</p>
				) : (
					<div className='space-y-2'>
						{receiverList.map((receiver) => (
							<button
								key={receiver.channel_name}
								onClick={() => handleReceiverClick(receiver)}
								disabled={disableSendBtn}
								className='w-full flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-left'>
								<div className='w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium text-sm flex-shrink-0'>
									{getInitials(receiver.user_name)}
								</div>
								<div className='flex-1 min-w-0'>
									<h5 className='text-sm font-medium text-gray-900 truncate'>
										{receiver.user_name}
									</h5>
									<p className='text-xs text-gray-500 flex items-center gap-1.5 mt-0.5'>
										<span className='w-1.5 h-1.5 rounded-full bg-green-500' />
										Online
									</p>
								</div>
								{disableSendBtn ? (
									<span className='text-xs font-medium text-white bg-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors'>
										Send
									</span>
								) : (
									<span className='text-xs font-medium text-white bg-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors'>
										Send
									</span>
								)}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
