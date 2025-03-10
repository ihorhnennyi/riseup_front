import api, { getAuthHeaders } from './apiClient'

// 🔹 Создание статуса
export const createStatus = async (name: string, color: string) => {
	const headers = await getAuthHeaders()
	const response = await api.post(
		'/statuses',
		{ name, color },
		{ headers, withCredentials: true }
	)
	return response.data
}

// 🔹 Получение списка статусов
export const fetchStatuses = async () => {
	const headers = await getAuthHeaders()
	const response = await api.get('/statuses', {
		headers,
		withCredentials: true,
	})
	return response.data
}

// 🔹 Удаление статуса
export const deleteStatus = async (id: string) => {
	const headers = await getAuthHeaders()
	const response = await api.delete(`/statuses/${id}`, {
		headers,
		withCredentials: true,
	})
	return response.data
}
