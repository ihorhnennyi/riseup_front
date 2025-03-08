import { TableWrapper } from '@components/index'

const RecruitersTable = () => {
	const columns = ['ID', 'Имя', 'Email', 'Статус']
	const data = [
		[1, 'Анна Иванова', 'anna@example.com', 'Активен'],
		[2, 'Максим Петров', 'max@example.com', 'Заблокирован'],
		[3, 'Елена Смирнова', 'elena@example.com', 'Активен'],
		[3, 'Елена Смирнова', 'elena@example.com', 'Активен'],
		[3, 'Елена Смирнова', 'elena@example.com', 'Активен'],
	]

	return <TableWrapper columns={columns} data={data} />
}

export default RecruitersTable
