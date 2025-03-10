import { PageHeader } from '@components/index'
import { Box, TextField } from '@mui/material'
import { useState } from 'react'
import AddRecruiterModal from './components/AddUserModal'
import RecruitersTable from './components/RecruitersTable'

const Recruiters = () => {
	const [search, setSearch] = useState('')
	const [reloadTable, setReloadTable] = useState(false)

	// Обновляем таблицу после добавления пользователя
	const handleUserCreated = () => {
		setReloadTable(prev => !prev) // 👈 Меняем состояние, чтобы триггерить обновление
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<PageHeader
				title='Рекрутеры'
				description='Управляйте списком рекрутеров и следите за их статусом'
			/>

			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: 2,
				}}
			>
				<TextField
					variant='outlined'
					placeholder='Поиск рекрутера...'
					value={search}
					onChange={e => setSearch(e.target.value)}
					sx={{ flex: 1, maxWidth: 400 }}
				/>
				<AddRecruiterModal onUserCreated={handleUserCreated} />
			</Box>

			{/* ✅ Передаём reloadTable в таблицу */}
			<RecruitersTable reloadTable={reloadTable} />
		</Box>
	)
}

export default Recruiters
