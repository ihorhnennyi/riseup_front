import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material'

interface RecruiterLeadsTableProps {
	leads: any[]
}

const RecruiterLeadsTable: React.FC<RecruiterLeadsTableProps> = ({ leads }) => {
	if (leads.length === 0) {
		return <p style={{ textAlign: 'center', padding: 20 }}>Лидов пока нет</p>
	}

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>
							<strong>Имя</strong>
						</TableCell>
						<TableCell>
							<strong>Email</strong>
						</TableCell>
						<TableCell>
							<strong>Статус</strong>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{leads.map(lead => (
						<TableRow key={lead._id}>
							<TableCell>
								{lead.name} {lead.surname}
							</TableCell>
							<TableCell>{lead.email || 'Нет Email'}</TableCell>
							<TableCell>{lead.status || 'Без статуса'}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default RecruiterLeadsTable
