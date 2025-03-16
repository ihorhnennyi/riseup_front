import { fetchLeadById } from '@api/leadsApi'
import { fetchStatuses } from '@api/statusApi'
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
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EditCandidateModal from './components/EditCandidateModal'

const LeadDetails = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [lead, setLead] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [editModalOpen, setEditModalOpen] = useState(false)
	const [statuses, setStatuses] = useState([])

	useEffect(() => {
		const loadLead = async () => {
			if (!id) {
				setError('Lead ID not provided')
				setLoading(false)
				return
			}

			try {
				const statusesData = await fetchStatuses()
				setStatuses(statusesData)

				const leadData = await fetchLeadById(id)

				console.log('📌 Полученные данные лида:', leadData)

				const leadStatusId = leadData?.statusId?._id || leadData?.statusId
				const leadStatus = statusesData.find(s => s._id === leadStatusId)

				setLead({
					...leadData,
					statusId: leadStatus ? leadStatus._id : null,
					recruiter: leadData.recruiter || null,
					createdBy: leadData.createdBy || null,
				})
			} catch (err) {
				console.error('Ошибка загрузки лида:', err)
				setError('Не удалось загрузить данные лида')
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
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Container maxWidth='lg' sx={{ mt: 2 }}>
				<Paper sx={{ padding: 3 }}>
					<Button
						variant='outlined'
						color='primary'
						onClick={() => navigate(-1)}
						sx={{ mb: 2 }}
					>
						Назад
					</Button>

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

					{/* 🔹 Личная информация */}
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
							<Typography variant='body1'>
								Возраст: {lead?.age || 'N/A'}
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant='body1'>
								Статус:{' '}
								{lead?.statusId && statuses.length
									? statuses.find(s => String(s._id) === String(lead.statusId))
											?.name || 'Без статуса'
									: 'Загрузка статуса...'}
							</Typography>
							<Typography variant='body1'>
								Дата завершения статуса:{' '}
								{lead?.statusEndDate
									? new Date(lead.statusEndDate).toLocaleDateString()
									: 'Не указана'}
							</Typography>
						</Grid>
					</Grid>

					<Divider sx={{ my: 2 }} />

					{/* 🔹 Дополнительная информация */}
					<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
						Дополнительная информация
					</Typography>
					<Grid container spacing={2} sx={{ mb: 2 }}>
						<Grid item xs={12} md={6}>
							<Typography variant='body1'>
								Готов к переезду: {lead?.relocation ? 'Да' : 'Нет'}
							</Typography>
							<Typography variant='body1'>
								Готов к удаленной работе: {lead?.remoteWork ? 'Да' : 'Нет'}
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant='body1'>
								Зарплатные ожидания: {lead?.salaryExpectation || 'Не указаны'}
							</Typography>
						</Grid>
					</Grid>

					<Divider sx={{ my: 2 }} />

					{/* 🔹 Рекрутер */}
					<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
						Рекрутер
					</Typography>
					<Typography variant='body1'>
						{lead?.recruiter
							? `${lead.recruiter.firstName} ${lead.recruiter.lastName} (${lead.recruiter.email})`
							: 'Не указан'}
					</Typography>

					<Divider sx={{ my: 2 }} />

					<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
						Примечания
					</Typography>
					<Typography variant='body1'>
						{lead?.notes?.trim() ? lead.notes : 'Нет заметок'}
					</Typography>

					<Divider sx={{ my: 2 }} />

					{/* 🔹 Даты */}
					<Typography variant='h6' sx={{ fontWeight: 'bold' }}>
						Временные метки
					</Typography>
					<Grid container spacing={2} sx={{ mb: 2 }}>
						<Grid item xs={12} md={6}>
							<Typography variant='body1'>
								Дата создания:{' '}
								{new Date(lead?.createdAt).toLocaleString() || 'Неизвестно'}
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant='body1'>
								Последнее обновление:{' '}
								{new Date(lead?.updatedAt).toLocaleString() || 'Неизвестно'}
							</Typography>
						</Grid>
					</Grid>

					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Button
							variant='contained'
							color='primary'
							onClick={() => setEditModalOpen(true)}
						>
							Редактировать
						</Button>
					</Box>

					{editModalOpen && (
						<EditCandidateModal
							leadId={lead._id}
							onClose={() => setEditModalOpen(false)}
							onLeadUpdated={updatedLead => setLead(updatedLead)}
						/>
					)}
				</Paper>
			</Container>
		</motion.div>
	)
}

export default LeadDetails
