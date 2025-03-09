import { useAuth } from '@context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
	const { isAuthenticated } = useAuth()

	console.log('Проверка авторизации в ProtectedRoute:', isAuthenticated)

	return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
}

export default ProtectedRoute
