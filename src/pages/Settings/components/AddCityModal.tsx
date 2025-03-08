import { ModalWrapper } from '@components/index'
import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'

const AddCityModal = ({ open, onClose, onAdd }) => {
	const [city, setCity] = useState('')

	const handleAdd = () => {
		if (city.trim()) {
			onAdd(city.trim())
			setCity('')
			onClose()
		}
	}

	return (
		<ModalWrapper
			title='Добавить город'
			open={open}
			onClose={onClose}
			actions={
				<>
					<Button onClick={onClose}>Отмена</Button>
					<Button color='primary' onClick={handleAdd}>
						Добавить
					</Button>
				</>
			}
		>
			<Box>
				<TextField
					fullWidth
					placeholder='Введите название города'
					value={city}
					onChange={e => setCity(e.target.value)}
				/>
			</Box>
		</ModalWrapper>
	)
}

export default AddCityModal
