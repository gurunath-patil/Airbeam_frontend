import { usePeerContext } from '@/context/usePeerContext'
import React, { useRef } from 'react'

export default function FileUpload() {
	const buttonRef = useRef<HTMLInputElement | null>(null)
	const { senderPeer, setFilesToSend, filesToSend } = usePeerContext()

	function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files
		if (files && senderPeer) {
			setFilesToSend([...filesToSend, files[0]])
		}
	}

	function handleButtonClick() {
		if (buttonRef.current) {
			buttonRef.current.click()
		}
	}
	return (
		<div className='space-y-5'>
			<div>
				<h4 className='text-2xl font-semibold'>Upload Files</h4>
				<p className='text-gray-400'>Drag files here, or click the zone to browse.</p>
			</div>
			<input
				ref={buttonRef}
				type='file'
				className='hidden'
				id='file-upload'
				onChange={handleFileUpload}
			/>
			<label htmlFor='file-upload'>
				<button
					className='border-2 border-dashed border-gray-300 hover:border-gray-400 w-full h-50 flex flex-col items-center justify-center gap-y-3'
					onClick={handleButtonClick}>
					<div className='border border-gray-400 p-3'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-4 text-gray-600'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5'
							/>
						</svg>
					</div>
					<h5 className='font-medium'>Drag files here</h5>
					<p className='text-gray-400'>Images, videos, documents - any format.</p>
				</button>
			</label>
		</div>
	)
}
