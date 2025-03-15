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
import { Link, useNavigate } from 'react-router-dom'

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
		const trimmedEmail = email.trim()
		if (!trimmedEmail || !password) {
			enqueueSnackbar('Введите email и пароль!', { variant: 'warning' })
			return
		}

		setLoading(true)

		try {
			const { access_token, role } = await login(
				trimmedEmail,
				password,
				rememberMe
			)
			enqueueSnackbar('🎉 Успешный вход!', { variant: 'success' })
			authLogin(access_token, role)
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

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') handleSubmit()
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
		>
			<Box
				sx={{ width: '100%', maxWidth: 400, mx: 'auto', textAlign: 'center' }}
			>
				<Typography fontWeight='bold' fontSize={28} mb={2} color='#A8A8FF'>
					Добро пожаловать 👋
				</Typography>
				<Typography color='#bbb' fontSize={16} mb={3}>
					Введите свои данные для входа в систему
				</Typography>

				<TextField
					label='Email'
					fullWidth
					margin='normal'
					value={email}
					onChange={e => setEmail(e.target.value)}
					onKeyDown={handleKeyDown}
					variant='outlined'
					sx={{
						'& fieldset': { borderColor: '#A0A0A0' },
						'& label': { color: '#A0A0A0' },
						'& input': { color: '#fff' }, // ✅ Белый цвет текста
					}}
				/>

				<TextField
					label='Пароль'
					type={showPassword ? 'text' : 'password'}
					fullWidth
					margin='normal'
					value={password}
					onChange={e => setPassword(e.target.value)}
					onKeyDown={handleKeyDown}
					variant='outlined'
					sx={{
						'& fieldset': { borderColor: '#A0A0A0' },
						'& label': { color: '#A0A0A0' },
						'& input': { color: '#fff' }, // ✅ Белый цвет пароля
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton
									onClick={() => setShowPassword(!showPassword)}
									edge='end'
									sx={{ color: '#A8A8FF' }}
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						),
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
							sx={{ color: '#A8A8FF' }}
						/>
						<Typography color='#fff'>Запомнить меня</Typography>
					</Box>

					<Link
						to='/forgot-password'
						style={{ textDecoration: 'none', color: '#A8A8FF' }}
					>
						Забыли пароль?
					</Link>
				</Box>

				<Button
					variant='contained'
					fullWidth
					sx={{
						mt: 3,
						background: 'linear-gradient(90deg, #6A5ACD, #836FFF)',
						color: '#fff',
						borderRadius: '8px',
						'&:hover': {
							background: 'linear-gradient(90deg, #5A4ACD, #726EFF)',
						},
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
