import { createStatus, deleteStatus, fetchStatuses } from '@api/statusApi'

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
import { useSnackbar } from 'notistack' // Уведомления
import { useEffect, useState } from 'react'

type Status = {
	_id: string
	name: string
	color: string
}

const StatusBlock = () => {
	const { enqueueSnackbar } = useSnackbar()
	const [statuses, setStatuses] = useState<Status[]>([])

	const [open, setOpen] = useState(false)
	const [newStatus, setNewStatus] = useState({ name: '', color: '#000000' })
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const loadStatuses = async () => {
			try {
				const data = await fetchStatuses()

				setStatuses(data)
			} catch (error) {
				enqueueSnackbar('Ошибка загрузки статусов', { variant: 'error' })
			}
		}

		loadStatuses()
	}, [])

	const handleDeleteStatus = async (id: string | undefined) => {
		if (!id) {
			enqueueSnackbar('Ошибка: ID статуса undefined!', { variant: 'error' })
			return
		}

		try {
			await deleteStatus(id)
			setStatuses(prev => prev.filter(status => status._id !== id))
			enqueueSnackbar('Статус удален', { variant: 'success' })
		} catch (error) {
			enqueueSnackbar('Ошибка при удалении статуса', { variant: 'error' })
		}
	}

	const handleAddStatus = async () => {
		if (!newStatus.name.trim()) {
			enqueueSnackbar('Введите название статуса', { variant: 'warning' })
			return
		}

		setLoading(true)
		try {
			const addedStatus = await createStatus(newStatus.name, newStatus.color)
			setStatuses([...statuses, addedStatus]) // Обновляем список
			enqueueSnackbar('Статус добавлен', { variant: 'success' })
			setNewStatus({ name: '', color: '#000000' })
			setOpen(false)
		} catch (error) {
			enqueueSnackbar('Ошибка при добавлении статуса', { variant: 'error' })
		} finally {
			setLoading(false)
		}
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
				{statuses.map(status => {
					return (
						<Card
							key={status._id || status.name}
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
								onClick={() => {
									console.log('Клик по кнопке удаления! ID:', status._id)
									handleDeleteStatus(status._id)
								}}
							>
								<DeleteIcon sx={{ color: '#fff' }} />
							</IconButton>
						</Card>
					)
				})}
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

			<ModalWrapper
				title='Добавить статус'
				open={open}
				onClose={() => setOpen(false)}
				actions={
					<>
						<Button onClick={() => setOpen(false)}>Отмена</Button>
						<Button
							color='primary'
							onClick={handleAddStatus}
							disabled={loading}
						>
							{loading ? 'Добавление...' : 'Добавить'}
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
