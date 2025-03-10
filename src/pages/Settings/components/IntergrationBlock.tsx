import {
	createIntegration,
	deleteIntegration,
	fetchIntegrations,
} from '@api/integrationApi'
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
import { useEffect, useState } from 'react'

const IntegrationBlock = () => {
	const theme = useTheme()
	const isDarkMode = theme.palette.mode === 'dark'

	// Список интеграций
	const [integrations, setIntegrations] = useState<
		{ name: string; url: string; _id: string }[]
	>([])
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [newIntegration, setNewIntegration] = useState({ name: '', url: '' })

	// 🔹 Загружаем интеграции при загрузке компонента
	useEffect(() => {
		const loadIntegrations = async () => {
			try {
				const data = await fetchIntegrations()
				setIntegrations(data)
			} catch (error) {
				console.error('Ошибка загрузки интеграций:', error)
			}
		}
		loadIntegrations()
	}, [])

	// 🔹 Добавление новой интеграции
	const handleAddIntegration = async () => {
		if (!newIntegration.name.trim() || !newIntegration.url.trim()) return
		setLoading(true)

		try {
			const addedIntegration = await createIntegration(
				newIntegration.name,
				newIntegration.url
			)
			setIntegrations([...integrations, addedIntegration])
			setNewIntegration({ name: '', url: '' })
			setOpen(false)
		} catch (error) {
			console.error('Ошибка добавления интеграции:', error)
		} finally {
			setLoading(false)
		}
	}

	// 🔹 Удаление интеграции
	const handleDeleteIntegration = async (id: string) => {
		setLoading(true)

		try {
			await deleteIntegration(id)
			setIntegrations(integrations.filter(int => int._id !== id))
		} catch (error) {
			console.error('Ошибка удаления интеграции:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Box sx={{ width: '100%', maxWidth: 400 }}>
			<Typography variant='h6' sx={{ mb: 2 }}>
				Интеграции
			</Typography>

			{/* Список интеграций */}
			<Box
				sx={{
					borderRadius: 2,
					border: '1px solid #ccc',
					padding: 2,
					maxHeight: 250,
					overflowY: 'auto',
				}}
			>
				{integrations.map(integration => (
					<Card
						key={integration._id}
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
							onClick={() => handleDeleteIntegration(integration._id)}
							disabled={loading}
						>
							<DeleteIcon sx={{ color: isDarkMode ? '#ff4d4f' : 'red' }} />
						</IconButton>
					</Card>
				))}
			</Box>

			{/* Кнопка добавления */}
			<Button
				fullWidth
				variant='contained'
				startIcon={<AddIcon />}
				sx={{ mt: 2 }}
				onClick={() => setOpen(true)}
				disabled={loading}
			>
				Добавить интеграцию
			</Button>

			{/* Модальное окно добавления */}
			<ModalWrapper
				title='Добавить интеграцию'
				open={open}
				onClose={() => setOpen(false)}
				actions={
					<>
						<Button onClick={() => setOpen(false)} disabled={loading}>
							Отмена
						</Button>
						<Button
							color='primary'
							onClick={handleAddIntegration}
							disabled={loading}
						>
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
					disabled={loading}
				/>
				<TextField
					fullWidth
					label='Ссылка на интеграцию'
					value={newIntegration.url}
					onChange={e =>
						setNewIntegration({ ...newIntegration, url: e.target.value })
					}
					disabled={loading}
				/>
			</ModalWrapper>
		</Box>
	)
}

export default IntegrationBlock
