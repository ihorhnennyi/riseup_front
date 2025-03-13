import api from '@api/apiClient'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

interface AuthContextType {
	isAuthenticated: boolean
	role: 'admin' | 'recruiter' | null
	login: (token: string, userRole: 'admin' | 'recruiter') => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [role, setRole] = useState<'admin' | 'recruiter' | null>(null)
	const [isCheckingAuth, setIsCheckingAuth] = useState(true)

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await api.get('/auth/session', {
					withCredentials: true,
				})
				setIsAuthenticated(response.data.isAuthenticated)
				setRole(response.data.role || null)
				localStorage.setItem('user_role', response.data.role || '')
			} catch (error) {
				console.error('Ошибка при проверке сессии:', error)
				setIsAuthenticated(false)
				setRole(null)
				localStorage.removeItem('user_role')
			} finally {
				setIsCheckingAuth(false)
			}
		}
		checkAuth()
	}, [])

	const login = (token: string, userRole: 'admin' | 'recruiter') => {
		localStorage.setItem('access_token', token)
		localStorage.setItem('user_role', userRole)
		setIsAuthenticated(true)
		setRole(userRole)
	}

	const logout = async () => {
		try {
			await api.post('/auth/logout', {}, { withCredentials: true })
		} catch (error) {
			console.error('Ошибка при выходе:', error)
		}
		localStorage.removeItem('user_role')
		setIsAuthenticated(false)
		setRole(null)
	}

	if (isCheckingAuth) return <div>Загрузка...</div>

	return (
		<AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth должен использоваться внутри AuthProvider')
	}
	return context
}
