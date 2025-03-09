import { Box, Button, Checkbox, TextField, Typography } from '@mui/material'

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
					width: '60%',
					height: '100%',
					backgroundColor: '#fff',
					padding: 4,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					boxShadow: 3,
					borderRadius: 2,
					alignSelf: 'center',
				}}
			>
				<Box
					sx={{
						width: '70%',
					}}
				>
					<Typography fontWeight='bold' fontSize={22} mb={1}>
						Добро пожаловать
					</Typography>
					<Typography color='gray' mb={3}>
						Введите свои данные для входа
					</Typography>
					<TextField label='Email' fullWidth margin='normal' />
					<TextField label='Пароль' type='password' fullWidth margin='normal' />
					<Box display='flex' alignItems='center' mt={1}>
						<Checkbox />
						<Typography>Запомнить меня</Typography>
						<Box sx={{ flexGrow: 1 }} />
						<Typography color='primary' sx={{ cursor: 'pointer' }}>
							Забыли пароль?
						</Typography>
					</Box>
					<Button
						variant='contained'
						fullWidth
						sx={{ mt: 2, backgroundColor: '#6A5ACD' }}
					>
						Войти
					</Button>
				</Box>
			</Box>

			{/* Правая часть с графикой */}
			<Box
				sx={{
					width: '60%',
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
				sx={{ position: 'absolute', top: 20, left: 30, fontWeight: 'bold' }}
			>
				● Untitled UI
			</Typography>

			{/* Нижний левый угол */}
			<Typography
				sx={{
					position: 'absolute',
					bottom: 20,
					left: 30,
					color: 'gray',
					fontSize: 14,
				}}
			>
				© Untitled UI 2077
			</Typography>
		</Box>
	)
}

export default LoginPage
