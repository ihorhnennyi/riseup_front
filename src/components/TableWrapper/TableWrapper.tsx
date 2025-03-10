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
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface TableWrapperProps {
	columns: string[]
	data: any[][]
	onRowClick?: (id: string) => void // ✅ Функция для клика на строку
}

const TableWrapper: React.FC<TableWrapperProps> = ({
	columns,
	data,
	onRowClick,
}) => {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const navigate = useNavigate()

	return (
		<Box sx={{ width: '100%', overflowX: 'auto' }}>
			<TableContainer
				component={Paper}
				ref={containerRef}
				sx={{
					boxShadow: 3,
					borderRadius: '12px',
					overflowX: 'auto',
					overflowY: 'auto',
					backgroundColor: theme => theme.palette.background.paper,
				}}
			>
				<Table stickyHeader sx={{ minWidth: '500px', tableLayout: 'auto' }}>
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
									onClick={() => onRowClick?.(row[0])} // ✅ Переход по клику
								>
									<TableCell sx={{ textAlign: 'center' }}>
										{rowIndex + 1}
									</TableCell>

									{/* Данные */}
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
