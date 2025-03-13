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
				// ✅ Загружаем статусы перед лидом
				const statusesData = await fetchStatuses()
				setStatuses(statusesData)
				console.log('📌 Статусы обновлены:', statusesData)

				// ✅ Загружаем лида
				const leadData = await fetchLeadById(id)
				console.log('📌 Полученные данные лида:', leadData)

				// ✅ Приводим статус лида в правильный формат
				const leadStatusId = leadData?.statusId?._id || leadData?.statusId
				const leadStatus = statusesData.find(s => s._id === leadStatusId)

				// ✅ Обновляем состояние лида
				setLead({
					...leadData,
					statusId: leadStatus ? leadStatus._id : null,
				})
			} catch (err) {
				console.error('Ошибка загрузки лида:', err)
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

					{/* Header */}
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
								Статус:{' '}
								{lead?.statusId && statuses.length
									? statuses.find(s => String(s._id) === String(lead.statusId))
											?.name || 'Без статуса'
									: 'Загрузка статуса...'}
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
							onClick={() => setEditModalOpen(true)}
						>
							Редактировать
						</Button>

						{editModalOpen && (
							<EditCandidateModal
								leadId={lead._id}
								onClose={() => setEditModalOpen(false)}
								onLeadUpdated={async updatedLead => {
									setLead(prev => ({
										...prev,
										...updatedLead,
										statusId:
											updatedLead.statusId?._id || updatedLead.statusId || '',
									}))

									// 🔄 Перезапрашиваем статусы после обновления
									const statusesData = await fetchStatuses()
									setStatuses(statusesData)
								}}
							/>
						)}
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
