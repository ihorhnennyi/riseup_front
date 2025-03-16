import { getUserSession } from '@api/authApi'
import { createLead } from '@api/leadsApi'
import { fetchStatuses } from '@api/statusApi'
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

const AddCandidateModal = ({ onLeadAdded }) => {
	const [open, setOpen] = useState(false)
	const [photoModalOpen, setPhotoModalOpen] = useState(false)
	const [photoUrl, setPhotoUrl] = useState<string | null>(null)
	const [photoFile, setPhotoFile] = useState<File | null>(null)
	const [tempUrl, setTempUrl] = useState('')
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
		photo: '',
		telegram: '',
		salaryExpectation: '',
		relocation: false,
		remoteWork: true,
		workSchedule: [],
		portfolio: [],
		notes: '',
		statusId: '',
		statusEndDate: '',
		recruiter: '',
	})

	useEffect(() => {
		fetchStatuses().then(setStatuses).catch(console.error)
	}, [])

	useEffect(() => {
		const fetchSession = async () => {
			const userSession = await getUserSession()
			if (userSession && userSession._id) {
				setFormData(prev => ({ ...prev, recruiter: userSession._id }))
			} else {
				console.error('❌ Ошибка: recruiter отсутствует!')
			}
		}
		fetchSession()
	}, [])

	const handleChange = (field: string, value: any) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setPhotoFile(file)
			setPhotoUrl(null)
			setFormData(prev => ({ ...prev, photo: '' })) // Очистить ссылку
		}
	}

	const handleSavePhotoUrl = () => {
		if (tempUrl.trim()) {
			setPhotoUrl(tempUrl)
			setPhotoFile(null)
			setFormData(prev => ({ ...prev, photo: tempUrl })) // Сохранить ссылку
		}
		setPhotoModalOpen(false)
	}

	const handleOpenPhotoModal = () => {
		console.log('📷 Открываем модалку для ввода ссылки на фото')
		setTempUrl(photoUrl || '') // Заполняем текущую ссылку (если есть)
		setPhotoModalOpen(true) // ✅ Открываем модалку
	}

	const handleSubmit = async () => {
		setLoading(true)
		setError(null)

		if (!formData.name.trim()) {
			setError('Имя обязательно для заполнения')
			setLoading(false)
			return
		}

		if (!formData.recruiter) {
			console.error('❌ Ошибка: recruiter отсутствует!')
			setError('Ошибка: Не удалось определить рекрутера.')
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

			let response

			if (photoFile) {
				const formDataToSend = new FormData()
				formDataToSend.append('leadData', JSON.stringify(formattedData))
				formDataToSend.append('photo', photoFile)

				response = await createLead(formDataToSend)
			} else {
				response = await createLead({
					...formattedData,
					photo: photoUrl || undefined,
				})
			}

			console.log('✅ Успешно создан:', response)

			setOpen(false)
			onLeadAdded()
		} catch (err) {
			console.error('❌ Ошибка при создании лида:', err)
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

			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				fullWidth
				maxWidth='sm'
			>
				<DialogTitle>Добавление кандидата</DialogTitle>
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
								src={
									photoFile
										? URL.createObjectURL(photoFile)
										: photoUrl || '/default-avatar.png'
								}
								sx={{ width: 100, height: 100 }}
							/>
							<Button variant='contained' onClick={handleOpenPhotoModal}>
								Загрузить фото
							</Button>
						</Box>

						<TextField
							label='Имя'
							value={formData.name}
							onChange={e => handleChange('name', e.target.value)}
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
							label='Возраст'
							type='number'
							value={formData.age}
							onChange={e => handleChange('age', e.target.value)}
						/>
						<TextField
							label='Telegram'
							value={formData.telegram}
							onChange={e => handleChange('telegram', e.target.value)}
						/>
						<TextField
							label='Зарплатные ожидания'
							type='number'
							value={formData.salaryExpectation}
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
							sx={{ whiteSpace: 'pre-wrap' }}
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

						<DatePicker
							label='Дата завершения статуса'
							value={
								formData.statusEndDate ? dayjs(formData.statusEndDate) : null
							}
							onChange={date =>
								handleChange('statusEndDate', date?.toISOString() || '')
							}
						/>
					</Box>
				</DialogContent>

				{/* ✅ Модалка для ввода ссылки на фото */}
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
							label='Ссылка на изображение'
							variant='outlined'
							value={tempUrl}
							onChange={e => setTempUrl(e.target.value)}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setPhotoModalOpen(false)}>Отмена</Button>
						<Button onClick={handleSavePhotoUrl} color='primary'>
							Сохранить
						</Button>
					</DialogActions>
				</Dialog>

				<DialogActions>
					<Button onClick={() => setOpen(false)}>Отмена</Button>
					<Button onClick={handleSubmit} disabled={loading}>
						{loading ? 'Добавление...' : 'Добавить'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default AddCandidateModal
