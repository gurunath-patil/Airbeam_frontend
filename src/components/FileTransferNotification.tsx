import type { Files } from '@/models/connector'
import React from 'react'

interface IFileTransferNotification {
	senderName: string
	connectionType?: string
	networkType?: string
	files: Files[]
	onAccept?: () => void
	onDecline?: () => void
}
const FileTransferNotification = ({
	senderName = "Aria's MacBook Pro",
	connectionType = 'Guest Device',
	networkType = 'Local Network',
	files = [
		{ name: 'Brand_Assets_Q4.zip', size: '48.3 MB', type: 'zip' },
		{ name: 'Campaign_Brief.pdf', size: '1.2 MB', type: 'pdf' },
	],
	onAccept = () => console.log('Accepted'),
	onDecline = () => console.log('Declined'),
}: IFileTransferNotification) => {
	// Dynamic calculation for totals based on props
	const totalFiles = files.length

	// Parse and sum up the sizes (assuming they are formatted as 'XX.X MB')
	const totalSize =
		files
			.reduce((acc, file) => {
				const numericSize = parseFloat(file.size) || 0
				return acc + numericSize
			}, 0)
			.toFixed(1) + ' MB'

	return (
		<div className='flex flex-col items-center justify-center font-mono p-6 bg-gray-50 min-h-screen'>
			{/* Card Wrapper */}
			<div className='w-[450px] bg-white border border-gray-200 shadow-sm select-none'>
				{/* Header Section */}
				<div className='flex items-center gap-4 p-5 border-b border-gray-100'>
					<div className='bg-black text-white p-2.5'>
						{/* Download Icon */}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2.5'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
							<polyline points='7 10 12 15 17 10' />
							<line x1='12' x2='12' y1='15' y2='3' />
						</svg>
					</div>
					<div>
						<p className='text-xs tracking-widest text-gray-400 uppercase font-semibold'>
							Incoming Transfer
						</p>
						<p className='text-base font-bold text-gray-900 mt-0.5'>From {senderName}</p>
					</div>
				</div>

				{/* Files List Container */}
				<div className='divide-y divide-gray-100'>
					{files.map((file, index) => (
						<div key={index} className='flex items-start gap-4 p-5'>
							<div className='text-gray-400 mt-1'>
								{file.type === 'zip' ? (
									/* Archive Box Icon */
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='20'
										height='20'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='1.5'
										strokeLinecap='round'
										strokeLinejoin='round'>
										<path d='M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z' />
										<path d='M3 10h18' />
										<path d='M10 14h4' />
									</svg>
								) : (
									/* Document File Icon */
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='20'
										height='20'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='1.5'
										strokeLinecap='round'
										strokeLinejoin='round'>
										<path d='M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' />
										<path d='M14 2v4a2 2 0 0 0 2 2h4' />
										<path d='M10 9H8' />
										<path d='M16 13H8' />
										<path d='M16 17H8' />
									</svg>
								)}
							</div>
							<div>
								<p className='text-sm font-bold text-gray-900 hover:underline cursor-pointer'>
									{file.name}
								</p>
								<p className='text-xs text-gray-400 mt-1 font-medium'>{file.size}</p>
							</div>
						</div>
					))}
				</div>

				{/* Info Counter Panel */}
				<div className='flex justify-between items-center px-5 py-4 border-t border-gray-100 bg-white text-xs text-gray-400 font-medium'>
					<span>{totalFiles} files</span>
					<span>{totalSize}</span>
				</div>

				{/* Action Controls */}
				<div className='flex border-t border-gray-200 text-sm font-bold'>
					<button
						onClick={onAccept}
						className='flex-1 flex items-center justify-center gap-2 bg-black text-white py-4 transition-colors hover:bg-gray-800'>
						{/* Checkmark Icon */}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='3'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<polyline points='20 6 9 17 4 12' />
						</svg>
						Accept
					</button>
					<button
						onClick={onDecline}
						className='flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 py-4 border-l border-gray-200 transition-colors hover:bg-gray-50'>
						{/* Close/X Icon */}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='14'
							height='14'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2.5'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<line x1='18' x2='6' y1='6' y2='18' />
							<line x1='6' x2='18' y1='6' y2='18' />
						</svg>
						Decline
					</button>
				</div>
			</div>

			{/* Network Metadata Info */}
			<div className='flex items-center gap-1.5 mt-4 text-xs text-gray-400 font-medium tracking-wide'>
				<span>{connectionType}</span>
				<span className='text-gray-300'>•</span>
				<span>{networkType}</span>
			</div>
		</div>
	)
}

export default FileTransferNotification
