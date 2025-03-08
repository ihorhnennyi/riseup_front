import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'

interface PageHeaderProps {
	title: string
	description?: string
	image?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				backgroundColor: theme => theme.palette.background.paper,
				borderRadius: 2,
				p: 3,
				mb: 3,
				boxShadow: 2,
				overflow: 'hidden',
				position: 'relative',
			}}
		>
			{/* Анимированный текст */}
			<Box>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Typography variant='h4' fontWeight='bold'>
						{title}
					</Typography>
					{description && (
						<Typography variant='body1' color='text.secondary' mt={1}>
							{description}
						</Typography>
					)}
				</motion.div>
			</Box>
		</Box>
	)
}

export default PageHeader
