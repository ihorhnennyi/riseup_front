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
	isAdmin: () => boolean
	isRecruiter: () => boolean
	login: (role: 'admin' | 'recruiter') => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [role, setRole] = useState<'admin' | 'recruiter' | null>(null)
	const [isCheckingAuth, setIsCheckingAuth] = useState(true)

	// ✅ Проверяем сессию при загрузке
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await api.get('/auth/session', {
					withCredentials: true,
				})
				setIsAuthenticated(response.data.isAuthenticated)
				setRole(response.data.role || null)
			} catch (error) {
				console.error('Ошибка при проверке сессии:', error)
				setIsAuthenticated(false)
				setRole(null)
			} finally {
				setIsCheckingAuth(false)
			}
		}

		checkAuth()
	}, [])

	// ✅ Логин без сохранения accessToken в Local Storage
	const login = (userRole: 'admin' | 'recruiter') => {
		setIsAuthenticated(true)
		setRole(userRole)
	}

	// ✅ Выход (очистка сессии)
	const logout = async () => {
		try {
			await api.post('/auth/logout', {}, { withCredentials: true })
		} catch (error) {
			console.error('Ошибка при выходе:', error)
		}

		setIsAuthenticated(false)
		setRole(null)
	}

	// ✅ Методы для проверки ролей
	const isAdmin = () => role === 'admin'
	const isRecruiter = () => role === 'recruiter'

	if (isCheckingAuth) return <div>Загрузка...</div>

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, role, isAdmin, isRecruiter, login, logout }}
		>
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
