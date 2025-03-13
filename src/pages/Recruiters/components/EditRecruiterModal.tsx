import { fetchBranches } from '@api/branchApi'
import { fetchIntegrations } from '@api/integrationApi'
import { fetchUserById, updateUser } from '@api/userApi'
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
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const recruiterStatuses = ['Активен', 'Неактивен']
const userRoles = ['admin', 'user']

const generatePassword = () => {
	const charset =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
	let password = ''
	for (let i = 0; i < 12; i++) {
		password += charset[Math.floor(Math.random() * charset.length)]
	}
	return password
}

const EditRecruiterModal = ({ recruiterId, onClose, onRecruiterUpdated }) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [branches, setBranches] = useState([])
	const [integrations, setIntegrations] = useState([])
	const [successMessage, setSuccessMessage] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [newIntegration, setNewIntegration] = useState('')
	const [originalPassword, setOriginalPassword] = useState('') // 🔹 Храним старый пароль

	const [formData, setFormData] = useState({
		_id: '',
		firstName: '',
		lastName: '',
		middleName: '',
		birthDate: null, // ✅ Было '', стало null
		phone: '',
		telegram: '',
		whatsapp: '',
		viber: '',
		facebook: '',
		photo: null,
		role: 'user',
		status: 'Активен',
		email: '',
		password: '',
		integrations: [],
		branch: '',
	})

	const handleChange = (field: string, value: any) => {
		setFormData(prev => ({
			...prev,
			[field]: value ?? '', // ✅ Заменяем `null` на пустую строку
		}))
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
				},
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

	const handlePhoneChange = value => {
		const phoneRegex = /^[+0-9\s-]+$/ // Разрешает цифры, пробелы, `+` и `-`
		if (phoneRegex.test(value) || value === '') {
			handleChange('phone', value)
		}
	}

	const loadData = async () => {
		try {
			const userData = await fetchUserById(recruiterId)
			const branchList = await fetchBranches()
			const integrationList = await fetchIntegrations()

			setBranches(branchList)
			setIntegrations(integrationList)

			const validBranch = branchList.some(
				branch => branch._id === userData.branch
			)
				? userData.branch
				: branchList.length > 0
				? branchList[0]._id
				: ''

			setFormData({
				...userData,
				_id: userData._id, // ✅ Добавляем _id
				birthDate: userData.birthDate ? dayjs(userData.birthDate) : null,
				status: userData.isActive ? 'Активен' : 'Неактивен', // ✅ Меняем isActive на status
				branch: validBranch,
				password: '', // Пароль не загружаем
			})
		} catch (err) {
			console.error('Ошибка загрузки данных', err)
			setError('Ошибка загрузки данных')
		}
	}

	useEffect(() => {
		if (recruiterId) {
			loadData()
		}
	}, [recruiterId])

	const handleSubmit = async () => {
		setLoading(true)
		setError(null)

		if (!formData.firstName?.trim() || !formData.email?.trim()) {
			setError('Имя и Email обязательны для заполнения!')
			setLoading(false)
			return
		}

		try {
			const { _id, ...updatedUserData } = formData
			const userId = _id || recruiterId // ✅ Если _id нет, берем recruiterId

			console.log('📤 Отправляемые данные:', updatedUserData)

			const formDataToSend = new FormData()
			formDataToSend.append('userData', JSON.stringify(updatedUserData))

			if (formData.photo instanceof File) {
				formDataToSend.append('photo', formData.photo)
			}

			await updateUser(userId, formDataToSend)
			const updatedData = await fetchUserById(userId)
			setFormData(updatedData)

			setSuccessMessage(true)
			onRecruiterUpdated(updatedUserData)

			setTimeout(() => onClose(), 1500)
		} catch (err) {
			console.error('Ошибка при обновлении', err)
			setError('Ошибка при обновлении пользователя')
		} finally {
			setLoading(false)
		}
	}

	return (
		<ModalWrapper
			title='Редактирование рекрутера'
			open={!!recruiterId}
			onClose={onClose}
			actions={
				<>
					<Button onClick={onClose}>Отмена</Button>
					<Button color='primary' onClick={handleSubmit} disabled={loading}>
						{loading ? 'Сохранение...' : 'Сохранить'}
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
					{formData.photo && (
						<IconButton onClick={() => handleChange('photo', null)}>
							<DeleteIcon />
						</IconButton>
					)}
				</Box>

				<TextField
					label='Имя'
					value={formData.firstName || ''}
					onChange={e => handleChange('firstName', e.target.value)}
				/>

				<TextField
					label='Фамилия'
					value={formData.lastName || ''}
					onChange={e => handleChange('lastName', e.target.value)}
				/>
				<TextField
					label='Отчество'
					value={formData.middleName || ''}
					onChange={e => handleChange('middleName', e.target.value)}
				/>

				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker
						label='Дата рождения'
						value={formData.birthDate ? dayjs(formData.birthDate) : null} // ✅ null вместо undefined
						onChange={date =>
							handleChange('birthDate', date ? date.toISOString() : null)
						} // ✅ Ставим null, если нет даты
					/>
				</LocalizationProvider>

				<Typography variant='h6'>Данные для входа</Typography>
				<TextField
					label='Email'
					type='email'
					fullWidth
					value={formData.email || ''}
					onChange={e => handleChange('email', e.target.value)}
				/>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<TextField
						label='Пароль'
						type={showPassword ? 'text' : 'password'}
						fullWidth
						value={formData.password || ''}
						onChange={e => handleChange('password', e.target.value)}
						placeholder='Оставьте пустым, если не хотите менять'
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
					value={formData.phone || ''}
					onChange={e => handlePhoneChange(e.target.value)}
				/>

				<TextField
					label='Telegram'
					value={formData.telegram || ''}
					onChange={e => handleChange('telegram', e.target.value)}
				/>
				<TextField
					label='WhatsApp'
					value={formData.whatsapp || ''}
					onChange={e => handleChange('whatsapp', e.target.value)}
				/>
				<TextField
					label='Viber'
					value={formData.viber || ''}
					onChange={e => handleChange('viber', e.target.value)}
				/>
				<TextField
					label='Facebook'
					value={formData.facebook || ''}
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
							onChange={e => handleArrayChange(index, 'login', e.target.value)}
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
					value={formData.branch || branches[0]?._id || ''}
					onChange={e => handleChange('branch', e.target.value)}
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
					value={formData.status || 'Активен'}
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
	)
}

export default EditRecruiterModal
