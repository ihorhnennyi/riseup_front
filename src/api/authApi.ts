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
			{ withCredentials: true } // ✅ Отправляем куки
		)

		console.log('✅ Успешный вход, куки установлены')

		// ❌ Не сохраняем accessToken в localStorage (он теперь в Cookie)
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
	} catch (error) {
		console.error('❌ Ошибка выхода:', error)
	}
}

export const getUserSession = async () => {
	try {
		const response = await api.get('/auth/session', { withCredentials: true })
		console.log('✅ API /auth/session:', response.data)

		if (!response.data || !response.data._id) {
			console.error('❌ Ошибка: В ответе API нет _id пользователя!')
			return null
		}

		return response.data
	} catch (error) {
		console.error('❌ Ошибка получения сессии:', error)
		return null
	}
}

export const fetchCurrentUser = async () => {
	try {
		const response = await api.get('/auth/session', { withCredentials: true })
		console.log('✅ Данные текущего пользователя:', response.data)
		return response.data
	} catch (error) {
		console.error('❌ Ошибка получения текущего пользователя:', error)
		return null
	}
}
