import React from 'react'
import { useNavigate } from 'react-router-dom'

// Define the structure for individual files
export interface FileItem {
	fileName: string
	fileSize: string
}

// Define the shape of the component's incoming props
interface TransferCompleteProps {
	statusText?: string
	subtext?: string
	statusType?: 'Success' | 'Failed' | string
	totalSize: string
	recipientName: string
	files: FileItem[]
}

export default function TransferComplete({
	statusText = 'Transfer complete',
	subtext = "Successfully sent to Aria's MacBook Pro.",
	statusType = 'Success',
	totalSize,
	recipientName,
	files = [],
}: TransferCompleteProps) {
    const navigate = useNavigate();
    function onBackToHome(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        navigate('/');
    }
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 font-sans select-none'>
			<div className='w-full max-w-2xl flex flex-col items-center'>
				{/* Checkmark Icon Header */}
				<div className='w-12 h-12 border border-gray-200 bg-white flex items-center justify-center mb-6'>
					<svg
						className='w-5 h-5 text-gray-900'
						fill='none'
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
					</svg>
				</div>

				{/* Title and Subtitle */}
				<h1 className='text-3xl font-normal tracking-tight text-gray-900 mb-2'>{statusText}</h1>
				<p className='text-gray-500 text-sm mb-8'>{subtext}</p>

				{/* Summary Details Table */}
				<div className='w-full border border-gray-200 rounded bg-white text-xs tracking-wider font-mono text-gray-400 mb-6 divide-y divide-gray-100'>
					<div className='flex justify-between items-center px-4 py-3.5'>
						<span className='uppercase'>Status</span>
						<span className='text-emerald-600 font-sans tracking-normal font-medium'>
							{statusType}
						</span>
					</div>
					<div className='flex justify-between items-center px-4 py-3.5'>
						<span className='uppercase'>Files</span>
						<span className='text-gray-900 font-sans tracking-normal'>
							{files.length} {files.length === 1 ? 'file' : 'files'}
						</span>
					</div>
					<div className='flex justify-between items-center px-4 py-3.5'>
						<span className='uppercase'>Total Size</span>
						<span className='text-gray-900 font-sans tracking-normal font-medium'>{totalSize}</span>
					</div>
					<div className='flex justify-between items-center px-4 py-3.5'>
						<span className='uppercase'>Recipient</span>
						<span className='text-gray-900 font-sans tracking-normal font-medium'>
							{recipientName}
						</span>
					</div>
				</div>

				{/* Files Attached List Block */}
				<div className='w-full border border-gray-200 rounded bg-white text-sm font-mono text-gray-700 mb-6 divide-y divide-gray-100'>
					{files.map((file, index) => (
						<div key={index} className='flex items-center justify-between p-4'>
							<div className='flex items-center gap-3 min-w-0'>
								<svg
									className='w-5 h-5 text-gray-400 flex-shrink-0'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={1.5}
										d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
									/>
								</svg>
								<span className='text-gray-900 truncate font-sans tracking-wide'>
									{file.fileName}
								</span>
							</div>
							<span className='text-gray-400 tabular-nums ml-4 flex-shrink-0'>{file.fileSize}</span>
						</div>
					))}
				</div>

				{/* Back to Home Action Button */}
				<button
					onClick={onBackToHome}
					className='w-full border border-gray-200 rounded bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors py-4 text-sm font-medium text-gray-900 flex items-center justify-center gap-2 cursor-pointer'>
					<svg
						className='w-4 h-4 text-gray-900'
						fill='none'
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
						/>
					</svg>
					Back to home
				</button>
			</div>
		</div>
	)
}
