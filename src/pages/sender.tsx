import FileUpload from '@/components/file-upload'
import Header from '@/components/header.tsx'
import ReceiverList from '@/components/receiver-list'
export default function Sender() {
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
			</div>
		</>
	)
}
