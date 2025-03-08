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
} from '@mui/material'
import { useState } from 'react'

const StatusBlock = () => {
	const [statuses, setStatuses] = useState([
		{ name: 'Активен', color: '#28a745' },
		{ name: 'Неактивен', color: '#dc3545' },
		{ name: 'В ожидании', color: '#ffc107' },
	])
	const [open, setOpen] = useState(false)
	const [newStatus, setNewStatus] = useState({ name: '', color: '#000000' })

	const handleAddStatus = () => {
		if (newStatus.name.trim() && newStatus.color) {
			setStatuses([...statuses, newStatus])
			setNewStatus({ name: '', color: '#000000' })
			setOpen(false)
		}
	}

	const handleDeleteStatus = name => {
		setStatuses(statuses.filter(status => status.name !== name))
	}

	return (
		<Box sx={{ width: '100%', maxWidth: 350 }}>
			<Typography variant='h6' sx={{ mb: 2 }}>
				Статусы
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
				{statuses.map((status, index) => (
					<Card
						key={index}
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							mb: 1,
							padding: '8px 12px',
							borderRadius: 2,
							backgroundColor: status.color,
							color: '#fff',
						}}
					>
						<Typography>{status.name}</Typography>
						<IconButton
							size='small'
							onClick={() => handleDeleteStatus(status.name)}
						>
							<DeleteIcon sx={{ color: '#fff' }} />
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
				Добавить статус
			</Button>

			{/* Модальное окно для добавления статуса */}
			<ModalWrapper
				title='Добавить статус'
				open={open}
				onClose={() => setOpen(false)}
				actions={
					<>
						<Button onClick={() => setOpen(false)}>Отмена</Button>
						<Button color='primary' onClick={handleAddStatus}>
							Добавить
						</Button>
					</>
				}
			>
				<TextField
					fullWidth
					label='Название статуса'
					value={newStatus.name}
					onChange={e => setNewStatus({ ...newStatus, name: e.target.value })}
				/>

				{/* Выбор цвета с красивым UI */}
				<Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
					<Typography sx={{ mr: 2 }}>Цвет:</Typography>
					<label htmlFor='colorPicker' style={{ cursor: 'pointer' }}>
						<Box
							sx={{
								width: 40,
								height: 40,
								borderRadius: '50%',
								backgroundColor: newStatus.color,
								border: '2px solid #fff',
								boxShadow: '0px 0px 5px rgba(0,0,0,0.3)',
								display: 'inline-block',
							}}
						></Box>
					</label>
					<input
						id='colorPicker'
						type='color'
						value={newStatus.color}
						onChange={e =>
							setNewStatus({ ...newStatus, color: e.target.value })
						}
						style={{
							visibility: 'hidden',
							position: 'absolute',
						}}
					/>
				</Box>
			</ModalWrapper>
		</Box>
	)
}

export default StatusBlock
