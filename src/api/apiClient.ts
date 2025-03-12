import axios from 'axios'

const API_URL = 'http://localhost:8000'

// 🛠 Функция для получения CSRF-токена из cookies
const getCsrfToken = (): string => {
	const match = document.cookie.match(/(^| )XSRF-TOKEN=([^;]+)/)
	return match ? decodeURIComponent(match[2]) : ''
}

// 🌍 Создаём API-клиент с настройками
const api = axios.create({
	baseURL: API_URL,
	withCredentials: true, // ✅ Автоматически передаём cookies
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
		}
		return config
	},
	error => Promise.reject(error)
)

export default api
