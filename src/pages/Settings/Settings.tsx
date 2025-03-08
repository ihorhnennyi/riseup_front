import PageHeader from '@components/PageHeader'
import { Box } from '@mui/material'
import CityBlock from './components/CityBlock'
import StatusBlock from './components/StatusBlock'

const Settings = () => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
			<PageHeader
				title='Настройки'
				description='Управляйте параметрами системы и настройками пользователей'
			/>

			{/* Блоки в строку с переносом */}
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
				<StatusBlock />
				<CityBlock />
			</Box>
		</Box>
	)
}

export default Settings
