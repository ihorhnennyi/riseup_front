import { Edit as EditIcon } from '@mui/icons-material'
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	IconButton,
	Typography,
	useTheme,
} from '@mui/material'
import { FaFacebook, FaTelegram, FaViber, FaWhatsapp } from 'react-icons/fa'

interface RecruiterCardProps {
	name: string
	surname: string
	photo?: string | null
	email: string
	phone: string
	telegram?: string
	whatsapp?: string
	viber?: string
	facebook?: string
	role: string
	branch?: string
	isActive: boolean
	onEdit?: () => void
}

const RecruiterCard: React.FC<RecruiterCardProps> = ({
	name,
	surname,
	photo,
	email,
	phone,
	telegram,
	whatsapp,
	viber,
	facebook,
	role,
	branch,
	isActive,
	onEdit,
}) => {
	const theme = useTheme()
	const isDarkMode = theme.palette.mode === 'dark'

	return (
		<Card
			sx={{
				p: 1,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				position: 'relative',
				maxWidth: 400,
				boxShadow: 3,
				borderRadius: 3,
				backgroundColor: isDarkMode ? '#1E1E2D' : '#fff',
				color: isDarkMode ? 'white' : 'black',
				textAlign: 'center',
			}}
		>
			{/* Кнопка редактирования */}
			<IconButton
				onClick={onEdit}
				sx={{
					position: 'absolute',
					top: 10,
					right: 10,
					backgroundColor: 'rgba(255, 255, 255, 0.2)',
					color: isDarkMode ? 'white' : 'black',
					'&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.4)' },
				}}
			>
				<EditIcon />
			</IconButton>

			{/* Аватар */}
			<Avatar
				src={photo || '/default-avatar.png'}
				sx={{ width: 80, height: 80, backgroundColor: 'gray', mt: 1 }}
			/>

			{/* Контент */}
			<CardContent sx={{ textAlign: 'center', width: '100%' }}>
				{/* Имя и фамилия */}
				<Typography
					variant='h6'
					fontWeight='bold'
					sx={{
						wordBreak: 'break-word',
						whiteSpace: 'normal',
						color: isDarkMode ? 'white' : 'black',
					}}
				>
					{name} {surname}
				</Typography>

				<Typography
					variant='caption'
					sx={{ mt: 1, display: 'block', color: isDarkMode ? '#bbb' : '#666' }}
				>
					Роль: {role}
				</Typography>

				{/* Статус */}
				<Button
					variant='contained'
					size='small'
					sx={{
						mt: 1,
						backgroundColor: isActive ? 'green' : 'gray',
						color: 'white',
					}}
				>
					{isActive ? 'Активен' : 'Неактивен'}
				</Button>

				{/* Разделитель */}
				<Box sx={{ borderBottom: '1px solid #444', width: '100%', my: 1 }} />

				{/* Контакты */}
				<Typography variant='body1' fontWeight='bold'>
					Контакты
				</Typography>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
					<Typography
						variant='body2'
						sx={{
							color: isDarkMode ? '#ddd' : '#444',
							wordBreak: 'break-word',
						}}
					>
						Телефон: {phone}
					</Typography>
					<Typography
						variant='body2'
						sx={{
							color: isDarkMode ? '#ddd' : '#444',
							wordBreak: 'break-word',
						}}
					>
						Email: {email}
					</Typography>
				</Box>

				{/* Соцсети */}
				<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
					{telegram && (
						<a
							href={`https://t.me/${telegram}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<FaTelegram size={20} color='#0088cc' />
						</a>
					)}
					{whatsapp && (
						<a
							href={`https://wa.me/${whatsapp}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<FaWhatsapp size={20} color='#25D366' />
						</a>
					)}
					{viber && (
						<a
							href={`viber://chat?number=${viber}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<FaViber size={20} color='#7360F2' />
						</a>
					)}
					{facebook && (
						<a
							href={`https://facebook.com/${facebook}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<FaFacebook size={20} color='#1877F2' />
						</a>
					)}
				</Box>

				{/* Разделитель */}
				<Box sx={{ borderBottom: '1px solid #444', width: '100%', my: 1 }} />

				{/* Дополнительная информация */}
				<Typography variant='body1' fontWeight='bold'>
					Доп. информация
				</Typography>
				<Typography
					variant='body2'
					sx={{ color: isDarkMode ? '#ddd' : '#444' }}
				>
					Филиал: {branch || 'Не указан'}
				</Typography>
			</CardContent>
		</Card>
	)
}

export default RecruiterCard
