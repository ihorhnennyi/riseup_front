import axios from 'axios'

const API_URL = 'http://localhost:8000' // ✅ ПРОВЕРЬ ПОРТ БЭКЕНДА!

// 🔹 Получение CSRF-токена из куки
const getCsrfToken = (): string | null => {
	const match = document.cookie.match(/(^| )XSRF-TOKEN=([^;]+)/)
	return match ? decodeURIComponent(match[2]) : null
}

// 🔹 Создание API-клиента
const api = axios.create({
	baseURL: API_URL,
	withCredentials: true, // ✅ Передача куков и токенов
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
})

// 🔹 Автоматически добавляем CSRF-токен
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

// 🔄 Перехватчик ответа: если токен истёк, пробуем обновить
api.interceptors.response.use(
	response => response,
	async error => {
		if (error.response?.status === 401) {
			console.warn('🔄 Токен истёк, пробуем обновить...')
			try {
				const refreshResponse = await axios.post(
					`${API_URL}/auth/refresh`,
					{},
					{ withCredentials: true }
				)

				console.log('🔄 Новый accessToken получен:', refreshResponse.data)

				// Повторяем оригинальный запрос с новым токеном
				return api(error.config)
			} catch (refreshError) {
				console.error('🚫 Ошибка при обновлении токена', refreshError)
				// Если refreshToken невалидный → разлогиниваем
				return Promise.reject(refreshError)
			}
		}
		return Promise.reject(error)
	}
)

export default api
