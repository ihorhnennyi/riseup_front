import { Box, Typography } from '@mui/material'
import LoginForm from './components/LoginForm'
import LoginLogo from './components/LoginLogo'

const LoginPage = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				width: '100vw',
				height: '100vh',
				background: 'linear-gradient(135deg, #6A5ACD, #483D8B)',
				color: '#fff',
			}}
		>
			{/* Левая часть с формой */}
			<Box
				sx={{
					width: '50%',
					height: '100%',
					backgroundColor: '#1E1E2E',
					padding: 5,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					boxShadow: 3,
				}}
			>
				<LoginForm />
			</Box>

			{/* Правая часть с логотипом */}
			<Box
				sx={{
					width: '50%',
					height: '100%',
					backgroundColor: '#222244',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: '0 20px 20px 0',
				}}
			>
				<LoginLogo />
			</Box>

			{/* Верхний левый угол */}
			<Typography
				sx={{
					position: 'absolute',
					top: 20,
					left: 30,
					fontWeight: 'bold',
					color: '#A8A8FF',
					fontSize: 20,
				}}
			>
				● RiseUp
			</Typography>

			{/* Нижний левый угол */}
			<Typography
				sx={{
					position: 'absolute',
					bottom: 20,
					left: 30,
					color: '#A8A8FF',
					fontSize: 14,
				}}
			>
				© RiseUp 2025
			</Typography>
		</Box>
	)
}

export default LoginPage
