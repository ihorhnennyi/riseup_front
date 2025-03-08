import { PageHeader } from '@components/index'
import { Box, TextField } from '@mui/material'
import { useState } from 'react'
import AddUserModal from './components/AddUserModal'
import RecruitersTable from './components/RecruitersTable'

const Recruiters = () => {
	const [search, setSearch] = useState('')

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
				<AddUserModal />
			</Box>

			<RecruitersTable />
		</Box>
	)
}

export default Recruiters
