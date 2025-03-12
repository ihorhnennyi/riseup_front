import api from './apiClient'

// 🔹 Получение списка филиалов
export const fetchBranches = async () => {
	const response = await api.get('/branches', { withCredentials: true })
	return response.data
}

// 🔹 Создание филиала
export const createBranch = async (name: string, cityId: string) => {
	const response = await api.post(
		'/branches',
		{ name, cityId },
		{ withCredentials: true }
	)
	return response.data
}

// 🔹 Удаление филиала
export const deleteBranch = async (id: string) => {
	const response = await api.delete(`/branches/${id}`, {
		withCredentials: true,
	})
	return response.data
}
