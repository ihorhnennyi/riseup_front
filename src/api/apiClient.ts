import axios from 'axios'

const API_URL = 'http://localhost:8000'

// Функция для получения CSRF-токена из куки
const getCsrfToken = (): string | null => {
	const match = document.cookie.match(/(^| )XSRF-TOKEN=([^;]+)/)
	return match ? decodeURIComponent(match[2]) : null
}

// Создаём API-клиент
const api = axios.create({
	baseURL: API_URL,
	withCredentials: true, // ✅ Включаем передачу кук
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
})

// Перехватчик запросов: автоматически добавляем CSRF-токен
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

export default api
