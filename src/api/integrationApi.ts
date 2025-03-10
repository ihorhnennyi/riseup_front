import api, { getAuthHeaders } from './apiClient'

// 🔹 Получение списка интеграций
export const fetchIntegrations = async () => {
	const headers = await getAuthHeaders()
	const response = await api.get('/integrations', {
		headers,
		withCredentials: true,
	})
	return response.data
}

// 🔹 Создание новой интеграции
export const createIntegration = async (name: string, url: string) => {
	const headers = await getAuthHeaders()
	const response = await api.post(
		'/integrations',
		{ name, url },
		{ headers, withCredentials: true }
	)
	return response.data
}

// 🔹 Удаление интеграции
export const deleteIntegration = async (id: string) => {
	const headers = await getAuthHeaders()
	const response = await api.delete(`/integrations/${id}`, {
		headers,
		withCredentials: true,
	})
	return response.data
}
