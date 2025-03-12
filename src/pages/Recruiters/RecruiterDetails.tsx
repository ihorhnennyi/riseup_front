import { fetchBranches } from '@api/branchApi'
import { fetchLeadsByRecruiter, fetchUserById } from '@api/userApi'
import TableWrapper from '@components/TableWrapper'
import { Container, Grid, Paper } from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EditRecruiterModal from './components/EditRecruiterModal'
import RecruiterCard from './components/RecruiterCard'

const RecruiterDetails = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [recruiter, setRecruiter] = useState(null)
	const [branchName, setBranchName] = useState(null)
	const [leads, setLeads] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [editModalOpen, setEditModalOpen] = useState(false)

	useEffect(() => {
		const loadRecruiterData = async () => {
			try {
				const recruiterData = await fetchUserById(id)
				setRecruiter(recruiterData)

				if (recruiterData.branch) {
					const branches = await fetchBranches()
					const branch = branches.find(b => b._id === recruiterData.branch)
					setBranchName(branch ? branch.name : 'Не указан')
				}

				// ✅ Загружаем лидов рекрутера
				const leadsData = await fetchLeadsByRecruiter(id)
				setLeads(leadsData)
			} catch (err) {
				setError('Ошибка загрузки данных')
			} finally {
				setLoading(false)
			}
		}

		if (id) loadRecruiterData()
	}, [id])

	if (loading) return <div>Загрузка...</div>
	if (error) return <div style={{ color: 'red' }}>{error}</div>

	// Формируем данные для таблицы
	const tableColumns = ['Имя', 'Email', 'Телефон', 'Статус']
	const tableData = leads.map(lead => [
		lead._id, // ID лида (не отображается, но нужен для клика)
		`${lead.name} ${lead.surname}`,
		lead.email || 'Нет Email',
		lead.phone || 'Нет телефона',
		lead.status || 'Без статуса',
	])

	// Обработчик клика по строке
	const handleRowClick = (leadId: string) => {
		navigate(`/candidates/${leadId}`) // ✅ Переход на страницу кандидата
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Container maxWidth='xl' sx={{ mt: 2 }}>
				<Grid container spacing={2}>
					{/* Левая колонка - Карточка рекрутера */}
					<Grid item xs={12} md={3}>
						<RecruiterCard
							name={recruiter?.firstName}
							surname={recruiter?.lastName}
							photo={recruiter?.photo}
							email={recruiter?.email}
							phone={recruiter?.phone}
							telegram={recruiter?.telegram}
							whatsapp={recruiter?.whatsapp}
							viber={recruiter?.viber}
							facebook={recruiter?.facebook}
							role={recruiter?.role}
							branch={branchName}
							isActive={recruiter?.isActive}
							onEdit={() => setEditModalOpen(true)}
						/>
					</Grid>

					{/* Правая колонка - Статистика и Календарь */}
					<Grid item xs={12} md={9}>
						<Grid container spacing={2}>
							<Grid item xs={12} md={6}>
								<Paper sx={{ padding: 2, height: '100%' }}>
									📊 <strong>Статистика</strong>
								</Paper>
							</Grid>
							<Grid item xs={12} md={6}>
								<Paper sx={{ padding: 2, height: '100%' }}>
									📅 <strong>Календарь / Фильтр</strong>
								</Paper>
							</Grid>
						</Grid>
					</Grid>

					{/* Таблица лидов */}
					<Grid item xs={12}>
						<TableWrapper
							columns={tableColumns}
							data={tableData}
							onRowClick={handleRowClick} // ✅ Клик по строке
						/>
					</Grid>
				</Grid>
			</Container>

			{/* Модалка редактирования */}
			{editModalOpen && (
				<EditRecruiterModal
					recruiterId={recruiter._id}
					onClose={() => setEditModalOpen(false)}
					onRecruiterUpdated={updatedRecruiter => {
						setRecruiter(prev => ({
							...prev,
							...updatedRecruiter,
						}))
					}}
				/>
			)}
		</motion.div>
	)
}

export default RecruiterDetails
