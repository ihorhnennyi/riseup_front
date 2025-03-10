import { fetchUserById } from '@api/userApi'
import { PageHeader } from '@components/index'
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const RecruiterDetails = () => {
	const { id } = useParams() // Получаем ID из URL
	const [recruiter, setRecruiter] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadRecruiter = async () => {
			try {
				const data = await fetchUserById(id!) // Получаем данные рекрутера
				setRecruiter(data)
			} catch (err) {
				setError('Ошибка загрузки рекрутера')
			} finally {
				setLoading(false)
			}
		}

		if (id) loadRecruiter()
	}, [id])

	if (loading) return <div>Загрузка...</div>
	if (error) return <div style={{ color: 'red' }}>{error}</div>

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<PageHeader
				title={`${recruiter.firstName} ${recruiter.lastName}`}
				description='Информация о рекрутере'
			/>

			<Typography>
				<strong>Email:</strong> {recruiter.email}
			</Typography>
			<Typography>
				<strong>Телефон:</strong> {recruiter.phone || 'Не указан'}
			</Typography>
			<Typography>
				<strong>Филиал:</strong> {recruiter.branch || 'Не указан'}
			</Typography>
			<Typography>
				<strong>Статус:</strong> {recruiter.isActive ? 'Активен' : 'Неактивен'}
			</Typography>
		</Box>
	)
}

export default RecruiterDetails
