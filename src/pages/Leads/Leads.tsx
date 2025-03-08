import { PageHeader } from '@components/index'
import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'
import AddLeadFromRabotaModal from './components/AddLeadFromRabotaModal'
import AddLeadModal from './components/AddLeadModal'
import LeadsTable from './components/LeadsTable'

const Leads = () => {
	const [search, setSearch] = useState('')
	const [openRabotaModal, setOpenRabotaModal] = useState(false)

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<PageHeader
				title='Лиды'
				description='Управляйте списком лидов и следите за их статусом'
			/>

			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' }, // На мобилках в колонку, на ПК в ряд
					alignItems: 'center',
					gap: 2,
					width: '100%',
				}}
			>
				<TextField
					variant='outlined'
					placeholder='Поиск лида...'
					value={search}
					onChange={e => setSearch(e.target.value)}
					sx={{ width: '100%' }}
				/>

				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', md: 'row' }, // На мобилках в колонку, на ПК в ряд
						gap: 2,
						width: '100%',
						justifyContent: 'flex-end',
					}}
				>
					<AddLeadModal />
					<Button
						variant='contained'
						color='secondary'
						onClick={() => setOpenRabotaModal(true)}
					>
						Добавить лида с Rabota.ua
					</Button>
				</Box>
			</Box>

			<LeadsTable />

			<AddLeadFromRabotaModal
				open={openRabotaModal}
				onClose={() => setOpenRabotaModal(false)}
			/>
		</Box>
	)
}

export default Leads
