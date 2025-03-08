import PageHeader from '@components/PageHeader'
import { Box } from '@mui/material'
import StatusBlock from './components/StatusBlock'

const Settings = () => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
			<PageHeader
				title='Настройки'
				description='Управляйте параметрами системы и настройками пользователей'
			/>

			{/* Блок с городами */}
			<StatusBlock />
		</Box>
	)
}

export default Settings
