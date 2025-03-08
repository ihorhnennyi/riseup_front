import PageHeader from '@components/PageHeader'
import { Box } from '@mui/material'
import { useState } from 'react'
import BranchBlock from './components/BranchBlock'
import CityBlock from './components/CityBlock'
import StatusBlock from './components/StatusBlock'

const Settings = () => {
	const [cities, setCities] = useState(['Киев', 'Львов', 'Одесса', 'Харьков'])

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
			<PageHeader
				title='Настройки'
				description='Управляйте параметрами системы и настройками пользователей'
			/>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
				<StatusBlock />
				<CityBlock />
				<BranchBlock cities={cities} />
			</Box>
		</Box>
	)
}

export default Settings
