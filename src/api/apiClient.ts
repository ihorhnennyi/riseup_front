import axios from 'axios'

const API_URL = 'http://localhost:8000'

// 🔹 Создаём базовый API-клиент
const api = axios.create({
	baseURL: API_URL,
	withCredentials: true, // ✅ Обязательно включаем куки
	headers: {
		'Content-Type': 'application/json',
	},
})

// ✅ Функция получения CSRF-токена
export const fetchCsrfToken = async () => {
	try {
		await api.get('/auth/csrf-token', { withCredentials: true })
	} catch (error) {
		console.error('❌ Ошибка получения CSRF-токена:', error)
		throw error
	}
}

// ✅ Функция получения CSRF-токена из cookies
export const getCsrfTokenFromCookie = (): string => {
	return (
		document.cookie
			.split('; ')
			.find(row => row.startsWith('XSRF-TOKEN='))
			?.split('=')[1] || ''
	)
}

// ✅ Функция получения заголовков с авторизацией и CSRF
export const getAuthHeaders = async () => {
	try {
		await fetchCsrfToken() // ✅ Убедимся, что CSRF-токен обновлён
		const csrfToken = getCsrfTokenFromCookie()
		const token = localStorage.getItem('accessToken')

		if (!csrfToken) throw new Error('CSRF token missing')

		return {
			Authorization: `Bearer ${token || ''}`,
			'X-XSRF-TOKEN': csrfToken,
		}
	} catch (error) {
		console.error('❌ Ошибка при получении заголовков авторизации:', error)
		throw error
	}
}

export default api
