import { login as apiLogin } from '@api/authApi'
import { useAuth } from '@context/AuthContext'
import { Box, Button, Checkbox, TextField, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const LoginForm = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [rememberMe, setRememberMe] = useState(false)
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const { login } = useAuth()
	const { enqueueSnackbar } = useSnackbar()

	const handleSubmit = async () => {
		const trimmedEmail = email.trim()
		if (!trimmedEmail || !password) {
			enqueueSnackbar('Введите email и пароль!', { variant: 'warning' })
			return
		}

		setLoading(true)

		try {
			const { role } = await apiLogin(trimmedEmail, password, rememberMe)
			enqueueSnackbar('🎉 Успешный вход!', { variant: 'success' })
			login(role)
			navigate('/dashboard')
		} catch (error: any) {
			enqueueSnackbar(
				error?.response?.data?.message ||
					'Ошибка: неправильный email или пароль!',
				{ variant: 'error' }
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
			<Typography fontWeight='bold' fontSize={28} mb={2} color='#A8A8FF'>
				Добро пожаловать 👋
			</Typography>

			<TextField
				label='Email'
				fullWidth
				margin='normal'
				value={email}
				onChange={e => setEmail(e.target.value)}
				variant='outlined'
				sx={{
					input: { color: 'white' }, // Цвет текста
					label: { color: 'white' }, // Цвет плейсхолдера
					'& .MuiOutlinedInput-root': {
						'& fieldset': { borderColor: 'white' }, // Цвет рамки
						'&:hover fieldset': { borderColor: '#A8A8FF' }, // Цвет рамки при наведении
						'&.Mui-focused fieldset': { borderColor: '#A8A8FF' }, // Цвет рамки при фокусе
					},
				}}
			/>

			<TextField
				label='Пароль'
				type='password'
				fullWidth
				margin='normal'
				value={password}
				onChange={e => setPassword(e.target.value)}
				variant='outlined'
				sx={{
					input: { color: 'white' }, // Цвет текста
					label: { color: 'white' }, // Цвет плейсхолдера
					'& .MuiOutlinedInput-root': {
						'& fieldset': { borderColor: 'white' }, // Цвет рамки
						'&:hover fieldset': { borderColor: '#A8A8FF' }, // Цвет рамки при наведении
						'&.Mui-focused fieldset': { borderColor: '#A8A8FF' }, // Цвет рамки при фокусе
					},
				}}
			/>

			<Box
				display='flex'
				alignItems='center'
				justifyContent='space-between'
				mt={1}
			>
				<Box display='flex' alignItems='center'>
					<Checkbox
						checked={rememberMe}
						onChange={e => setRememberMe(e.target.checked)}
					/>
					<Typography>Запомнить меня</Typography>
				</Box>
				<Link to='/forgot-password'>Забыли пароль?</Link>
			</Box>

			<Button
				variant='contained'
				fullWidth
				onClick={handleSubmit}
				disabled={loading}
			>
				{loading ? 'Загрузка...' : 'Войти'}
			</Button>
		</Box>
	)
}

export default LoginForm
