import axios from 'axios'

const API_URL = 'http://localhost:8000' // Заменить на production URL, если развернул

// Функция для получения CSRF-токена из куки
const getCsrfToken = (): string | null => {
	const match = document.cookie.match(/(^| )XSRF-TOKEN=([^;]+)/)
	return match ? decodeURIComponent(match[2]) : null
}

// Создаём API-клиент
const api = axios.create({
	baseURL: API_URL,
	withCredentials: true, // ✅ Передача куков и токенов
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
})

// 🔹 Перехватчик запросов: автоматически добавляем CSRF-токен
api.interceptors.request.use(
	config => {
		const csrfToken = getCsrfToken()
		if (csrfToken) {
			config.headers['X-XSRF-TOKEN'] = csrfToken
		} else {
			console.warn('⚠️ CSRF-токен отсутствует в куках!')
		}
		return config
	},
	error => Promise.reject(error)
)

// 🔹 Перехватчик ответов: обновляем токен при 401 (если accessToken истёк)
api.interceptors.response.use(
	response => response,
	async error => {
		if (error.response?.status === 401) {
			console.warn('🔄 Токен истёк, пробуем обновить...')
			try {
				await axios.post(
					`${API_URL}/auth/refresh`,
					{},
					{ withCredentials: true }
				)
				return api(error.config) // Повторяем оригинальный запрос
			} catch (refreshError) {
				console.error('🚫 Ошибка при обновлении токена', refreshError)
			}
		}
		return Promise.reject(error)
	}
)

export default api
