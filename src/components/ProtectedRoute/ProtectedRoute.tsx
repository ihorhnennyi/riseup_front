import api from '@api/apiClient'
import { useAuth } from '@context/AuthContext'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
	const { isAuthenticated } = useAuth()
	const [isLoading, setIsLoading] = useState(true)
	const [validSession, setValidSession] = useState<boolean>(false)

	useEffect(() => {
		const checkSession = async () => {
			try {
				const response = await api.get('/auth/session', {
					withCredentials: true,
				})
				setValidSession(response.data.isAuthenticated)
			} catch (error) {
				console.error('❌ Ошибка при проверке сессии:', error)
				setValidSession(false)
			} finally {
				setIsLoading(false)
			}
		}

		checkSession()
	}, [])

	if (isLoading) return <div>Загрузка...</div>
	if (!isAuthenticated || !validSession) return <Navigate to='/login' replace />

	return <Outlet />
}

export default ProtectedRoute
