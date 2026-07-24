import type { IUserList } from '@/models/connector'
import { senderReceiver } from '@/services/base.service'
import { useEffect, useState } from 'react'
import { usePeerContext } from '@/context/usePeerContext'

export default function ReceiverList() {
	const { senderPeer, filesToSend } = usePeerContext()
	const [receiverList, setReceiverList] = useState<IUserList[]>([])

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

	async function handleReceiverClick(receiver: IUserList) {
		if (!senderPeer) {
			console.error('Sender peer is not initialized.')
			return
		}
		senderPeer.fileToSend = filesToSend
		senderPeer.registerInSocket()
		senderPeer.setReceiverChannel(receiver.channel_name)
		senderPeer.canYouNeedThisFile()
		// senderPeer.socketOpenPromise.then(() => {
		// 	senderPeer.sendMyChannelname()
		// 	senderPeer.createSDPOffer()
		// })
	}

	return (
		<div className='space-y-5'>
			<div>
				<div className='flex justify-between items-center'>
					<h5 className='text-2xl font-semibold'>Nearby devices</h5>
					<button
						className='text-black text-sm border px-2 rounded-md bg-indigo-300 cursor-pointer'
						onClick={fetchReceiverList}>
						Refresh
					</button>
				</div>
				<p className='text-gray-500'>{receiverList.length} devices on network.</p>
			</div>
			<div className='grid grid-cols-2 gap-x-5'>
				{receiverList.map((receiver) => (
					<button
						key={receiver.channel_name}
						className='flex items-center gap-x-5 py-5 border-b border-gray-300 hover:border-gray-600'
						onClick={() => handleReceiverClick(receiver)}>
						<div className='p-5 rounded-md bg-gray-200 flex items-center justify-center'>
							{getInitials(receiver.user_name)}
						</div>
						<div>
							<h5 className='text-lg font-semibold truncate w-11/12'>{receiver.user_name}</h5>
							{/* <p className='text-gray-500'>{receiver.id}</p> */}
						</div>
					</button>
				))}
			</div>
		</div>
	)
}
