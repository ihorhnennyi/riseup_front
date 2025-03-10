import { login } from '@api/authApi'
import { useAuth } from '@context/AuthContext'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
	Box,
	Button,
	Checkbox,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [rememberMe, setRememberMe] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const { login: authLogin } = useAuth()
	const { enqueueSnackbar } = useSnackbar()

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
			<Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
				<Typography
					fontWeight='bold'
					fontSize={26}
					mb={2}
					textAlign='center'
					color='#333'
				>
					Добро пожаловать
				</Typography>
				<Typography color='#555' fontSize={18} mb={3} textAlign='center'>
					Введите свои данные для входа
				</Typography>

				<TextField
					label='Email'
					fullWidth
					margin='normal'
					value={email}
					onChange={e => setEmail(e.target.value)}
					onKeyPress={handleKeyPress}
					variant='outlined'
					sx={{
						backgroundColor: '#fff',
						input: { color: '#333' },
						'& label': { color: '#777' },
						'& .MuiOutlinedInput-root': {
							'& fieldset': { borderColor: '#aaa' },
							'&:hover fieldset': { borderColor: '#6A5ACD' },
							'&.Mui-focused fieldset': { borderColor: '#6A5ACD' },
						},
					}}
				/>

				<TextField
					label='Пароль'
					type={showPassword ? 'text' : 'password'}
					fullWidth
					margin='normal'
					value={password}
					onChange={e => setPassword(e.target.value)}
					onKeyPress={handleKeyPress}
					variant='outlined'
					sx={{
						backgroundColor: '#fff',
						input: { color: '#333' },
						'& label': { color: '#777' },
						'& .MuiOutlinedInput-root': {
							'& fieldset': { borderColor: '#aaa' },
							'&:hover fieldset': { borderColor: '#6A5ACD' },
							'&.Mui-focused fieldset': { borderColor: '#6A5ACD' },
						},
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton
									onClick={() => setShowPassword(!showPassword)}
									edge='end'
									sx={{ color: '#6A5ACD' }} // ✅ Делаем глазик видимым
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>

				<Box display='flex' alignItems='center' mt={1}>
					<Checkbox
						checked={rememberMe}
						onChange={e => setRememberMe(e.target.checked)}
						sx={{ color: '#6A5ACD' }}
					/>
					<Typography color='#333'>Запомнить меня</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<Typography color='primary' sx={{ cursor: 'pointer', fontSize: 14 }}>
						Забыли пароль?
					</Typography>
				</Box>

				<Button
					variant='contained'
					fullWidth
					sx={{
						mt: 3,
						backgroundColor: '#6A5ACD',
						'&:hover': { backgroundColor: '#5a4bcf' },
						fontWeight: 'bold',
						fontSize: 16,
						py: 1.5,
						boxShadow: '0px 5px 15px rgba(106, 90, 205, 0.4)', // ✅ Тень для кнопки
					}}
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
