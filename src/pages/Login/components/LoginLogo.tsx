import { motion } from 'framer-motion'
import { shapes } from '../shapes'

const LoginLogo = () => {
	return (
		<div
			style={{
				width: '100%',
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#121212',
			}}
		>
			<motion.svg
				width='400'
				height='500'
				viewBox='0 0 2314.26 3109.8'
				xmlns='http://www.w3.org/2000/svg'
			>
				<defs>
					<linearGradient id='themeGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
						<stop offset='0%' stopColor='#6A5ACD'>
							<animate
								attributeName='stop-color'
								values='#6A5ACD; #483D8B; #6A5ACD'
								dur='3s'
								repeatCount='indefinite'
							/>
						</stop>
						<stop offset='100%' stopColor='#483D8B'>
							<animate
								attributeName='stop-color'
								values='#483D8B; #6A5ACD; #483D8B'
								dur='3s'
								repeatCount='indefinite'
							/>
						</stop>
					</linearGradient>
				</defs>

				{shapes.map((shape, index) => (
					<motion.path
						key={index}
						d={shape.d}
						stroke='url(#themeGradient)'
						strokeWidth='3'
						fill='none'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeDasharray='0 400'
						animate={{
							strokeDasharray: ['0 400', '400 0'],
							transition: {
								duration: 3,
								ease: 'easeInOut',
								delay: index * 0.2,
								repeat: Infinity,
							},
						}}
					/>
				))}
			</motion.svg>
		</div>
	)
}

export default LoginLogo
