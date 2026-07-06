export default function HomePage() {
	return (
		<div className="flex flex-col justify-center gap-y-15 items-center h-screen">
			<div className='flex flex-col gap-y-3 items-center'>
				<div className='flex items-center gap-2 text-gray-400'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='size-6'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z'
						/>
					</svg>
					<p className='uppercase'>peer transfer</p>
				</div>
				<h3 className='capitalize text-4xl font-thin'>who are you?</h3>
				<p className='capitalize text-gray-400'>select your role to begin the session.</p>
			</div>

			<div className="flex gap-x-5 justify-center">
				<button className='w-[260px] h-[260px] bg-white border border-gray-200 text-left p-8 flex flex-col justify-start items-start transition-all hover:border-gray-400 hover:shadow-sm focus:outline-none group'>
					<div className='mb-7 text-gray-500 group-hover:text-gray-800 transition-colors'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-10'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
							/>
						</svg>
					</div>

					<div className='space-y-3'>
						<h2 className='text-xl font-medium text-gray-900 tracking-wide font-sans'>Sender</h2>
						<p className='text-sm text-gray-500 leading-relaxed font-mono'>
							Upload and push files to a peer.
						</p>
					</div>
				</button>
				<button className='w-[260px] h-[260px] bg-white border border-gray-200 text-left p-8 flex flex-col justify-start items-start transition-all hover:border-gray-400 hover:shadow-sm focus:outline-none group'>
					<div className='mb-7 text-gray-500 group-hover:text-gray-800 transition-colors'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-10'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
							/>
						</svg>
					</div>

					<div className='space-y-3'>
						<h2 className='text-xl font-medium text-gray-900 tracking-wide font-sans'>Receiver</h2>
						<p className='text-sm text-gray-500 leading-relaxed font-mono'>
							Receive files from a nearby device.
						</p>
					</div>
				</button>
			</div>
            <div className="flex justify-center">
                <p className="text-gray-400 font-mono">Devices on the same network are discovered automatically.</p>
            </div>
		</div>
	)
}
