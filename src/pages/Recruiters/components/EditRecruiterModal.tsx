import { fetchBranches } from '@api/branchApi'
import { fetchUserById, updateUser } from '@api/userApi'
import { ModalWrapper } from '@components/index'
import {
	Avatar,
	Box,
	Button,
	MenuItem,
	Snackbar,
	TextField,
	Typography,
} from '@mui/material'

import { fetchIntegrations } from '@api/integrationApi'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const recruiterStatuses = ['Активен', 'Неактивен']
const userRoles = ['admin', 'user']

const EditRecruiterModal = ({ recruiterId, onClose, onRecruiterUpdated }) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [branches, setBranches] = useState([])
	const [integrations, setIntegrations] = useState([])
	const [successMessage, setSuccessMessage] = useState(false)

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
		role: 'user',
		status: 'Активен',
		email: '',
		password: '',
		integrations: [],
		branch: '',
	})

	useEffect(() => {
		const loadData = async () => {
			try {
				const userData = await fetchUserById(recruiterId)
				const branchList = await fetchBranches()
				const integrationList = await fetchIntegrations()

				setBranches(branchList)
				setIntegrations(integrationList)

				setFormData({
					...userData,
					birthDate: userData.birthDate ? dayjs(userData.birthDate) : null,
					status: userData.isActive ? 'Активен' : 'Неактивен',
				})
			} catch (err) {
				console.error('Ошибка загрузки данных', err)
				setError('Ошибка загрузки данных')
			}
		}

		if (recruiterId) {
			loadData()
		}
	}, [recruiterId])

	const handleChange = (field: string, value: any) => {
		setFormData(prev => ({ ...prev, [field]: value }))
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

		if (!formData.firstName?.trim() || !formData.email?.trim()) {
			setError('Имя и Email обязательны для заполнения!')
			setLoading(false)
			return
		}

		try {
			const updatedUserData = {
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
				branch: formData.branch,
			}

			const formDataToSend = new FormData()
			formDataToSend.append('userData', JSON.stringify(updatedUserData))

			if (formData.photo instanceof File) {
				formDataToSend.append('photo', formData.photo)
			}

			await updateUser(recruiterId, formDataToSend)

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
		<>
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
							value={formData.birthDate}
							onChange={date => handleChange('birthDate', date)}
						/>
					</LocalizationProvider>

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

					<TextField
						select
						label='Филиал'
						value={formData.branch}
						onChange={e => handleChange('branch', e.target.value)}
					>
						{branches.map(branch => (
							<MenuItem key={branch._id} value={branch._id}>
								{branch.name}
							</MenuItem>
						))}
					</TextField>

					{error && <Typography color='error'>{error}</Typography>}
				</Box>
			</ModalWrapper>

			<Snackbar
				open={successMessage}
				autoHideDuration={2000}
				onClose={() => setSuccessMessage(false)}
				message='Данные успешно обновлены!'
			/>
		</>
	)
}

export default EditRecruiterModal
