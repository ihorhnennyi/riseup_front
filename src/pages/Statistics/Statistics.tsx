import { fetchStatuses } from '@api/statusApi'
import { fetchLeadsByRecruiter, fetchUsers } from '@api/userApi'
import PageHeader from '@components/PageHeader'
import TableWrapper from '@components/TableWrapper'
import { Box, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'

const Statistics = () => {
	const [users, setUsers] = useState([]) // HR
	const [statuses, setStatuses] = useState([]) // Статусы
	const [tableData, setTableData] = useState([]) // Данные таблицы
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Загружаем HR и статусы
				const [usersData, statusesData] = await Promise.all([
					fetchUsers(),
					fetchStatuses(),
				])

				setUsers(usersData)
				setStatuses(statusesData)

				// Загружаем лидов для каждого HR
				const leadCounts = await Promise.all(
					usersData.map(async user => {
						const leads = await fetchLeadsByRecruiter(user.id)
						const statusCounts = statusesData.reduce((acc, status) => {
							acc[status.id] = leads.filter(
								lead => lead.statusId === status.id
							).length
							return acc
						}, {})
						return { user, statusCounts }
					})
				)

				// Формируем таблицу
				const formattedData = leadCounts.map(({ user, statusCounts }) => {
					return [
						user.name,
						...statusesData.map(status => statusCounts[status.id] || 0),
					]
				})

				setTableData(formattedData)
			} catch (error) {
				console.error('Ошибка загрузки данных:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
			<PageHeader
				title='Статистика'
				description='Просматривайте данные и анализируйте показатели'
			/>

			{loading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
					<CircularProgress />
				</Box>
			) : (
				<TableWrapper
					columns={['HR', ...statuses.map(status => status.name)]} // Столбцы
					data={tableData} // Данные
				/>
			)}
		</Box>
	)
}

export default Statistics
