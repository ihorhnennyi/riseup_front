import { fetchBranches } from '@api/branchApi'
import { deleteUser, fetchUsers } from '@api/userApi'
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

const RecruitersTable = ({ reloadTable }) => {
	const [users, setUsers] = useState<any[]>([])
	const [branches, setBranches] = useState<Record<string, string>>({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [open, setOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<string | null>(null)

	const navigate = useNavigate()

	// Функция загрузки пользователей и филиалов
	const loadUsers = async () => {
		try {
			const [usersData, branchesData] = await Promise.all([
				fetchUsers(),
				fetchBranches(),
			])

			const branchMap = branchesData.reduce((acc, branch) => {
				acc[branch._id] = branch.name
				return acc
			}, {} as Record<string, string>)

			setBranches(branchMap)
			setUsers(usersData)
		} catch (err) {
			setError('Не удалось загрузить пользователей')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadUsers()
	}, [reloadTable])

	const handleOpenDeleteModal = (userId: string) => {
		setSelectedUser(userId)
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
		setSelectedUser(null)
	}

	const handleDeleteUser = async () => {
		if (!selectedUser) return
		try {
			await deleteUser(selectedUser)
			await loadUsers()
		} catch (err) {
			console.error('Ошибка удаления пользователя:', err)
		} finally {
			handleClose()
		}
	}

	const columns = [
		'ID',
		'Имя',
		'Фамилия',
		'Отчество',
		'Дата рождения',
		'Телефон',
		'Email',
		'Telegram',
		'WhatsApp',
		'Viber',
		'Филиал',
		'Роль',
		'Статус',
		'Действия',
	]

	if (loading) return <div>Загрузка...</div>
	if (error) return <div style={{ color: 'red' }}>{error}</div>

	const data = users.map((user, index) => [
		user._id, // ✅ ID первой колонкой, чтобы `onRowClick` знал, куда переходить
		user.firstName || '-',
		user.lastName || '-',
		user.middleName || '-',
		user.birthDate ? new Date(user.birthDate).toLocaleDateString() : '-',
		user.phone || '-',
		user.email || '-',
		user.telegram || '-',
		user.whatsapp || '-',
		user.viber || '-',

		branches[user.branch] || 'Не указан',
		user.role || '-',
		user.isActive ? 'Активен' : 'Неактивен',
		<Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
			<IconButton
				color='error'
				onClick={e => {
					e.stopPropagation() // ✅ Останавливаем всплытие события
					handleOpenDeleteModal(user._id)
				}}
			>
				<DeleteIcon />
			</IconButton>
		</Box>,
	])

	return (
		<>
			<TableWrapper
				columns={columns.slice(1)} // ✅ Убираем ID из заголовков, но оставляем в `data`
				data={data}
				onRowClick={id => navigate(`/recruiters/${id}`)} // ✅ Переход на страницу рекрутера
			/>

			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Удалить рекрутера?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Вы уверены, что хотите удалить этого рекрутера? Это действие
						невозможно отменить.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						Отмена
					</Button>
					<Button onClick={handleDeleteUser} color='error' autoFocus>
						Удалить
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default RecruitersTable
