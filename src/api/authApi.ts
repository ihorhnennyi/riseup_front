import api from './apiClient'

// 🔹 Получаем CSRF-токен перед запросами
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
		await fetchCsrfToken() // ✅ Получаем CSRF-токен перед логином

		const response = await api.post(
			'/auth/login',
			{ email, password, rememberMe },
			{ withCredentials: true }
		)

		console.log('✅ Успешный вход, куки установлены')

		// ✅ Сохраняем данные пользователя после входа
		sessionStorage.setItem('currentUser', JSON.stringify(response.data))

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
		console.log('✅ Выход выполнен')

		// ❌ Удаляем сессию пользователя
		sessionStorage.removeItem('currentUser')
		document.cookie =
			'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;'
	} catch (error) {
		console.error('❌ Ошибка выхода:', error)
	}
}

export const getUserSession = async () => {
	try {
		const response = await api.get('/auth/session', { withCredentials: true })

		if (!response.data || !response.data._id) {
			return null
		}

		return response.data
	} catch (error) {
		return null
	}
}

export const fetchCurrentUser = async () => {
	try {
		const response = await api.get('/auth/session', { withCredentials: true })

		return response.data
	} catch (error) {
		return null
	}
}
