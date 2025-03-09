import { getCsrfToken, login } from '@api/authApi'
import { useAuth } from '@context/AuthContext'
import { Box, Button, Checkbox, TextField, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useSnackbar } from 'notistack' // ✅ Импортируем notistack
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [csrfToken, setCsrfToken] = useState('')
	const [rememberMe, setRememberMe] = useState(false)
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const { login: authLogin } = useAuth()
	const { enqueueSnackbar } = useSnackbar() // ✅ Функция для показа алертов

	// Загружаем CSRF-токен при загрузке компонента
	useEffect(() => {
		const fetchCsrf = async () => {
			try {
				const token = await getCsrfToken()
				setCsrfToken(token)
			} catch (error) {
				console.error('Не удалось получить CSRF-токен')
			}
		}

		fetchCsrf()
	}, [])

	const handleSubmit = async () => {
		setLoading(true)

		try {
			const data = await login(email.trim(), password, rememberMe, csrfToken)
			console.log('Успешный вход:', data)

			// ✅ Показываем успех
			enqueueSnackbar('Успешный вход!', { variant: 'success' })

			// Сохраняем токен через AuthContext
			authLogin(data.refresh_token)

			// 🔥 Делаем редирект через 1 секунду
			setTimeout(() => {
				navigate('/dashboard')
			}, 1000)
		} catch (error) {
			console.error('Ошибка входа')

			// ✅ Показываем ошибку
			enqueueSnackbar('Ошибка: неправильный email или пароль!', {
				variant: 'error',
			})
		} finally {
			setLoading(false)
		}
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
				/>
				<TextField
					label='Пароль'
					type='password'
					fullWidth
					margin='normal'
					value={password}
					onChange={e => setPassword(e.target.value)}
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
