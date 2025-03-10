import { createUser } from '@api/userApi'
import { ModalWrapper } from '@components/index'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
	Avatar,
	Box,
	Button,
	IconButton,
	MenuItem,
	TextField,
	Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useState } from 'react'

const recruiterStatuses = ['Активен', 'Неактивен']
const integrationTypes = ['Google', 'Facebook', 'LinkedIn', 'GitHub']
const userRoles = ['ADMIN', 'USER']

const generatePassword = () => {
	const charset =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
	let password = ''
	for (let i = 0; i < 12; i++) {
		password += charset[Math.floor(Math.random() * charset.length)]
	}
	return password
}

const AddRecruiterModal = ({ onUserCreated }) => {
	const [open, setOpen] = useState(false)
	const [newIntegration, setNewIntegration] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		middleName: '',
		birthDate: null,
		phone: '',
		telegram: '',
		whatsapp: '',
		viber: '',
		facebook: '',
		photo: null,
		role: 'USER',
		status: 'Активен',
		email: '',
		password: generatePassword(),
		integrations: [],
	})

	const handleChange = (field: string, value: any) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handleArrayChange = (index: number, field: string, value: string) => {
		setFormData(prev => {
			const newArray = [...prev.integrations]
			newArray[index] = { ...newArray[index], [field]: value }
			return { ...prev, integrations: newArray }
		})
	}

	const addIntegration = () => {
		if (!newIntegration.trim()) return
		setFormData(prev => ({
			...prev,
			integrations: [
				...prev.integrations,
				{ type: newIntegration, login: '', password: '' },
			],
		}))
		setNewIntegration('')
	}

	const removeIntegration = (index: number) => {
		setFormData(prev => ({
			...prev,
			integrations: prev.integrations.filter((_, i) => i !== index),
		}))
	}

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setFormData(prev => ({ ...prev, photo: file }))
		}
	}

	const handleSubmit = async () => {
		setLoading(true)
		setError(null)

		if (!formData.firstName || !formData.lastName || !formData.email) {
			setError('Заполните все обязательные поля!')
			setLoading(false)
			return
		}

		try {
			const userData = new FormData()
			Object.keys(formData).forEach(key => {
				if (key === 'photo' && formData.photo instanceof File) {
					userData.append('photo', formData.photo)
				} else if (
					typeof formData[key] === 'object' &&
					formData[key] !== null
				) {
					userData.append(key, JSON.stringify(formData[key]))
				} else {
					userData.append(key, formData[key])
				}
			})

			await createUser(userData)
			setOpen(false)
			onUserCreated()
		} catch (err) {
			setError('Ошибка при создании пользователя')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Button variant='contained' onClick={() => setOpen(true)}>
				Добавить рекрутера
			</Button>

			<ModalWrapper
				title='Добавление рекрутера'
				open={open}
				onClose={() => setOpen(false)}
				actions={
					<>
						<Button onClick={() => setOpen(false)}>Отмена</Button>
						<Button color='primary' onClick={handleSubmit} disabled={loading}>
							{loading ? 'Создание...' : 'Добавить'}
						</Button>
					</>
				}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Typography variant='h6'>Основная информация</Typography>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Avatar
							src={
								formData.photo
									? URL.createObjectURL(formData.photo)
									: '/default-avatar.png'
							}
							sx={{ width: 80, height: 80 }}
						/>
						<Button variant='contained' component='label'>
							Загрузить фото
							<input type='file' hidden onChange={handlePhotoChange} />
						</Button>
					</Box>

					<TextField
						label='Имя'
						value={formData.firstName}
						onChange={e => handleChange('firstName', e.target.value)}
					/>
					<TextField
						label='Фамилия'
						value={formData.lastName}
						onChange={e => handleChange('lastName', e.target.value)}
					/>
					<TextField
						label='Отчество'
						value={formData.middleName}
						onChange={e => handleChange('middleName', e.target.value)}
					/>
					<DatePicker
						label='Дата рождения'
						value={formData.birthDate}
						onChange={date => handleChange('birthDate', date)}
					/>

					<Typography variant='h6'>Данные для входа</Typography>
					<TextField
						label='Email'
						type='email'
						fullWidth
						value={formData.email}
						onChange={e => handleChange('email', e.target.value)}
					/>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<TextField
							label='Пароль'
							type={showPassword ? 'text' : 'password'}
							fullWidth
							value={formData.password}
							onChange={e => handleChange('password', e.target.value)}
						/>
						<IconButton onClick={() => setShowPassword(!showPassword)}>
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
						<IconButton
							onClick={() => handleChange('password', generatePassword())}
						>
							<AutorenewIcon />
						</IconButton>
					</Box>

					<Typography variant='h6'>Контакты</Typography>
					<TextField
						label='Телефон'
						value={formData.phone}
						onChange={e => handleChange('phone', e.target.value)}
					/>
					<TextField
						label='Telegram'
						value={formData.telegram}
						onChange={e => handleChange('telegram', e.target.value)}
					/>
					<TextField
						label='WhatsApp'
						value={formData.whatsapp}
						onChange={e => handleChange('whatsapp', e.target.value)}
					/>
					<TextField
						label='Viber'
						value={formData.viber}
						onChange={e => handleChange('viber', e.target.value)}
					/>
					<TextField
						label='Facebook'
						value={formData.facebook}
						onChange={e => handleChange('facebook', e.target.value)}
					/>

					<Typography variant='h6'>Интеграции</Typography>
					<TextField
						select
						label='Выбрать сервис интеграции'
						value={newIntegration}
						onChange={e => setNewIntegration(e.target.value)}
					>
						{integrationTypes.map(type => (
							<MenuItem key={type} value={type}>
								{type}
							</MenuItem>
						))}
					</TextField>
					<Button onClick={addIntegration}>Добавить интеграцию</Button>

					<Typography variant='h6'>Роль</Typography>
					<TextField
						select
						label='Роль'
						value={formData.role}
						onChange={e => handleChange('role', e.target.value)}
					>
						{userRoles.map(role => (
							<MenuItem key={role} value={role}>
								{role}
							</MenuItem>
						))}
					</TextField>

					<Typography variant='h6'>Статус</Typography>
					<TextField
						select
						label='Статус'
						value={formData.status}
						onChange={e => handleChange('status', e.target.value)}
					>
						{recruiterStatuses.map(status => (
							<MenuItem key={status} value={status}>
								{status}
							</MenuItem>
						))}
					</TextField>

					{error && <Typography color='error'>{error}</Typography>}
				</Box>
			</ModalWrapper>
		</>
	)
}

export default AddRecruiterModal
