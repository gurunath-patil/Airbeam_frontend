import { useEffect, useState } from 'react'
export default function CircularProgress({ percentage }: { percentage: number }) {
	const radius = 87
	const strokeWidth = 5
	const normalizedRadius = radius - strokeWidth * 2
	const circumference = normalizedRadius * 2 * Math.PI
	const strokeDashoffset = circumference - (percentage / 100) * circumference
	const [transferProgressPercentage, setTransferProgressPercentage] = useState<string>('')

	useEffect(() => {
		setTransferProgressPercentage(percentage.toFixed(0))
	}, [percentage])
	return (
		<div className='relative w-44 h-44 flex items-center justify-center'>
			<svg height={radius * 2} width={radius * 2} className='transform -rotate-90 w-full h-full'>
				{/* Background Track Circle */}
				<circle
					stroke='#e9ecef'
					fill='transparent'
					strokeWidth={strokeWidth}
					r={normalizedRadius}
					cx={radius}
					cy={radius}
				/>
				{/* Animated Active Progress Circle */}
				<circle
					stroke={'#000000'}
					fill='transparent'
					strokeWidth={strokeWidth}
					strokeDasharray={circumference + ' ' + circumference}
					style={{ strokeDashoffset }}
					strokeLinecap='round'
					className='transition-all duration-300 ease-out'
					r={normalizedRadius}
					cx={radius}
					cy={radius}
				/>
			</svg>

			{/* Center Label */}
			<div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
				<span className='text-4xl font-light tracking-tight text-slate-900'>
					{transferProgressPercentage}
				</span>
				<span className='text-[10px] font-semibold tracking-widest text-slate-400 mt-1 uppercase'>
					PERCENT
				</span>
			</div>
		</div>
	)
}
