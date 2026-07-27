import { useEffect, useState } from 'react'
import { usePeerContext } from '@/context/usePeerContext'
import { formatFileSize } from '@/utils'
import CircularProgress from '@/components/CircularProgress'
import DocumentView from '@/components/DocumentView'
import { useNavigate } from 'react-router-dom'
export default function Progress() {
	const { transferProgress, setTransferProgress, filesToSend, setFilesToSend, receiverPeer } =
		usePeerContext()
	const [transferred, setTransferred] = useState<number>(0)
	const [totalSize, setTotalSize] = useState(0)
	const navigate = useNavigate()

	function getTransferredSize() {
		const transferred = (totalSize * transferProgress) / 100
		setTransferred(Number(transferred.toFixed(2)))
	}
	useEffect(() => {
		getTransferredSize()
	}, [transferProgress])

	useEffect(() => {
		setTotalSize(
			filesToSend.reduce(
				(acc: number, file: Blob) => acc + parseFloat(file.size?.toString() || '0'),
				0,
			),
		)
	}, [])

	useEffect(() => {
		if (filesToSend.length === 0) {
			navigate('/')
		}

		return () => setTransferProgress(0)
	}, [])

	function onBackToHome(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault()
		if (receiverPeer) {
			receiverPeer.exitSession()
		}
		setFilesToSend([])
		navigate('/')
	}
	return (
		<div className='min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6 text-slate-800 font-sans'>
			{/* Header */}
			<div className='text-center mb-12'>
				<h1 className='text-2xl font-semibold text-slate-700'>File Share Monitor</h1>
				<p className='text-sm text-slate-400 mt-1'>Live transfer visualization</p>
			</div>

			{/* Main Container */}
			<div className='w-full grid grid-cols-1 md:grid-cols-2 max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8'>
				<div className='flex flex-col items-center pt-6 md:pt-0'>
					<CircularProgress percentage={transferProgress} />

					<p className='mt-6 text-base font-medium text-slate-800'>You</p>

					<div className='md:mt-12 text-center'>
						<span className='text-xs font-mono text-slate-400 block mb-1'>Transferred</span>
						<span className='text-sm font-semibold text-slate-700 font-mono'>
							{formatFileSize(transferred)} / {formatFileSize(totalSize)}
						</span>
					</div>
				</div>
				<div className='flex flex-col justify-between'>
					<div className='mt-5 md:mt-0'>
						<DocumentView files={filesToSend} />
					</div>
					<div className='mt-5 md:mt-0'>
						<button
							onClick={onBackToHome}
							className='w-full border border-gray-200 rounded bg-white hover:bg-gray-100 active:bg-gray-100 transition-colors py-4 text-sm font-medium text-gray-900 flex items-center justify-center gap-2 cursor-pointer'>
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
			</div>
		</div>
	)
}
