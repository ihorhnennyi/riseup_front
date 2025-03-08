import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'

interface TableWrapperProps {
	columns: string[]
	data: any[][]
}

const TableWrapper: React.FC<TableWrapperProps> = ({ columns, data }) => {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [maxHeight, setMaxHeight] = useState<number | 'auto'>('auto')

	useEffect(() => {
		const updateHeight = () => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect()
				const windowHeight = window.innerHeight
				const calculatedHeight = windowHeight - rect.top - 40
				setMaxHeight(calculatedHeight > 300 ? calculatedHeight : 'auto')
			}
		}

		updateHeight()
		window.addEventListener('resize', updateHeight)
		return () => window.removeEventListener('resize', updateHeight)
	}, [])

	return (
		<TableContainer
			component={Paper}
			ref={containerRef}
			sx={{
				width: '100%',
				maxWidth: '1800px',
				maxHeight,
				overflow: 'auto',
				margin: '0 auto',
				backgroundColor: theme => theme.palette.background.paper,
				boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
				borderRadius: '12px',
			}}
		>
			<Table stickyHeader>
				<TableHead>
					<TableRow>
						{columns.map((column, index) => (
							<TableCell
								key={index}
								sx={{
									fontWeight: 'bold',
									background: theme =>
										theme.palette.mode === 'dark' ? '#1E1E2F' : '#F4F4F4',
									color: theme => theme.palette.text.primary,
									padding: '12px',
								}}
							>
								{column}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{data.length > 0 ? (
						data.map((row, rowIndex) => (
							<TableRow key={rowIndex}>
								{row.map((cell, cellIndex) => (
									<TableCell key={cellIndex} sx={{ padding: '12px' }}>
										{cell}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								sx={{ textAlign: 'center', py: 2 }}
							>
								Нет данных
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default TableWrapper
