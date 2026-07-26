import Header from '@/components/Header'
import React from 'react'

export default function WaitingForTransfer() {
	return (
		<div>
			<Header subtitle='Receiver' />
			<div className='flex w-full h-[30rem] items-center justify-center bg-[#f9f9f9] p-4 text-center'>
				<div className='flex flex-col items-center max-w-sm w-full'>
					{/* Icon Container with Status Dot */}
					<div className='relative mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm'>
						{/* Wifi Icon */}
						<svg
							className='h-6 w-6 text-green-600'
							fill='none'
							stroke='currentColor'
							strokeWidth='1.75'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M8.25 12.75a3.75 3.75 0 015.5 0M12 15.75h.008v.008H12v-.008zm-6-6a8.25 8.25 0 0112 0M3 6.75a12.75 12.75 0 0118 0'
							/>
						</svg>
					</div>

					{/* Heading */}
					<h2 className='mb-2 text-xl font-semibold text-gray-900 tracking-tight'>
						Waiting for transfer
					</h2>

					{/* Description */}
					<p className='text-sm text-gray-500 leading-relaxed'>
						Your device is discoverable on the local network.
						<br />
						Stay on this page.
					</p>

					{/* Status Line */}
					<div className='mt-10 font-mono text-xs text-gray-400'>
						Listening for incoming connections...
					</div>
				</div>
			</div>
		</div>
	)
}
