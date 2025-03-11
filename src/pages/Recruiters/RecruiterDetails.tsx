import { fetchBranches } from '@api/branchApi'
import { fetchUserById } from '@api/userApi'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RecruiterCard from './components/RecruiterCard'

const RecruiterDetails = () => {
	const { id } = useParams()
	const [recruiter, setRecruiter] = useState<any>(null)
	const [branchName, setBranchName] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadRecruiter = async () => {
			try {
				const data = await fetchUserById(id!)
				setRecruiter(data)

				// Получаем название филиала
				if (data.branch) {
					const branches = await fetchBranches()
					const branch = branches.find((b: any) => b._id === data.branch)
					setBranchName(branch ? branch.name : 'Не указан')
				}
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
		<div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
			<RecruiterCard
				firstName={recruiter.firstName}
				lastName={recruiter.lastName}
				middleName={recruiter.middleName}
				photo={recruiter.photo}
				role={recruiter.role}
				isActive={recruiter.isActive}
				email={recruiter.email}
				phone={recruiter.phone}
				telegram={recruiter.telegram}
				whatsapp={recruiter.whatsapp}
				viber={recruiter.viber}
				branchName={branchName}
				onEdit={() => console.log('Редактирование')}
			/>
		</div>
	)
}

export default RecruiterDetails
