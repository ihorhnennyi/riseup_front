import { jwtDecode } from 'jwt-decode'
import api from './apiClient'

// 🔹 Функция для получения CSRF-токена перед запросами
export const fetchCsrfToken = async (): Promise<void> => {
	try {
		const response = await api.get('/auth/csrf-token', {
			withCredentials: true,
		})
		console.log('✅ CSRF-токен получен:', response.data)
	} catch (error) {
		console.error('❌ Ошибка получения CSRF-токена:', error)
		throw error
	}
}

// 🔹 Функция логина
export const login = async (
	email: string,
	password: string,
	rememberMe: boolean
) => {
	try {
		// 1. Запрашиваем CSRF-токен перед логином
		await fetchCsrfToken()

		// 2. Отправляем запрос на логин
		const response = await api.post(
			'/auth/login',
			{ email, password, rememberMe },
			{ withCredentials: true }
		)

		console.log('✅ Успешный вход:', response.data)
		localStorage.setItem('access_token', response.data.access_token) // ✅ Сохраняем токен

		return response.data
	} catch (error) {
		console.error('❌ Ошибка входа:', error)
		throw error
	}
}

// 🔹 Функция выхода
export const logout = async () => {
	try {
		await api.post('/auth/logout', {}, { withCredentials: true })
		localStorage.removeItem('access_token') // ✅ Очищаем токен
		console.log('✅ Выход выполнен')
	} catch (error) {
		console.error('❌ Ошибка выхода:', error)
	}
}

// 🔹 Функция декодирования токена
export const getUserIdFromToken = (): string | null => {
	try {
		const token = localStorage.getItem('access_token') // ✅ Берём токен из localStorage
		if (!token) return null

		const decoded: any = jwtDecode(token)
		return decoded?.userId || null
	} catch (error) {
		console.error('❌ Ошибка декодирования токена:', error)
		return null
	}
}
