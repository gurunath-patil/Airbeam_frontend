import { useEffect, useState } from 'react'

interface IProps {
	files: File[]
}
export default function FileAttachment({ files = [] }: IProps) {
	const [totalSize, setTotalSize] = useState(0)

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes'

		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

		// Math.floor(Math.log(bytes) / Math.log(k)) determines which unit bucket the size falls into
		const i = Math.floor(Math.log(bytes) / Math.log(k))

		// Cap the index to the maximum unit available in the array
		const index = Math.min(i, sizes.length - 1)

		// Parse float and fix to 2 decimal places, but remove trailing zeros if they aren't needed
		const formattedSize = parseFloat((bytes / Math.pow(k, index)).toFixed(2))

		return `${formattedSize} ${sizes[index]}`
	}

	useEffect(() => {
		setTotalSize(files.reduce((acc, file) => acc + parseFloat(file.size?.toString() || '0'), 0))
	}, [files])
	return (
		<>
			{files.map((file, index) => (
				<div
					key={index}
					className='w-full max-w-2xl border border-gray-200 rounded bg-white text-sm font-mono text-gray-700'>
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
							<span className='text-gray-900 truncate font-sans tracking-wide'>{file.name}</span>
						</div>
						<span className='text-gray-400 tabular-nums'>{(file.size / 1024).toFixed(1)} KB</span>
					</div>

					{index === files.length - 1 && (
						<div className='flex items-center justify-between px-4 py-3 bg-gray-50/50 text-gray-400 text-xs'>
							<span>{files.length} files</span>
							<span className='tabular-nums'>{formatFileSize(totalSize)} total</span>
						</div>
					)}
				</div>
			))}
		</>
	)
}
