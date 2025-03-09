import ModalWrapper from '@components/ModalWrapper'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {
	Box,
	Button,
	Card,
	IconButton,
	TextField,
	Typography,
	useTheme,
} from '@mui/material'
import { useState } from 'react'

const IntegrationBlock = () => {
	const theme = useTheme()
	const isDarkMode = theme.palette.mode === 'dark'

	// Список интеграций
	const [integrations, setIntegrations] = useState([
		{ name: 'Google Analytics', url: 'https://analytics.google.com' },
		{ name: 'Facebook Ads', url: 'https://facebook.com/business' },
	])

	const [open, setOpen] = useState(false)
	const [newIntegration, setNewIntegration] = useState({ name: '', url: '' })

	// Добавление новой интеграции
	const handleAddIntegration = () => {
		if (newIntegration.name.trim() && newIntegration.url.trim()) {
			setIntegrations([...integrations, newIntegration])
			setNewIntegration({ name: '', url: '' })
			setOpen(false)
		}
	}

	// Удаление интеграции
	const handleDeleteIntegration = (name: string) => {
		setIntegrations(integrations.filter(int => int.name !== name))
	}

	return (
		<Box sx={{ width: '100%', maxWidth: 350, position: 'relative' }}>
			<Typography variant='h6' sx={{ mb: 2 }}>
				Интеграции
			</Typography>

			{/* Размытие блока */}
			<Box
				sx={{
					borderRadius: 2,
					border: '1px solid #ccc',
					padding: 2,
					maxHeight: 250,
					overflowY: 'auto',
					filter: 'blur(5px)', // Применяем размытие
					pointerEvents: 'none', // Блокируем взаимодействие
				}}
			>
				{integrations.map((integration, index) => (
					<Card
						key={index}
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							mb: 1,
							padding: '8px 12px',
							borderRadius: 2,
							backgroundColor: isDarkMode ? 'grey.800' : 'grey.200',
							color: isDarkMode ? '#fff' : '#000',
							boxShadow: 1,
						}}
					>
						<Typography>{integration.name}</Typography>
						<IconButton
							size='small'
							onClick={() => handleDeleteIntegration(integration.name)}
							disabled
						>
							<DeleteIcon sx={{ color: isDarkMode ? '#ff4d4f' : 'red' }} />
						</IconButton>
					</Card>
				))}
			</Box>

			<Button
				fullWidth
				variant='contained'
				startIcon={<AddIcon />}
				sx={{ mt: 2 }}
				onClick={() => setOpen(true)}
				disabled
			>
				Добавить интеграцию
			</Button>

			<ModalWrapper
				title='Добавить интеграцию'
				open={open}
				onClose={() => setOpen(false)}
				actions={
					<>
						<Button onClick={() => setOpen(false)} disabled>
							Отмена
						</Button>
						<Button color='primary' onClick={handleAddIntegration} disabled>
							Добавить
						</Button>
					</>
				}
			>
				<TextField
					fullWidth
					label='Название интеграции'
					value={newIntegration.name}
					onChange={e =>
						setNewIntegration({ ...newIntegration, name: e.target.value })
					}
					sx={{ mb: 2 }}
					disabled
				/>
				<TextField
					fullWidth
					label='Ссылка на интеграцию'
					value={newIntegration.url}
					onChange={e =>
						setNewIntegration({ ...newIntegration, url: e.target.value })
					}
					disabled
				/>
			</ModalWrapper>
		</Box>
	)
}

export default IntegrationBlock
