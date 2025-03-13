import { getUserSession } from '@api/authApi'
import { createLead } from '@api/leadsApi'
import { fetchStatuses } from '@api/statusApi'
import { ModalWrapper } from '@components/index'
import {
	Avatar,
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	MenuItem,
	TextField,
	Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddCandidateModal = ({ onLeadAdded }) => {
	const navigate = useNavigate()
	const [open, setOpen] = useState(false)
	const [statuses, setStatuses] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

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
		remoteWork: true,
		workSchedule: [],
		portfolio: [''],
		notes: '',
		statusId: '',
		statusEndDate: '',
		recruiterId: '', // ✅ Добавил recruiterId в formData
	})

	useEffect(() => {
		fetchStatuses().then(setStatuses).catch(console.error)
	}, [])

	const handleChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setFormData(prev => ({ ...prev, photo: file }))
		}
	}

	const [recruiterId, setRecruiterId] = useState<string | null>(null)

	useEffect(() => {
		const fetchSession = async () => {
			const userSession = await getUserSession()
			if (userSession && userSession._id) {
				setRecruiterId(userSession._id)
				setFormData(prev => ({ ...prev, recruiterId: userSession._id })) // ✅ Добавил в formData
			} else {
				console.error('❌ Ошибка: recruiterId отсутствует!')
			}
		}
		fetchSession()
	}, [])

	const handleSubmit = async () => {
		setLoading(true)
		setError(null)

		if (!formData.name?.trim()) {
			setError('Имя обязательно для заполнения')
			setLoading(false)
			return
		}

		if (!recruiterId) {
			console.error('❌ Ошибка: recruiterId отсутствует!')
			setError('Ошибка: Не удалось определить рекрутера.')
			setLoading(false)
			return
		}

		try {
			// Преобразуем `statusId` и `recruiterId` в ObjectId-подобные строки
			const formattedData = {
				...formData,
				recruiter: recruiterId, // ✅ Исправляем на `recruiter`
				statusId: formData.statusId?.trim() || undefined, // ❌ Если пусто - убираем
			}

			const formDataToSend = new FormData()
			formDataToSend.append('leadData', JSON.stringify(formattedData))

			if (formData.photo) {
				formDataToSend.append('photo', formData.photo)
			}

			console.log(
				'📦 Отправляемые данные:',
				JSON.stringify(formattedData, null, 2)
			)

			await createLead(formDataToSend)

			setOpen(false)
			onLeadAdded()
			navigate('/candidates')
		} catch (err) {
			console.error('Ошибка при создании лида:', err)
			setError('Ошибка при создании лида')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Button variant='contained' onClick={() => setOpen(true)}>
				Добавить кандидата
			</Button>

			<ModalWrapper
				title='Добавление кандидата'
				open={open}
				onClose={() => setOpen(false)}
				actions={
					<>
						<Button onClick={() => setOpen(false)}>Отмена</Button>
						<Button
							color='primary'
							onClick={handleSubmit}
							disabled={loading || !formData.name?.trim()}
						>
							{loading ? 'Добавление...' : 'Добавить'}
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
						value={formData.name}
						onChange={e => handleChange('name', e.target.value)}
						error={
							!formData.name?.trim() &&
							error === 'Имя обязательно для заполнения'
						}
						helperText={
							!formData.name?.trim() &&
							error === 'Имя обязательно для заполнения'
								? 'Пожалуйста, введите имя'
								: ''
						}
					/>

					<TextField
						label='Фамилия'
						value={formData.surname}
						onChange={e => handleChange('surname', e.target.value)}
					/>
					<TextField
						label='Отчество'
						value={formData.middleName}
						onChange={e => handleChange('middleName', e.target.value)}
					/>
					<TextField
						label='Email'
						value={formData.email}
						onChange={e => handleChange('email', e.target.value)}
					/>
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
						label='Возраст'
						type='number'
						value={formData.age}
						onChange={e => handleChange('age', e.target.value)}
					/>

					<TextField
						select
						label='Статус кандидата'
						value={formData.statusId}
						onChange={e => handleChange('statusId', e.target.value)}
					>
						{statuses.map(status => (
							<MenuItem key={status._id} value={status._id}>
								{status.name}
							</MenuItem>
						))}
					</TextField>

					{formData.statusId && (
						<DatePicker
							label='Дата завершения статуса'
							value={
								formData.statusEndDate ? dayjs(formData.statusEndDate) : null
							}
							onChange={date =>
								handleChange('statusEndDate', date?.toISOString() || '')
							}
						/>
					)}

					<Typography variant='h6'>Заработная плата</Typography>
					<TextField
						label='Ожидаемая зарплата'
						value={formData.salaryExpectation}
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
						value={formData.notes}
						onChange={e => handleChange('notes', e.target.value)}
					/>
				</Box>
			</ModalWrapper>
		</>
	)
}

export default AddCandidateModal
function loadLeads() {
	throw new Error('Function not implemented.')
}
