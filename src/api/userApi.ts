import api, { getAuthHeaders } from './apiClient'

// 🔹 Получение списка пользователей
export const fetchUsers = async () => {
	const headers = await getAuthHeaders()
	const response = await api.get('/users', { headers, withCredentials: true })
	return response.data
}

// 🔹 Создание нового пользователя
export const createUser = async (userData: any) => {
	const headers = await getAuthHeaders()
	const response = await api.post('/users', userData, {
		headers,
		withCredentials: true,
	})
	return response.data
}
