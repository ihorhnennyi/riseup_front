import { fetchLeadById, updateLead } from '@api/leadsApi'
import { fetchStatuses } from '@api/statusApi'
import { fetchUsers } from '@api/userApi'
import { useAuth } from '@context/AuthContext'
import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	MenuItem,
	TextField,
	Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const EditCandidateModal = ({ leadId, onClose, onLeadUpdated }) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [statuses, setStatuses] = useState([])
	const [users, setUsers] = useState([])
	const [photoModalOpen, setPhotoModalOpen] = useState(false)
	const [photoUrl, setPhotoUrl] = useState<string | null>(null)
	const [tempUrl, setTempUrl] = useState('')
	const { isAdmin } = useAuth()

	const [formData, setFormData] = useState({
		name: '',
		surname: '',
		middleName: '',
		email: '',
		phone: '',
		age: '',
		photo: '',
		telegram: '',
		salaryExpectation: '',
		relocation: false,
		remoteWork: true,
		notes: '',
		statusId: '',
		statusEndDate: '',
		recruiter: '',
		createdBy: '',
	})

	useEffect(() => {
		const loadLeadData = async () => {
			try {
				const leadData = await fetchLeadById(leadId)

				setFormData({
					...leadData,
					statusId: leadData.statusId?._id || '',
					recruiter: leadData.recruiter?._id || '',
					createdBy: leadData.createdBy?._id || '',
					statusEndDate: leadData.statusEndDate
						? dayjs(leadData.statusEndDate)
						: null,
				})

				setPhotoUrl(leadData.photo || null)
			} catch (err) {
				console.error('Ошибка загрузки лида:', err)
				setError('Не удалось загрузить данные лида')
			}
		}

		if (leadId) {
			loadLeadData()
			fetchStatuses().then(setStatuses).catch(console.error)
			fetchUsers().then(setUsers).catch(console.error)
		}
	}, [leadId])

	const handleChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handleOpenPhotoModal = () => {
		setTempUrl(photoUrl || '')
		setPhotoModalOpen(true)
	}

	const handleSavePhotoUrl = () => {
		if (tempUrl.trim()) {
			setPhotoUrl(tempUrl)
			setFormData(prev => ({ ...prev, photo: tempUrl }))
		}
		setPhotoModalOpen(false)
	}

	const handleSubmit = async () => {
		setLoading(true)
		setError(null)

		if (!formData.name.trim()) {
			setError('Имя обязательно для заполнения')
			setLoading(false)
			return
		}

		try {
			const formattedData = {
				...formData,
				age: Number(formData.age) || undefined,
				salaryExpectation: formData.salaryExpectation
					? Number(formData.salaryExpectation)
					: undefined,
				statusId: formData.statusId?.trim() || undefined,
				statusEndDate: formData.statusEndDate || undefined,
				notes: formData.notes?.trim() || undefined,
			}

			await updateLead(leadId, formattedData)

			const updatedLead = await fetchLeadById(leadId)
			onLeadUpdated(updatedLead)

			setTimeout(() => {
				onClose()
			}, 500)
		} catch (err) {
			console.error('Ошибка при обновлении лида:', err)
			setError('Ошибка при обновлении лида')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Dialog open={!!leadId} onClose={onClose} fullWidth maxWidth='sm'>
				<DialogTitle>Редактирование кандидата</DialogTitle>
				<DialogContent>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						<Typography variant='h6'>Основная информация</Typography>

						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: 1,
							}}
						>
							<Avatar
								src={photoUrl || '/default-avatar.png'}
								sx={{ width: 100, height: 100 }}
							/>
							<Button variant='contained' onClick={handleOpenPhotoModal}>
								Добавить фото
							</Button>
						</Box>

						<TextField
							label='Имя'
							value={formData.name || ''}
							onChange={e => handleChange('name', e.target.value)}
						/>
						<TextField
							label='Фамилия'
							value={formData.surname || ''}
							onChange={e => handleChange('surname', e.target.value)}
						/>
						<TextField
							label='Отчество'
							value={formData.middleName || ''}
							onChange={e => handleChange('middleName', e.target.value)}
						/>
						<TextField
							label='Email'
							value={formData.email || ''}
							onChange={e => handleChange('email', e.target.value)}
						/>
						<TextField
							label='Телефон'
							value={formData.phone || ''}
							onChange={e => handleChange('phone', e.target.value)}
						/>
						<TextField
							label='Возраст'
							type='number'
							value={formData.age || ''}
							onChange={e => handleChange('age', e.target.value)}
						/>
						<TextField
							label='Telegram'
							value={formData.telegram || ''}
							onChange={e => handleChange('telegram', e.target.value)}
						/>
						<TextField
							label='Зарплатные ожидания'
							type='number'
							value={formData.salaryExpectation || ''}
							onChange={e => handleChange('salaryExpectation', e.target.value)}
						/>

						<FormControlLabel
							control={
								<Checkbox
									checked={formData.relocation}
									onChange={e => handleChange('relocation', e.target.checked)}
								/>
							}
							label='Готов к переезду'
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={formData.remoteWork}
									onChange={e => handleChange('remoteWork', e.target.checked)}
								/>
							}
							label='Готов к удаленной работе'
						/>

						<TextField
							label='Примечания'
							multiline
							rows={5}
							value={formData.notes}
							onChange={e => handleChange('notes', e.target.value)}
						/>

						<TextField
							select
							label='Статус'
							value={
								statuses.some(s => s._id === formData.statusId)
									? formData.statusId
									: ''
							}
							onChange={e => handleChange('statusId', e.target.value)}
						>
							{statuses.map(status => (
								<MenuItem key={status._id} value={status._id}>
									{status.name}
								</MenuItem>
							))}
						</TextField>

						<DatePicker
							label='Дата завершения статуса'
							value={
								formData.statusEndDate ? dayjs(formData.statusEndDate) : null
							}
							onChange={date =>
								handleChange('statusEndDate', date?.toISOString() || '')
							}
						/>

						{isAdmin() ? (
							<TextField
								select
								label='Рекрутер'
								value={formData.recruiter}
								onChange={e => handleChange('recruiter', e.target.value)}
							>
								{users.map(user => (
									<MenuItem key={user._id} value={user._id}>
										{user.firstName} {user.lastName}
									</MenuItem>
								))}
							</TextField>
						) : (
							<TextField
								label='Рекрутер'
								value={
									users.find(u => u._id === formData.recruiter)?.firstName ||
									'Не выбран'
								}
								disabled
							/>
						)}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Отмена</Button>
					<Button onClick={handleSubmit} disabled={loading}>
						{loading ? 'Сохранение...' : 'Сохранить'}
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={photoModalOpen}
				onClose={() => setPhotoModalOpen(false)}
				fullWidth
				maxWidth='xs'
			>
				<DialogTitle>Введите ссылку на изображение</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						label='Ссылка'
						value={tempUrl}
						onChange={e => setTempUrl(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setPhotoModalOpen(false)}>Отмена</Button>
					<Button onClick={handleSavePhotoUrl}>Сохранить</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default EditCandidateModal
