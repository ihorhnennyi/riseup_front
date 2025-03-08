import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material'

interface ModalWrapperProps {
	title?: string
	open: boolean
	onClose: () => void
	children: React.ReactNode
	actions?: React.ReactNode // Кастомные кнопки внизу
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
	title,
	open,
	onClose,
	children,
	actions,
}) => {
	return (
		<Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
			{title && <DialogTitle>{title}</DialogTitle>}
			<DialogContent>{children}</DialogContent>
			{actions && <DialogActions>{actions}</DialogActions>}
		</Dialog>
	)
}

export default ModalWrapper
