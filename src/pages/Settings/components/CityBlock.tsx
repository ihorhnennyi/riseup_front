import { createCity, deleteCity, fetchCities } from '@api/cityApi'
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
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

type City = {
	_id: string
	name: string
}

const CityBlock = () => {
	const theme = useTheme()
	const isDarkMode = theme.palette.mode === 'dark'
	const { enqueueSnackbar } = useSnackbar()

	const [cities, setCities] = useState<City[]>([])
	const [open, setOpen] = useState(false)
	const [newCity, setNewCity] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const loadCities = async () => {
			try {
				const data = await fetchCities()
				setCities(data)
			} catch (error) {
				enqueueSnackbar('Ошибка загрузки городов', { variant: 'error' })
			}
		}
		loadCities()
	}, [])

	const handleAddCity = async () => {
		if (!newCity.trim()) {
			enqueueSnackbar('Введите название города', { variant: 'warning' })
			return
		}

		setLoading(true)
		try {
			const addedCity = await createCity(newCity.trim())
			setCities([...cities, addedCity])
			enqueueSnackbar('Город добавлен', { variant: 'success' })
			setNewCity('')
			setOpen(false)
		} catch (error) {
			enqueueSnackbar('Ошибка при добавлении города', { variant: 'error' })
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteCity = async (id: string) => {
		try {
			await deleteCity(id)
			setCities(prev => prev.filter(city => city._id !== id))
			enqueueSnackbar('Город удален', { variant: 'success' })
		} catch (error) {
			enqueueSnackbar('Ошибка при удалении города', { variant: 'error' })
		}
	}

	return (
		<Box sx={{ width: '100%', maxWidth: 350 }}>
			<Typography variant='h6' sx={{ mb: 2 }}>
				Города
			</Typography>

			<Box
				sx={{
					borderRadius: 2,
					border: '1px solid #ccc',
					padding: 2,
					maxHeight: 250,
					overflowY: 'auto',
				}}
			>
				{cities.map(city => (
					<Card
						key={city._id}
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							mb: 1,
							padding: '8px 12px',
							borderRadius: 2,
							backgroundColor: isDarkMode ? 'grey.800' : 'grey.100',
							color: isDarkMode ? '#fff' : '#000',
							boxShadow: 1,
						}}
					>
						<Typography>{city.name}</Typography>
						<IconButton size='small' onClick={() => handleDeleteCity(city._id)}>
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
			>
				Добавить город
			</Button>

			<ModalWrapper
				title='Добавить город'
				open={open}
				onClose={() => setOpen(false)}
				actions={
					<>
						<Button onClick={() => setOpen(false)}>Отмена</Button>
						<Button color='primary' onClick={handleAddCity} disabled={loading}>
							{loading ? 'Добавление...' : 'Добавить'}
						</Button>
					</>
				}
			>
				<TextField
					fullWidth
					label='Название города'
					value={newCity}
					onChange={e => setNewCity(e.target.value)}
				/>
			</ModalWrapper>
		</Box>
	)
}

export default CityBlock
