import { fetchLeadById, updateLead } from '@api/leadsApi'
import { fetchStatuses } from '@api/statusApi'
import { ModalWrapper } from '@components/index'
import {
	Avatar,
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	MenuItem,
	Snackbar,
	TextField,
	Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EditCandidateModal = ({ leadId, onClose, onLeadUpdated }) => {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState(false)
	const [statuses, setStatuses] = useState([])

	const [formData, setFormData] = useState({
		name: '',
		surname: '',
		middleName: '',
		email: '',
		phone: '',
		age: '',
		photo: null as File | null,
		telegram: '',
		salaryExpectation: '',
		relocation: false,
		remoteWork: false,
		workSchedule: [],
		portfolio: [''],
		notes: '',
		statusId: '',
		statusEndDate: null,
	})

	useEffect(() => {
		const loadLeadData = async () => {
			try {
				const leadData = await fetchLeadById(leadId)
				console.log('📦 Полученные данные лида:', leadData) // Логируем данные

				setFormData(prev => ({
					...prev,
					...leadData, // Загружаем все данные
					statusId: leadData.statusId?._id || '',
					statusEndDate: leadData.statusEndDate
						? dayjs(leadData.statusEndDate)
						: null,
				}))
			} catch (err) {
				console.error('Ошибка загрузки лида:', err)
				setError('Не удалось загрузить данные лида')
			}
		}

		if (leadId) {
			loadLeadData()
			fetchStatuses().then(setStatuses).catch(console.error)
		}
	}, [leadId])

	const handleChange = (field, value) => {
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

		if (!formData.name?.trim()) {
			setError('Имя обязательно для заполнения')
			setLoading(false)
			return
		}

		try {
			const formDataToSend = new FormData()
			formDataToSend.append(
				'leadData',
				JSON.stringify({
					name: formData.name,
					surname: formData.surname,
					middleName: formData.middleName,
					email: formData.email,
					phone: formData.phone,
					age: formData.age ? Number(formData.age) : 0,
					telegram: formData.telegram,
					salaryExpectation: formData.salaryExpectation,
					relocation: formData.relocation,
					remoteWork: formData.remoteWork,
					workSchedule: formData.workSchedule,
					portfolio: formData.portfolio,
					notes: formData.notes,
					statusId: formData.statusId,
					statusEndDate: formData.statusEndDate
						? new Date(formData.statusEndDate).toISOString()
						: undefined,
				})
			)

			if (formData.photo) {
				formDataToSend.append('photo', formData.photo)
			}

			await updateLead(leadId, formDataToSend)

			// 🔄 Автоматически загружаем свежие данные
			const updatedLead = await fetchLeadById(leadId)

			onLeadUpdated(updatedLead) // ✅ Передаём обновлённые данные
			setSuccessMessage(true)

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
			<ModalWrapper
				title='Редактирование кандидата'
				open={!!leadId}
				onClose={onClose}
				actions={
					<>
						<Button onClick={onClose}>Отмена</Button>
						<Button
							color='primary'
							onClick={handleSubmit}
							disabled={loading || !formData.name?.trim()}
						>
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
						value={formData.name || ''}
						onChange={e => handleChange('name', e.target.value)}
					/>
					<TextField
						label='Фамилия'
						value={formData.surname || ''}
						onChange={e => handleChange('surname', e.target.value)}
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
						select
						label='Статус кандидата'
						value={formData.statusId || ''}
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

					<Typography variant='h6'>Заработная плата</Typography>
					<TextField
						label='Ожидаемая зарплата'
						value={formData.salaryExpectation || ''}
						onChange={e => handleChange('salaryExpectation', e.target.value)}
					/>

					<Typography variant='h6'>Рабочие предпочтения</Typography>
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

					<Typography variant='h6'>Дополнительные заметки</Typography>
					<TextField
						label='Примечания'
						multiline
						rows={3}
						value={formData.notes || ''}
						onChange={e => handleChange('notes', e.target.value)}
					/>
				</Box>
			</ModalWrapper>

			<Snackbar
				open={successMessage}
				autoHideDuration={2000}
				onClose={() => setSuccessMessage(false)}
				message='Данные успешно сохранены!'
			/>
		</>
	)
}

export default EditCandidateModal
