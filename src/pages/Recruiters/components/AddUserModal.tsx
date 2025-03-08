import { ModalWrapper } from '@components/index'
import DeleteIcon from '@mui/icons-material/Delete'
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

const AddRecruiterModal = () => {
	const [open, setOpen] = useState(false)
	const [newIntegration, setNewIntegration] = useState('') // Тип интеграции
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		middleName: '',
		birthDate: null,
		phone: '',
		email: '',
		telegram: '',
		whatsapp: '',
		viber: '',
		facebook: '',
		photo: '',
		status: '',
		integrations: [{ type: '', login: '', password: '' }],
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
		if (!newIntegration) return
		setFormData(prev => ({
			...prev,
			integrations: [
				...prev.integrations,
				{ type: newIntegration, login: '', password: '' },
			],
		}))
		setNewIntegration('') // Очистка выбора
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
			const reader = new FileReader()
			reader.onload = () => {
				setFormData(prev => ({
					...prev,
					photo: reader.result as string,
				}))
			}
			reader.readAsDataURL(file)
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
						<Button color='primary' onClick={() => console.log(formData)}>
							Добавить
						</Button>
					</>
				}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Typography variant='h6'>Основная информация</Typography>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Avatar
							src={formData.photo || '/default-avatar.png'}
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

					<Typography variant='h6'>Контакты</Typography>
					<TextField
						label='Телефон'
						value={formData.phone}
						onChange={e => handleChange('phone', e.target.value)}
					/>
					<TextField
						label='Email'
						value={formData.email}
						onChange={e => handleChange('email', e.target.value)}
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

					{formData.integrations.map((integration, index) => (
						<Box key={index} sx={{ display: 'flex', gap: 1 }}>
							<TextField
								label={`Логин (${integration.type})`}
								value={integration.login}
								onChange={e =>
									handleArrayChange(index, 'login', e.target.value)
								}
							/>
							<TextField
								label='Пароль'
								type='password'
								value={integration.password}
								onChange={e =>
									handleArrayChange(index, 'password', e.target.value)
								}
							/>
							<IconButton onClick={() => removeIntegration(index)}>
								<DeleteIcon />
							</IconButton>
						</Box>
					))}

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
				</Box>
			</ModalWrapper>
		</>
	)
}

export default AddRecruiterModal
