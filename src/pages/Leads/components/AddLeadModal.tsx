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

const employmentTypes = ['Полная', 'Частичная', 'Фриланс', 'Стажировка']
const workTypes = ['Удаленно', 'В офисе', 'Гибрид']
const candidateStatuses = ['Активен', 'В ожидании', 'Отказ', 'Нанят']
const recruiters = ['Иван Петров', 'Мария Смирнова', 'Алексей Иванов']

const AddCandidateModal = () => {
	const [open, setOpen] = useState(false)
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		middleName: '',
		birthDate: null,
		phone: '',
		email: '',
		city: '',
		photo: '',
		position: '',
		employmentType: '',
		workType: '',
		education: [''],
		skills: [''],
		resume: null,
		status: '',
		recruiter: '',
	})

	const handleChange = (field: string, value: any) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handleArrayChange = (field: string, index: number, value: string) => {
		setFormData(prev => {
			const newArray = [...(prev[field] as string[])]
			newArray[index] = value
			return { ...prev, [field]: newArray }
		})
	}

	const addArrayField = (field: string) => {
		setFormData(prev => ({
			...prev,
			[field]: [...(prev[field] as string[]), ''],
		}))
	}

	const removeArrayField = (field: string, index: number) => {
		setFormData(prev => {
			const newArray = (prev[field] as string[]).filter((_, i) => i !== index)
			return { ...prev, [field]: newArray }
		})
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null
		setFormData(prev => ({ ...prev, resume: file }))
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
				Добавить кандидата
			</Button>

			<ModalWrapper
				title='Добавление кандидата'
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
						label='Город'
						value={formData.city}
						onChange={e => handleChange('city', e.target.value)}
					/>

					<Typography variant='h6'>Рабочие предпочтения</Typography>
					<TextField
						label='Должность'
						value={formData.position}
						onChange={e => handleChange('position', e.target.value)}
					/>
					<TextField
						select
						label='Тип занятости'
						value={formData.employmentType}
						onChange={e => handleChange('employmentType', e.target.value)}
					>
						{employmentTypes.map(type => (
							<MenuItem key={type} value={type}>
								{type}
							</MenuItem>
						))}
					</TextField>
					<TextField
						select
						label='Тип работы'
						value={formData.workType}
						onChange={e => handleChange('workType', e.target.value)}
					>
						{workTypes.map(type => (
							<MenuItem key={type} value={type}>
								{type}
							</MenuItem>
						))}
					</TextField>

					<Typography variant='h6'>Образование</Typography>
					{formData.education.map((edu, index) => (
						<Box key={index} sx={{ display: 'flex', gap: 1 }}>
							<TextField
								label='Образование'
								value={edu}
								onChange={e =>
									handleArrayChange('education', index, e.target.value)
								}
								sx={{ width: '100%' }}
							/>
							<IconButton onClick={() => removeArrayField('education', index)}>
								<DeleteIcon />
							</IconButton>
						</Box>
					))}
					<Button onClick={() => addArrayField('education')}>
						Добавить образование
					</Button>

					<Typography variant='h6'>Навыки</Typography>
					{formData.skills.map((skill, index) => (
						<Box key={index} sx={{ display: 'flex', gap: 1 }}>
							<TextField
								label='Навык'
								value={skill}
								onChange={e =>
									handleArrayChange('skills', index, e.target.value)
								}
								sx={{ width: '100%' }}
							/>
							<IconButton onClick={() => removeArrayField('skills', index)}>
								<DeleteIcon />
							</IconButton>
						</Box>
					))}
					<Button onClick={() => addArrayField('skills')}>
						Добавить навык
					</Button>

					<Typography variant='h6'>Файлы</Typography>
					<Button variant='contained' component='label'>
						Загрузить резюме
						<input type='file' hidden onChange={handleFileChange} />
					</Button>

					<Typography variant='h6'>Дополнительно</Typography>
					<TextField
						select
						label='Статус кандидата'
						value={formData.status}
						onChange={e => handleChange('status', e.target.value)}
					>
						{candidateStatuses.map(status => (
							<MenuItem key={status} value={status}>
								{status}
							</MenuItem>
						))}
					</TextField>
					<TextField
						select
						label='Ответственный рекрутер'
						value={formData.recruiter}
						onChange={e => handleChange('recruiter', e.target.value)}
					>
						{recruiters.map(recruiter => (
							<MenuItem key={recruiter} value={recruiter}>
								{recruiter}
							</MenuItem>
						))}
					</TextField>
				</Box>
			</ModalWrapper>
		</>
	)
}

export default AddCandidateModal
