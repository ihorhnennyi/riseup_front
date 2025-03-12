import { fetchLeadById } from '@api/leadsApi'
import {
	Avatar,
	Box,
	Button,
	Container,
	Divider,
	Grid,
	Paper,
	Typography,
} from '@mui/material'
import { motion } from 'framer-motion' // Импортируем motion
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const LeadDetails = () => {
	const { id } = useParams()
	const navigate = useNavigate() // Используем navigate для навигации назад
	const [lead, setLead] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadLead = async () => {
			if (!id) {
				setError('Lead ID not provided')
				setLoading(false)
				return
			}

			try {
				const leadData = await fetchLeadById(id)
				setLead(leadData)
			} catch (err) {
				setError('Unable to fetch lead data')
			} finally {
				setLoading(false)
			}
		}

		loadLead()
	}, [id])

	if (loading) return <div>Загрузка...</div>
	if (error) return <div style={{ color: 'red' }}>{error}</div>

	return (
		<motion.div
			initial={{ opacity: 0 }} // Начальное состояние (невидимый)
			animate={{ opacity: 1 }} // Конечное состояние (видимый)
			exit={{ opacity: 0 }} // При выходе (можно добавить анимацию для выхода)
			transition={{ duration: 0.5 }} // Продолжительность анимации
		>
			<Container maxWidth='lg' sx={{ mt: 2 }}>
				<Paper sx={{ padding: 3 }}>
					{/* Кнопка Назад */}
					<Button
						variant='outlined'
						color='primary'
						onClick={() => navigate(-1)} // Переход на предыдущую страницу
						sx={{ mb: 2 }}
					>
						Назад
					</Button>

					{/* Header with Avatar, Name, Email */}
					<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
						<Avatar
							alt={lead?.name}
							src={lead?.photo || '/default-avatar.png'}
							sx={{ width: 80, height: 80 }}
						/>
						<Box>
							<Typography variant='h5' sx={{ fontWeight: 'bold', mb: 1 }}>
								{lead?.name} {lead?.surname}
							</Typography>
							<Typography variant='body2' sx={{ color: 'gray' }}>
								{lead?.email || 'No email provided'}
							</Typography>
						</Box>
					</Box>

					<Divider sx={{ my: 2 }} />

					{/* Personal Information */}
					<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
						Личная информация
					</Typography>
					<Grid container spacing={2} sx={{ mb: 2 }}>
						<Grid item xs={12} md={6}>
							<Typography variant='body1'>
								Телефон: {lead?.phone || 'N/A'}
							</Typography>
							<Typography variant='body1'>
								Telegram: {lead?.telegram || 'N/A'}
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant='body1'>
								Возраст: {lead?.age || 'N/A'}
							</Typography>
							<Typography variant='body1'>
								Статус: {lead?.status || 'N/A'}
							</Typography>
						</Grid>
					</Grid>

					<Divider sx={{ my: 2 }} />

					{/* Skills and Work Preferences */}
					<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
						Навыки и предпочтения
					</Typography>
					<Grid container spacing={2} sx={{ mb: 2 }}>
						<Grid item xs={12} md={6}>
							<Typography variant='body1'>
								График работы: {lead?.workSchedule || 'N/A'}
							</Typography>
							<Typography variant='body1'>
								Ожидаемая зарплата: {lead?.salaryExpectation || 'N/A'}
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant='body1'>
								Готов к переезду: {lead?.relocation ? 'Да' : 'Нет'}
							</Typography>
							<Typography variant='body1'>
								Удаленная работа: {lead?.remoteWork ? 'Да' : 'Нет'}
							</Typography>
						</Grid>
					</Grid>

					<Divider sx={{ my: 2 }} />

					{/* Notes Section */}
					{lead?.notes && (
						<Box sx={{ mb: 2 }}>
							<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
								Заметки
							</Typography>
							<Typography variant='body1'>{lead.notes}</Typography>
						</Box>
					)}

					{/* Action Buttons */}
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Button
							variant='contained'
							color='primary'
							onClick={() => alert('Редактировать лида')}
						>
							Редактировать
						</Button>
						<Button
							variant='outlined'
							color='error'
							onClick={() => alert('Удалить лида')}
						>
							Удалить
						</Button>
					</Box>
				</Paper>
			</Container>
		</motion.div>
	)
}

export default LeadDetails
