import api from './apiClient'

// 🔹 Создание статуса
export const createStatus = async (name: string, color: string) => {
	const response = await api.post(
		'/statuses',
		{ name, color },
		{ withCredentials: true }
	)
	return response.data
}

// 🔹 Получение списка статусов
export const fetchStatuses = async () => {
	const response = await api.get('/statuses', { withCredentials: true })
	return response.data
}

// 🔹 Удаление статуса
export const deleteStatus = async (id: string) => {
	const response = await api.delete(`/statuses/${id}`, {
		withCredentials: true,
	})
	return response.data
}
