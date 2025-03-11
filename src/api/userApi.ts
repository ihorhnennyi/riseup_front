import api, { getAuthHeaders } from './apiClient'

export const fetchUsers = async () => {
	const headers = await getAuthHeaders()
	const response = await api.get('/users', { headers, withCredentials: true })
	return response.data
}

export const fetchUserById = async (id: string) => {
	const headers = await getAuthHeaders()
	const response = await api.get(`/users/${id}`, {
		headers,
		withCredentials: true,
	})
	return response.data
}

export const createUser = async (userData: FormData) => {
	const headers = await getAuthHeaders()
	return api.post('/users', userData, {
		headers, // НЕ передаем 'Content-Type'
		withCredentials: true,
	})
}

export const deleteUser = async (id: string) => {
	const headers = await getAuthHeaders()
	const response = await api.delete(`/users/${id}`, {
		headers,
		withCredentials: true,
	})
	return response.data
}
