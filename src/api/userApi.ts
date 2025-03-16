import api from './apiClient'

// 🔹 Получение списка пользователей
export const fetchUsers = async () => {
	const response = await api.get('/users', { withCredentials: true })
	return response.data
}

export const fetchUserById = async (id: string) => {
	const response = await api.get(`/users/${id}`, { withCredentials: true })
	return response.data
}

export const createUser = async (userData: FormData) => {
	return api.post('/users', userData, { withCredentials: true })
}

export const updateUser = async (id: string, userData: FormData) => {
	return api.put(`/users/${id}`, userData, { withCredentials: true })
}

export const deleteUser = async (id: string) => {
	const response = await api.delete(`/users/${id}`, { withCredentials: true })
	return response.data
}

export const fetchLeadsByRecruiter = async (recruiterId: string) => {
	const response = await api.get(`/users/${recruiterId}/leads`, {
		withCredentials: true,
	})
	return response.data
}

// 🔹 Получение лидов по рекрутеру (убрали getAuthHeaders)
export const fetchCurrentUser = async () => {
	try {
		const response = await api.get('/auth/session', { withCredentials: true })

		if (response.status === 401) {
			console.warn('🔄 Токен истёк, пользователь разлогинен!')
			return null
		}

		if (!response.data || !response.data._id) {
			console.error('❌ Ошибка: API вернул пустого пользователя!')
			return null
		}

		// ✅ Сохраняем пользователя в sessionStorage
		sessionStorage.setItem('currentUser', JSON.stringify(response.data))

		console.log('🛠 Актуальные данные пользователя:', response.data)
		return response.data
	} catch (error) {
		console.error('❌ Ошибка fetchCurrentUser:', error)

		if (error.response?.status === 401) {
			console.warn('⚠️ Сервер вернул 401 → сессия недействительна')
			// Можно вызвать logout() или удалить куки
		}
		return null
	}
}
