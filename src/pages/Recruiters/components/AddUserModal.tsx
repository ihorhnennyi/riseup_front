import { fetchBranches } from '@api/branchApi'
import { createUser } from '@api/userApi'
import { ModalWrapper } from '@components/index'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import DeleteIcon from '@mui/icons-material/Delete'
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

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import dayjs from 'dayjs'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useEffect, useState } from 'react'

import { fetchIntegrations } from '@api/integrationApi'
import { LocalizationProvider } from '@mui/x-date-pickers'

const recruiterStatuses = ['Активен', 'Неактивен']
const userRoles = ['admin', 'recruiter']

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
	const [branches, setBranches] = useState([])
	const [integrations, setIntegrations] = useState([])

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
		role: 'recruiter',
		status: 'Активен',
		email: '',
		password: generatePassword(),
		integrations: [],
		branch: '',
	})

	useEffect(() => {
		const loadBranches = async () => {
			try {
				const data = await fetchBranches()
				setBranches(data)

				const integrationData = await fetchIntegrations()
				setIntegrations(integrationData)
			} catch (error) {
				console.error('Ошибка загрузки филиалов', error)
			}
		}
		loadBranches()
	}, [])

	const handleChange = (field: string, value: any) => {
		if (field === 'birthDate' && value) {
			const formattedDate = new Date(value).toISOString() // ✅ Преобразуем в ISO 8601
			setFormData(prev => ({ ...prev, birthDate: formattedDate }))
		} else {
			setFormData(prev => ({ ...prev, [field]: value }))
		}
	}

	const handleArrayChange = (index: number, field: string, value: string) => {
		setFormData(prev => {
			const updatedIntegrations = [...prev.integrations]
			updatedIntegrations[index] = {
				...updatedIntegrations[index],
				[field]: value,
			}
			return { ...prev, integrations: updatedIntegrations }
		})
	}

	const addIntegration = () => {
		if (!newIntegration.trim()) return

		const selectedIntegration = integrations.find(
			integration => integration._id === newIntegration
		)
		if (!selectedIntegration) return

		setFormData(prev => ({
			...prev,
			integrations: [
				...prev.integrations,
				{
					id: selectedIntegration._id,
					name: selectedIntegration.name,
					login: '',
					password: '',
				}, // ✅ Добавляем логин и пароль
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
			console.log('Загруженный файл:', file)
			setFormData(prev => ({ ...prev, photo: file })) // 🟢 Теперь точно сохраняем файл
		} else {
			console.error('Ошибка загрузки фото')
		}
	}

	const handleSubmit = async () => {
		setLoading(true)
		setError(null)

		if (
			!formData.firstName?.trim() ||
			!formData.email?.trim() ||
			!formData.password?.trim()
		) {
			setError('Все обязательные поля должны быть заполнены!')
			setLoading(false)
			return
		}

		try {
			const userJson = {
				firstName: formData.firstName.trim(),
				lastName: formData.lastName.trim() || '',
				middleName: formData.middleName.trim() || '',
				birthDate: formData.birthDate
					? new Date(formData.birthDate).toISOString()
					: null,
				phone: formData.phone.trim() || null,
				telegram: formData.telegram.trim() || null,
				whatsapp: formData.whatsapp.trim() || null,
				viber: formData.viber.trim() || null,
				facebook: formData.facebook.trim() || null,
				role: formData.role,
				isActive: formData.status === 'Активен',
				email: formData.email.trim(),
				password: formData.password.trim(),
				branch: formData.branch,
				integrations: formData.integrations,
			}

			const formDataToSend = new FormData()
			formDataToSend.append('userData', JSON.stringify(userJson))

			// Добавляем файл фото, если есть
			if (formData.photo instanceof File) {
				formDataToSend.append('photo', formData.photo)
			}

			console.log(
				'🚀 Отправляемые данные:',
				Object.fromEntries((formDataToSend as any).entries())
			)

			// Отправляем запрос
			const response = await createUser(formDataToSend)
			console.log('✅ Ответ сервера:', response)

			setOpen(false)
			if (onUserCreated) {
				onUserCreated()
			}
		} catch (err) {
			console.error('❌ Ошибка при отправке данных:', err)
			setError(
				err.response?.data?.message || 'Ошибка при создании пользователя'
			)
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
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							label='Дата рождения'
							value={formData.birthDate ? dayjs(formData.birthDate) : null}
							onChange={date => handleChange('birthDate', date?.toISOString())}
						/>
					</LocalizationProvider>

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
						{integrations.map(integration => (
							<MenuItem key={integration._id} value={integration._id}>
								{integration.name}
							</MenuItem>
						))}
					</TextField>

					<Button onClick={addIntegration}>Добавить интеграцию</Button>

					{formData.integrations.map((integration, index) => (
						<Box
							key={integration.id}
							sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
						>
							<TextField
								label={`Логин (${integration.name})`}
								value={integration.login}
								onChange={e =>
									handleArrayChange(index, 'login', e.target.value)
								}
								fullWidth
							/>
							<TextField
								label='Пароль'
								type='password'
								value={integration.password}
								onChange={e =>
									handleArrayChange(index, 'password', e.target.value)
								}
								fullWidth
							/>
							<IconButton onClick={() => removeIntegration(index)}>
								<DeleteIcon />
							</IconButton>
						</Box>
					))}

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

					<TextField
						select
						label='Филиал'
						value={formData.branch}
						onChange={e => handleChange('branch', e.target.value)}
						sx={{ mt: 2 }}
					>
						{branches.map(branch => (
							<MenuItem key={branch._id} value={branch._id}>
								{branch.name}
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
