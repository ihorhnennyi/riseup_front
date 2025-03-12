import api from './apiClient'

// 🔹 Получение списка интеграций
export const fetchIntegrations = async () => {
	const response = await api.get('/integrations', { withCredentials: true })
	return response.data
}

// 🔹 Создание новой интеграции
export const createIntegration = async (name: string, url: string) => {
	const response = await api.post(
		'/integrations',
		{ name, url },
		{ withCredentials: true }
	)
	return response.data
}

// 🔹 Удаление интеграции
export const deleteIntegration = async (id: string) => {
	const response = await api.delete(`/integrations/${id}`, {
		withCredentials: true,
	})
	return response.data
}
