import { login } from '@api/authApi'
import { useAuth } from '@context/AuthContext'
import { Box, Button, Checkbox, TextField, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useSnackbar } from 'notistack' // ✅ Импортируем notistack
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [rememberMe, setRememberMe] = useState(false)
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const { login: authLogin } = useAuth()
	const { enqueueSnackbar } = useSnackbar() // ✅ Функция для показа алертов

	const handleSubmit = async () => {
		if (!email.trim() || !password) {
			enqueueSnackbar('Введите email и пароль!', { variant: 'warning' })
			return
		}

		setLoading(true)

		try {
			const data = await login(email.trim(), password, rememberMe)

			enqueueSnackbar('🎉 Успешный вход!', { variant: 'success' })

			authLogin(data.refresh_token)

			setTimeout(() => navigate('/dashboard'), 1000)
		} catch (error) {
			enqueueSnackbar(
				error.message || 'Ошибка: неправильный email или пароль!',
				{
					variant: 'error',
				}
			)
		} finally {
			setLoading(false)
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') handleSubmit()
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
		>
			<Box sx={{ width: '70%' }}>
				<Typography fontWeight='bold' fontSize={22} mb={1}>
					Добро пожаловать
				</Typography>
				<Typography color='gray' mb={3}>
					Введите свои данные для входа
				</Typography>

				<TextField
					label='Email'
					fullWidth
					margin='normal'
					value={email}
					onChange={e => setEmail(e.target.value)}
					onKeyPress={handleKeyPress}
				/>
				<TextField
					label='Пароль'
					type='password'
					fullWidth
					margin='normal'
					value={password}
					onChange={e => setPassword(e.target.value)}
					onKeyPress={handleKeyPress}
				/>
				<Box display='flex' alignItems='center' mt={1}>
					<Checkbox
						checked={rememberMe}
						onChange={e => setRememberMe(e.target.checked)}
					/>
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
					onClick={handleSubmit}
					disabled={loading}
				>
					{loading ? 'Загрузка...' : 'Войти'}
				</Button>
			</Box>
		</motion.div>
	)
}

export default LoginForm
