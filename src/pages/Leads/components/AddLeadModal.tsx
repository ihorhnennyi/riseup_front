import { ModalWrapper } from '@components/index'
import { Button, TextField } from '@mui/material'
import { useState } from 'react'

const AddLeadModal = () => {
	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')

	return (
		<>
			<Button variant='contained' onClick={() => setOpen(true)}>
				Добавить пользователя
			</Button>

			<ModalWrapper
				title='Новый пользователь'
				open={open}
				onClose={() => setOpen(false)}
				actions={
					<>
						<Button onClick={() => setOpen(false)}>Отмена</Button>
						<Button color='primary' onClick={() => alert(`Добавлен: ${name}`)}>
							Добавить
						</Button>
					</>
				}
			>
				<TextField
					fullWidth
					placeholder='Введите имя пользователя'
					value={name}
					onChange={e => setName(e.target.value)}
					variant='outlined'
				/>
			</ModalWrapper>
		</>
	)
}

export default AddLeadModal
