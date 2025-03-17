import axios from 'axios'

const API_URL = 'http://localhost:8000' // Убедись, что порт совпадает

// 🔹 Создание API-клиента
const api = axios.create({
	baseURL: API_URL,
	withCredentials: true, // ✅ Разрешает отправку куков
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
})
api.interceptors.request.use(config => {
	// ⚡ НЕ пытайся читать accessToken из document.cookie, он HttpOnly!
	return config
})

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true
			console.warn('🔄 Токен истёк, пробуем обновить...')

			try {
				// ⚡ НЕ передавай refresh-токен вручную, куки передадутся автоматически
				await api.post('/auth/refresh', {}, { withCredentials: true })

				return api(originalRequest)
			} catch (refreshError) {
				console.error('🚫 Ошибка при обновлении токена:', refreshError)
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error)
	}
)

export default api
