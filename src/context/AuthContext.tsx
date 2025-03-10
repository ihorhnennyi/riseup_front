import axios from 'axios'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

interface AuthContextType {
	isAuthenticated: boolean
	login: (token: string) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

	// Функция логина
	const login = (token: string) => {
		localStorage.setItem('refresh_token', token)
		setIsAuthenticated(true)
	}

	// Функция выхода
	const logout = async () => {
		await axios.post(
			'http://localhost:8000/auth/logout',
			{},
			{ withCredentials: true }
		)
		localStorage.removeItem('refresh_token')
		setIsAuthenticated(false)
		window.location.href = '/login'
	}

	// Проверка сессии при каждом рендере
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await axios.get('http://localhost:8000/auth/session', {
					withCredentials: true,
				})
				setIsAuthenticated(response.data.isAuthenticated)
			} catch {
				setIsAuthenticated(false)
			}
		}
		checkAuth()
	}, [])

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context)
		throw new Error('useAuth должен использоваться внутри AuthProvider')
	return context
}
