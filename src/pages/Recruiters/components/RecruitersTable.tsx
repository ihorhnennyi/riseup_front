import { fetchUsers } from '@api/userApi'
import { TableWrapper } from '@components/index'
import { useEffect, useState } from 'react'

const RecruitersTable = () => {
	const [users, setUsers] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadUsers = async () => {
			try {
				const data = await fetchUsers()
				setUsers(data)
			} catch (err) {
				setError('Не удалось загрузить пользователей')
			} finally {
				setLoading(false)
			}
		}

		loadUsers()
	}, [])

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
		'Facebook',
		'Фото',
		'Роль',
		'Статус',
	]

	// Показываем загрузку
	if (loading) return <div>Загрузка...</div>

	// Показываем ошибку, если есть
	if (error) return <div style={{ color: 'red' }}>{error}</div>

	const data = users.map((user, index) => [
		index + 1,
		user.firstName || '-',
		user.lastName || '-',
		user.middleName || '-',
		user.birthDate ? new Date(user.birthDate).toLocaleDateString() : '-',
		user.phone || '-',
		user.email || '-',
		user.telegram || '-',
		user.whatsapp || '-',
		user.viber || '-',
		user.facebook || '-',
		user.photo ? <img src={user.photo} alt='Фото' width={40} /> : '-',
		user.role || '-',
		user.isActive ? 'Активен' : 'Неактивен',
	])

	return <TableWrapper columns={columns} data={data} />
}

export default RecruitersTable
