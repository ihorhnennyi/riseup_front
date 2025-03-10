import { createBranch, deleteBranch, fetchBranches } from '@api/branchApi'
import { fetchCities } from '@api/cityApi'
import ModalWrapper from '@components/ModalWrapper'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {
	Box,
	Button,
	Card,
	IconButton,
	MenuItem,
	TextField,
	Typography,
	useTheme,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

const BranchBlock = () => {
	const theme = useTheme()
	const isDarkMode = theme.palette.mode === 'dark'
	const { enqueueSnackbar } = useSnackbar()

	const [branches, setBranches] = useState([])
	const [cities, setCities] = useState([])
	const [open, setOpen] = useState(false)
	const [newBranch, setNewBranch] = useState({
		name: '',
		city: { _id: '', name: 'Выберите город' },
	})
	const [loading, setLoading] = useState(false)

	// 🔹 Загружаем города при старте
	useEffect(() => {
		const fetchCitiesData = async () => {
			try {
				const cityData = await fetchCities()
				setCities(cityData)
			} catch (error) {
				enqueueSnackbar('Ошибка загрузки городов', { variant: 'error' })
			}
		}
		fetchCitiesData()
	}, [])

	// 🔹 Загружаем филиалы при старте
	useEffect(() => {
		const fetchBranchesData = async () => {
			try {
				const branchData = await fetchBranches()
				setBranches(branchData)
			} catch (error) {
				enqueueSnackbar('Ошибка загрузки филиалов', { variant: 'error' })
			}
		}
		fetchBranchesData()
	}, [])

	// 🔹 Добавление нового филиала
	const handleAddBranch = async () => {
		if (!newBranch.name.trim() || !newBranch.city._id) {
			enqueueSnackbar('Введите название филиала и выберите город', {
				variant: 'warning',
			})
			return
		}

		setLoading(true)
		try {
			const response = await createBranch(newBranch.name, newBranch.city._id)
			setBranches([...branches, response])
			enqueueSnackbar('Филиал добавлен', { variant: 'success' })
			setNewBranch({ name: '', city: { _id: '', name: 'Выберите город' } })
			setOpen(false)
		} catch (error) {
			enqueueSnackbar('Ошибка при добавлении филиала', { variant: 'error' })
		} finally {
			setLoading(false)
		}
	}

	// 🔹 Удаление филиала
	const handleDeleteBranch = async id => {
		try {
			await deleteBranch(id)
			setBranches(branches.filter(branch => branch._id !== id))
			enqueueSnackbar('Филиал удален', { variant: 'success' })
		} catch (error) {
			enqueueSnackbar('Ошибка при удалении филиала', { variant: 'error' })
		}
	}

	return (
		<Box sx={{ width: '100%', maxWidth: 350 }}>
			<Typography variant='h6' sx={{ mb: 2 }}>
				Филиалы
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
				{branches.map(branch => (
					<Card
						key={branch._id}
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
						<Typography>
							{branch.name} ({branch.city?.name || 'Город не указан'})
						</Typography>
						<IconButton
							size='small'
							onClick={() => handleDeleteBranch(branch._id)}
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
			>
				Добавить филиал
			</Button>

			<ModalWrapper
				title='Добавить филиал'
				open={open}
				onClose={() => setOpen(false)}
				actions={
					<>
						<Button onClick={() => setOpen(false)}>Отмена</Button>
						<Button
							color='primary'
							onClick={handleAddBranch}
							disabled={loading}
						>
							{loading ? 'Добавление...' : 'Добавить'}
						</Button>
					</>
				}
			>
				<TextField
					fullWidth
					label='Название филиала'
					value={newBranch.name}
					onChange={e => setNewBranch({ ...newBranch, name: e.target.value })}
				/>
				<TextField
					select
					fullWidth
					label='Город'
					value={newBranch.city._id || ''}
					onChange={e => {
						const selectedCity = cities.find(
							city => city._id === e.target.value
						)
						if (selectedCity) {
							setNewBranch({
								...newBranch,
								city: { _id: selectedCity._id, name: selectedCity.name },
							})
						}
					}}
					sx={{ mt: 2 }}
				>
					<MenuItem value='' disabled>
						Выберите город
					</MenuItem>
					{cities.map(city => (
						<MenuItem key={city._id} value={city._id}>
							{city.name}
						</MenuItem>
					))}
				</TextField>
			</ModalWrapper>
		</Box>
	)
}

export default BranchBlock
