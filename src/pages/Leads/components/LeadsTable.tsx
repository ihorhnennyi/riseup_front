import { fetchCurrentUser } from '@api/authApi'
import { deleteLead, fetchLeadById, fetchLeads } from '@api/leadsApi'
import { TableWrapper } from '@components/index'
import DeleteIcon from '@mui/icons-material/Delete'
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LeadsTable = ({ reload }: { reload: boolean }) => {
	const [leads, setLeads] = useState<any[]>([])
	const [recruiters, setRecruiters] = useState<Record<string, any>>({}) // 🔥 Кэш рекрутеров
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [open, setOpen] = useState(false)
	const [selectedLead, setSelectedLead] = useState<string | null>(null)
	const [currentUser, setCurrentUser] = useState<any>(null)

	const navigate = useNavigate()

	useEffect(() => {
		const loadData = async () => {
			try {
				const userData = await fetchCurrentUser()
				setCurrentUser(userData)

				let leadsData = await fetchLeads() // Загружаем все лиды
				console.log('🔍 Получены лиды:', leadsData)

				// Фильтруем лидов, если это рекрутер
				if (userData.role === 'recruiter') {
					leadsData = leadsData.filter(
						lead => lead.recruiter?.toString() === userData._id.toString()
					)
				}

				// 🔥 Загружаем детали каждого лида
				const detailedLeads = await Promise.all(
					leadsData.map(async lead => {
						try {
							return await fetchLeadById(lead._id) // 🔥 Запрос на конкретного лида
						} catch (err) {
							console.error(`❌ Ошибка загрузки лида ${lead._id}:`, err)
							return lead // Если ошибка, возвращаем без деталей
						}
					})
				)

				setLeads(detailedLeads)
				console.log('✅ Полные данные лидов:', detailedLeads)
			} catch (err) {
				console.error('❌ Ошибка загрузки данных:', err)
				setError('Не удалось загрузить данные')
			} finally {
				setLoading(false)
			}
		}

		loadData()
	}, [reload])

	const handleOpenDeleteModal = (leadId: string) => {
		setSelectedLead(leadId)
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
		setSelectedLead(null)
	}

	const handleDeleteLead = async () => {
		if (!selectedLead) return
		try {
			await deleteLead(selectedLead)
			setLeads(prev => prev.filter(lead => lead._id !== selectedLead))
		} catch (err) {
			console.error('Ошибка удаления лида:', err)
		} finally {
			handleClose()
		}
	}

	const columns = [
		'Имя',
		'Фамилия',
		'Email',
		'Телефон',
		'Telegram',
		'Возраст',
		'Статус',
		'Дата завершения статуса',
		'Готов к переезду',
		'Готов к удаленной работе',
		'Зарплатные ожидания',
		'Рекрутер',
		'Дата создания',
		'Действия',
	]

	if (loading) return <div>Загрузка...</div>
	if (error) return <div style={{ color: 'red' }}>{error}</div>

	const data = leads.map(lead => {
		const recruiter =
			typeof lead.recruiter === 'string'
				? recruiters[lead.recruiter] // Если recruiter — это ID, берём его из кэша
				: lead.recruiter // Если уже объект, используем его

		return [
			lead._id,
			lead.name || '-',
			lead.surname || '-',
			lead.email || '-',
			lead.phone || '-',
			lead.telegram || '-',
			lead.age || '-',
			lead.status?.name || 'Без статуса',
			lead.statusEndDate
				? new Date(lead.statusEndDate).toLocaleDateString()
				: 'Не указано',
			lead.relocation ? 'Да' : 'Нет',
			lead.remoteWork ? 'Да' : 'Нет',
			lead.salaryExpectation ? `${lead.salaryExpectation} $` : 'Не указано',
			recruiter ? `${recruiter.firstName} ${recruiter.lastName}` : 'Не указан',
			new Date(lead.createdAt).toLocaleDateString(),
			<Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
				<IconButton
					color='error'
					onClick={e => {
						e.stopPropagation()
						handleOpenDeleteModal(lead._id)
					}}
				>
					<DeleteIcon />
				</IconButton>
			</Box>,
		]
	})

	return (
		<>
			<TableWrapper
				columns={columns}
				data={data}
				onRowClick={id => navigate(`/candidates/${id}`)}
			/>

			{/* Модальное окно подтверждения */}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Удалить лида?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Вы уверены, что хотите удалить этого лида? Это действие невозможно
						отменить.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						Отмена
					</Button>
					<Button onClick={handleDeleteLead} color='error' autoFocus>
						Удалить
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default LeadsTable
