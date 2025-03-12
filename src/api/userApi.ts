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

// 🔹 Получение лидов по рекрутеру (убрали getAuthHeaders)
export const fetchLeadsByRecruiter = async (recruiterId: string) => {
	const response = await api.get(`/users/${recruiterId}/leads`, {
		withCredentials: true,
	})
	return response.data
}
