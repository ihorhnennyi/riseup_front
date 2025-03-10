import api, { getAuthHeaders } from './apiClient'

// 🔹 Получение списка филиалов
export const fetchBranches = async () => {
	const headers = await getAuthHeaders()
	const response = await api.get('/branches', {
		headers,
		withCredentials: true,
	})
	return response.data
}

// 🔹 Создание филиала
export const createBranch = async (name: string, cityId: string) => {
	const headers = await getAuthHeaders()
	const response = await api.post(
		'/branches',
		{ name, cityId },
		{ headers, withCredentials: true }
	)
	return response.data
}

// 🔹 Удаление филиала
export const deleteBranch = async (id: string) => {
	const headers = await getAuthHeaders()
	const response = await api.delete(`/branches/${id}`, {
		headers,
		withCredentials: true,
	})
	return response.data
}
