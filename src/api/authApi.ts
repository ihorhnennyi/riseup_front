import api, { getAuthHeaders } from './apiClient'

// 🔹 Вход
export const login = async (
	email: string,
	password: string,
	rememberMe: boolean
) => {
	try {
		const headers = await getAuthHeaders()
		const response = await api.post(
			'/auth/login',
			{ email, password, rememberMe },
			{ headers, withCredentials: true }
		)
		localStorage.setItem('refresh_token', response.data.refresh_token)
		return response.data
	} catch (error) {
		console.error('❌ Ошибка входа:', error)
		throw error
	}
}

// 🔹 Выход
export const logout = async () => {
	try {
		const headers = await getAuthHeaders()
		await api.post('/auth/logout', {}, { headers, withCredentials: true })

		// Очищаем все токены
		localStorage.removeItem('token')
		localStorage.removeItem('refresh_token')
		sessionStorage.clear()
		document.cookie =
			'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

		window.location.href = '/login'
	} catch (error) {
		console.error('❌ Ошибка выхода:', error)
	}
}
