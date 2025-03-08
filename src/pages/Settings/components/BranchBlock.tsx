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
import { useState } from 'react'

const BranchBlock = ({ cities }) => {
	const theme = useTheme()
	const isDarkMode = theme.palette.mode === 'dark'

	const [branches, setBranches] = useState([])
	const [open, setOpen] = useState(false)
	const [newBranch, setNewBranch] = useState({ name: '', city: '' })

	const handleAddBranch = () => {
		if (newBranch.name.trim() && newBranch.city) {
			setBranches([...branches, newBranch])
			setNewBranch({ name: '', city: '' })
			setOpen(false)
		}
	}

	const handleDeleteBranch = index => {
		setBranches(branches.filter((_, i) => i !== index))
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
				{branches.map((branch, index) => (
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
						<Typography>
							{branch.name} ({branch.city})
						</Typography>
						<IconButton size='small' onClick={() => handleDeleteBranch(index)}>
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
						<Button color='primary' onClick={handleAddBranch}>
							Добавить
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
					value={newBranch.city}
					onChange={e => setNewBranch({ ...newBranch, city: e.target.value })}
					sx={{ mt: 2 }}
				>
					{cities.map((city, index) => (
						<MenuItem key={index} value={city}>
							{city}
						</MenuItem>
					))}
				</TextField>
			</ModalWrapper>
		</Box>
	)
}

export default BranchBlock
