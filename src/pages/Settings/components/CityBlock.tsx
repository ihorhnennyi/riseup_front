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

const CityBlock = () => {
	const theme = useTheme()
	const isDarkMode = theme.palette.mode === 'dark'

	const [cities, setCities] = useState(['Киев', 'Львов', 'Одесса', 'Харьков'])
	const [open, setOpen] = useState(false)
	const [newCity, setNewCity] = useState('')

	const handleAddCity = () => {
		if (newCity.trim()) {
			setCities([...cities, newCity.trim()])
			setNewCity('')
			setOpen(false)
		}
	}

	const handleDeleteCity = (city: string) => {
		setCities(cities.filter(c => c !== city))
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
				{cities.map((city, index) => (
					<Card
						key={index}
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
						<Typography>{city}</Typography>
						<IconButton size='small' onClick={() => handleDeleteCity(city)}>
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
						<Button color='primary' onClick={handleAddCity}>
							Добавить
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
