import api from '@api/apiClient'
import { useAuth } from '@context/AuthContext'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
	const { isAuthenticated } = useAuth()
	const [validSession, setValidSession] = useState<boolean | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const checkSession = async () => {
			try {
				const response = await api.get('/auth/session', {
					withCredentials: true, // ✅ Это главное условие!
				})

				console.log('✅ Ответ от /auth/session:', response.data)
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

	if (validSession === null) {
		return <div>Ошибка соединения. Попробуйте позже.</div>
	}

	return validSession ? <Outlet /> : <Navigate to='/login' replace />
}

export default ProtectedRoute
