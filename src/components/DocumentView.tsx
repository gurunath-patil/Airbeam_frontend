import React, { useEffect, useState } from 'react'

interface IProps {
	files: Array<{
		fileName: string
		fileSize: string
	}>
}
export default function FileAttachment({ files = [] }: IProps) {
	const [totalSize, setTotalSize] = useState(0)
	useEffect(() => {
		setTotalSize(files.reduce((acc, file) => acc + parseFloat(file.fileSize), 0))
	}, [files])
	return (
		<>
			{files.map((file, index) => (
				<div className='w-full max-w-2xl border border-gray-200 rounded bg-white text-sm font-mono text-gray-700'>
					{/* Top Row: File Name and Size */}
					<div className='flex items-center justify-between p-4 border-b border-gray-100'>
						<div className='flex items-center gap-3'>
							{/* File Icon */}
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
						<span className='text-gray-400 tabular-nums'>{file.fileSize}</span>
					</div>

					{index === files.length - 1 && (
						<div className='flex items-center justify-between px-4 py-3 bg-gray-50/50 text-gray-400 text-xs'>
							<span>{files.length} files</span>
							<span className='tabular-nums'>{totalSize.toFixed(1)} KB total</span>
						</div>
					)}
				</div>
			))}
		</>
	)
}
