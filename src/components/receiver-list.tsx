import { useState } from 'react'

export default function ReceiverList() {
	const [receiverList, setReceiverList] = useState([
		{ channel_name: 'test', user_name: 'test' },
		{ channel_name: 'test2', user_name: 'test2' },
	])

	function getInitials(name: string) {
		if (!name) return ''

		return name
			.trim() // Remove leading/trailing whitespace
			.split(/\s+/) // Split by any amount of whitespace
			.map((word) => word[0].toUpperCase()) // Take the first letter of each word and uppercase it
			.join('') // Combine them back together
	}
	return (
		<div className='space-y-5'>
			<div>
				<h5 className='text-2xl font-semibold'>Nearby devices</h5>
				<p className='text-gray-500'>{receiverList.length} devices on network.</p>
			</div>
			<div className='grid grid-cols-2 gap-x-5'>
				{receiverList.map((receiver) => (
					<div
						key={receiver.channel_name}
						className='flex items-center gap-x-5 py-5 border-b border-gray-300 hover:border-gray-600'>
						<div className='w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center'>
							{getInitials(receiver.user_name)}
						</div>
						<div>
							<h5 className='text-lg font-semibold'>{receiver.user_name}</h5>
							<p className='text-gray-500'>{receiver.channel_name}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
