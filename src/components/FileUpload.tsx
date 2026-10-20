import { usePeerContext } from '@/context/usePeerContext'
import React, { useRef } from 'react'

export default function FileUpload() {
	const buttonRef = useRef<HTMLInputElement | null>(null)
	const { senderPeer, setFilesToSend, filesToSend } = usePeerContext()

	function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files
		if (files && files.length > 0 && senderPeer) {
			// Convert FileList to an array and append all new files to state
			const selectedFilesArray = Array.from(files)
			setFilesToSend((prevFiles: Blob[]) => [...prevFiles, ...selectedFilesArray])

			// Optional: Reset input so re-selecting the same file triggers onChange
			event.target.value = ''
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
				<p className='text-gray-600'>Drag files here, or click the zone to browse.</p>
			</div>
			<input
				ref={buttonRef}
				type='file'
				multiple
				className='hidden'
				id='file-upload'
				onChange={handleFileUpload}
			/>
			<label htmlFor='file-upload'>
				<button
					className='border-2 border-gray-400 hover:border-gray-400 w-full h-50 flex flex-col items-center justify-center gap-y-3 rounded-2xl'
					onClick={handleButtonClick}>
					<div className=''>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-7'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
							/>
						</svg>
					</div>
					<h5 className='font-medium'>Files to send.</h5>
					<p className='text-gray-400'>Any format. Size limit 2 GB</p>
				</button>
			</label>
		</div>
	)
}
