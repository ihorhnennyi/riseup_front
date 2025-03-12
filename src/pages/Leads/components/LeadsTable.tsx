import { deleteLead, fetchLeads } from '@api/leadsApi'
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
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [open, setOpen] = useState(false)
	const [selectedLead, setSelectedLead] = useState<string | null>(null)

	const navigate = useNavigate()

	// Функция загрузки лидов
	const loadLeads = async () => {
		try {
			const leadsData = await fetchLeads()
			console.log('Лиды:', leadsData)
			setLeads(leadsData)
		} catch (err) {
			setError('Не удалось загрузить лидов')
		} finally {
			setLoading(false)
		}
	}

	// Загружаем лидов при маунте и обновлении `reload`
	useEffect(() => {
		loadLeads()
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
			await loadLeads()
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
		'Дата создания',
		'Действия',
	]

	if (loading) return <div>Загрузка...</div>
	if (error) return <div style={{ color: 'red' }}>{error}</div>

	// Подготовка данных для таблицы
	const data = leads.map((lead, index) => [
		lead._id, // Используем _id
		lead.name || '-',
		lead.surname || '-',
		lead.email || '-',
		lead.phone || '-',
		lead.telegram || '-',
		lead.age || '-',
		lead.status || 'Неизвестный статус',
		new Date(lead.createdAt).toLocaleDateString(),
		<Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
			<IconButton
				color='error'
				onClick={e => {
					e.stopPropagation() // Останавливаем всплытие события
					handleOpenDeleteModal(lead._id)
				}}
			>
				<DeleteIcon />
			</IconButton>
		</Box>,
	])

	return (
		<>
			<TableWrapper
				columns={columns}
				data={data}
				onRowClick={id => navigate(`/candidates/${id}`)} // Передаем _id для навигации
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
