import {
	Box,
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
	onRowClick?: (id: string) => void
}

const TableWrapper: React.FC<TableWrapperProps> = ({
	columns,
	data,
	onRowClick,
}) => {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [tableHeight, setTableHeight] = useState<number | 'auto'>('auto')

	// Функция расчета высоты таблицы
	const updateTableHeight = () => {
		if (containerRef.current) {
			const boundingRect = containerRef.current.getBoundingClientRect()
			const availableHeight = window.innerHeight - boundingRect.top - 20 // Оставляем небольшой отступ
			setTableHeight(availableHeight)
		}
	}

	// Обновляем высоту при изменении размера окна
	useEffect(() => {
		updateTableHeight()
		window.addEventListener('resize', updateTableHeight)
		return () => window.removeEventListener('resize', updateTableHeight)
	}, [])

	return (
		<Box
			sx={{
				width: '100%',
				overflowX: 'auto',
				maxWidth: '100%',
			}}
		>
			<TableContainer
				component={Paper}
				ref={containerRef}
				sx={{
					boxShadow: 3,
					overflowX: 'auto',
					overflowY: 'auto',
					backgroundColor: theme => theme.palette.background.paper,
					maxWidth: '100%',
					maxHeight: tableHeight, // ✅ Динамическая высота
				}}
			>
				<Table stickyHeader sx={{ minWidth: '100%', tableLayout: 'auto' }}>
					<TableHead>
						<TableRow>
							<TableCell sx={{ width: '50px', textAlign: 'center' }}>
								#
							</TableCell>
							{columns.map((column, index) => (
								<TableCell
									key={index}
									sx={{ minWidth: '120px', textAlign: 'center' }}
								>
									{column.toUpperCase()}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data.length > 0 ? (
							data.map((row, rowIndex) => (
								<TableRow
									key={rowIndex}
									sx={{
										cursor: 'pointer',
										'&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
									}}
									onClick={() => onRowClick?.(row[0])}
								>
									<TableCell sx={{ textAlign: 'center' }}>
										{rowIndex + 1}
									</TableCell>

									{row.slice(1).map((cell, cellIndex) => (
										<TableCell
											key={cellIndex}
											sx={{
												whiteSpace: 'nowrap',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												textAlign: 'center',
											}}
										>
											{cell}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length + 1}
									sx={{ textAlign: 'center', py: 3 }}
								>
									Нет данных
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	)
}

export default TableWrapper
