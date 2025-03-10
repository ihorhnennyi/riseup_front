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

export const createUser = async (userData: any) => {
	const headers = await getAuthHeaders()
	const response = await api.post('/users', userData, {
		headers: { ...headers, 'Content-Type': 'multipart/form-data' },
		withCredentials: true,
	})
	return response.data
}

export const deleteUser = async (id: string) => {
	const headers = await getAuthHeaders()
	const response = await api.delete(`/users/${id}`, {
		headers,
		withCredentials: true,
	})
	return response.data
}
