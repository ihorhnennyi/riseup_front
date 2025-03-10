import api, { getAuthHeaders } from './apiClient'

// 🔹 Получение списка городов
export const fetchCities = async () => {
	const headers = await getAuthHeaders()
	const response = await api.get('/cities', { headers, withCredentials: true })
	return response.data
}

// 🔹 Создание города
export const createCity = async (name: string) => {
	const headers = await getAuthHeaders()
	const response = await api.post(
		'/cities',
		{ name },
		{ headers, withCredentials: true }
	)
	return response.data
}

// 🔹 Удаление города
export const deleteCity = async (id: string) => {
	const headers = await getAuthHeaders()
	const response = await api.delete(`/cities/${id}`, {
		headers,
		withCredentials: true,
	})
	return response.data
}
