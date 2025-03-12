import api from './apiClient'

// 🔹 Получение списка городов
export const fetchCities = async () => {
	const response = await api.get('/cities', { withCredentials: true })
	return response.data
}

// 🔹 Создание города
export const createCity = async (name: string) => {
	const response = await api.post(
		'/cities',
		{ name },
		{ withCredentials: true }
	)
	return response.data
}

// 🔹 Удаление города
export const deleteCity = async (id: string) => {
	const response = await api.delete(`/cities/${id}`, { withCredentials: true })
	return response.data
}
