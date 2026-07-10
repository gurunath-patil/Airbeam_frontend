import React, { useState } from 'react'
import FileUpload from '@/components/file-upload'
import Header from '@/components/Header'
import ReceiverList from '@/components/ReceiverList'
import FileAttachment from '@/components/DocumentView'
export default function Sender() {
	const [files, setFiles] = useState([
		{ fileName: 'Gurunath Patil - Resume.pdf', fileSize: '104.2 KB' },
		{ fileName: 'Gurunath Patil - Resume.pdf', fileSize: '104.2 KB' },
		{ fileName: 'Gurunath Patil - Resume.pdf', fileSize: '104.2 KB' },
	])
	return (
		<>
			<Header subtitle='Sender' />
			<div className='grid grid-cols-2 px-30 py-20 gap-x-15'>
				<div className=''>
					<FileUpload />
				</div>
				<div>
					<ReceiverList />
				</div>
				<div className='mt-5'>
					<FileAttachment files={files} />
				</div>
			</div>
		</>
	)
}
