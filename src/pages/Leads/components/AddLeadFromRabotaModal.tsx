import { ModalWrapper } from '@components/index'
import { Button, TextField } from '@mui/material'
import { useState } from 'react'

interface AddLeadFromRabotaModalProps {
	open: boolean
	onClose: () => void
}

const AddLeadFromRabotaModal: React.FC<AddLeadFromRabotaModalProps> = ({
	open,
	onClose,
}) => {
	const [link, setLink] = useState('')

	const handleAddLead = () => {
		alert(`Добавлен лид с Rabota.ua: ${link}`)
		onClose()
	}

	return (
		<ModalWrapper
			title='Добавить лида с Rabota.ua'
			open={open}
			onClose={onClose}
			actions={
				<>
					<Button onClick={onClose}>Отмена</Button>
					<Button color='primary' onClick={handleAddLead} disabled={!link}>
						Добавить
					</Button>
				</>
			}
		>
			<TextField
				fullWidth
				placeholder='Вставьте ссылку на профиль лида'
				value={link}
				onChange={e => setLink(e.target.value)}
				variant='outlined'
			/>
		</ModalWrapper>
	)
}

export default AddLeadFromRabotaModal
