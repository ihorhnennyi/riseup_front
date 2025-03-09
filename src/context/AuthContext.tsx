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
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
		!!localStorage.getItem('refresh_token')
	)

	// Функция логина (сохраняем токен и обновляем состояние)
	const login = (token: string) => {
		localStorage.setItem('refresh_token', token)
		setIsAuthenticated(true)
	}

	// Функция выхода (удаляем токен)
	const logout = () => {
		localStorage.removeItem('refresh_token')
		setIsAuthenticated(false)
	}

	// Проверяем токен при каждом ререндере
	useEffect(() => {
		const token = localStorage.getItem('refresh_token')
		setIsAuthenticated(!!token)
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
