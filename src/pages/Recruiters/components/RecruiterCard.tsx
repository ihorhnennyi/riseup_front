import { Edit as EditIcon } from '@mui/icons-material'
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	IconButton,
	Typography,
} from '@mui/material'
import {
	FaEnvelope,
	FaPhone,
	FaTelegram,
	FaViber,
	FaWhatsapp,
} from 'react-icons/fa'

interface RecruiterCardProps {
	firstName: string
	lastName: string
	middleName?: string
	photo?: string | null
	role: string
	isActive: boolean
	email: string
	phone: string
	telegram?: string
	whatsapp?: string
	viber?: string
	branchName?: string
	onEdit?: () => void
}

const RecruiterCard: React.FC<RecruiterCardProps> = ({
	firstName,
	lastName,
	middleName,
	photo,
	role,
	isActive,
	email,
	phone,
	telegram,
	whatsapp,
	viber,
	branchName,
	onEdit,
}) => {
	return (
		<Card
			sx={{
				p: 3,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				position: 'relative',
				maxWidth: 450, // Увеличил ширину карточки
				boxShadow: 5,
				borderRadius: 3,
				backgroundColor: '#1E1E2D',
			}}
		>
			{/* Кнопка редактирования */}
			<IconButton
				onClick={onEdit}
				sx={{
					position: 'absolute',
					top: 15,
					zIndex: 10,
					right: 15,
					backgroundColor: 'rgba(255, 255, 255, 0.2)',
					color: 'white',
					'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.4)' },
				}}
			>
				<EditIcon />
			</IconButton>

			{/* Верхний баннер */}
			<Box
				sx={{
					width: '100%',
					height: 140,
					background: 'linear-gradient(45deg, #6A5ACD, #3A86FF)',
					borderRadius: '10px 10px 0 0',
					position: 'relative',
				}}
			/>

			{/* Аватар */}
			<Avatar
				src={photo || ''}
				sx={{
					width: 100,
					height: 100,
					border: '4px solid white',
					mt: '-50px',
					backgroundColor: 'gray',
				}}
			/>

			{/* Контент */}
			<CardContent sx={{ textAlign: 'center', width: '100%' }}>
				<Typography variant='h5' fontWeight='bold' color='#fff'>
					{firstName} {lastName}
				</Typography>
				{middleName && (
					<Typography variant='body2' color='#aaa'>
						{middleName}
					</Typography>
				)}
				<Typography
					variant='caption'
					sx={{ mt: 1, display: 'block', color: '#bbb' }}
				>
					{role === 'user' ? 'Рекрутер' : role}
				</Typography>

				{/* Статус */}
				<Button
					variant='contained'
					size='small'
					sx={{ mt: 1, backgroundColor: isActive ? 'green' : 'gray' }}
				>
					{isActive ? 'Активен' : 'Неактивен'}
				</Button>

				{/* Соцсети (иконки без текста) */}
				<Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
					{email && (
						<a
							href={`mailto:${email}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<FaEnvelope size={24} color='#d44638' />
						</a>
					)}
					{phone && (
						<a href={`tel:${phone}`} target='_blank' rel='noopener noreferrer'>
							<FaPhone size={24} color='#34B7F1' />
						</a>
					)}
					{telegram && (
						<a
							href={`https://t.me/${telegram}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<FaTelegram size={24} color='#0088cc' />
						</a>
					)}
					{whatsapp && (
						<a
							href={`https://wa.me/${whatsapp}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<FaWhatsapp size={24} color='#25D366' />
						</a>
					)}
					{viber && (
						<a
							href={`viber://chat?number=${viber}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<FaViber size={24} color='#7360F2' />
						</a>
					)}
				</Box>

				{/* Филиал */}
				<Typography
					variant='body2'
					sx={{ mt: 2, fontWeight: 'bold', color: '#ccc' }}
				>
					Филиал: {branchName || 'Не указан'}
				</Typography>
			</CardContent>
		</Card>
	)
}

export default RecruiterCard
