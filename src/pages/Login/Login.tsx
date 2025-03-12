import { Box, Typography } from '@mui/material'
import LoginForm from './components/LoginForm' // ✅ Импортируем LoginForm

const LoginPage = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				width: '100vw',
				height: '100vh',
				backgroundColor: '#EDEDF3',
			}}
		>
			{/* Левая часть с формой */}
			<Box
				sx={{
					width: '50%',
					height: '100%',
					backgroundColor: '#fff',
					padding: 5,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					boxShadow: 3,
				}}
			>
				<LoginForm /> {/* ✅ Используем форму логина */}
			</Box>

			{/* Правая часть с графикой */}
			<Box
				sx={{
					width: '50%',
					height: '100%',
					backgroundColor: '#F4F4F8',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Box
					sx={{
						width: 100,
						height: 100,
						borderRadius: '50%',
						backgroundColor: '#6A5ACD',
						boxShadow: '0px 10px 30px rgba(106, 90, 205, 0.5)',
						position: 'relative',
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: 0,
							right: 0,
							height: '50%',
							backgroundColor: '#F4F4F8',
							borderTopLeftRadius: '50%',
							borderTopRightRadius: '50%',
						}}
					/>
				</Box>
			</Box>

			{/* Верхний левый угол */}
			<Typography
				sx={{
					position: 'absolute',
					top: 20,
					left: 30,
					fontWeight: 'bold',
					color: '#6A5ACD',
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
					color: '#777',
					fontSize: 14,
				}}
			>
				© RiseUp 2025
			</Typography>
		</Box>
	)
}

export default LoginPage
