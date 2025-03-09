import axios from 'axios'

const API_URL = 'http://localhost:8000/statuses'

const getAuthHeaders = () => {
	const token = localStorage.getItem('accessToken')
	return token ? { Authorization: `Bearer ${token}` } : {}
}

const getCsrfTokenFromCookie = () => {
	return (
		document.cookie
			.split('; ')
			.find(row => row.startsWith('XSRF-TOKEN='))
			?.split('=')[1] || ''
	)
}

export const createStatus = async (name: string, color: string) => {
	try {
		const response = await axios.post(
			API_URL,
			{ name, color },
			{
				withCredentials: true,
				headers: {
					...getAuthHeaders(),
					'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
				},
			}
		)
		return response.data
	} catch (error) {
		console.error(
			'❌ Ошибка при создании статуса:',
			error.response?.data || error
		)
		throw error
	}
}

export const fetchStatuses = async () => {
	try {
		const response = await axios.get(API_URL, {
			withCredentials: true,
			headers: getAuthHeaders(),
		})
		return response.data
	} catch (error) {
		throw error
	}
}

export const deleteStatus = async (id: string) => {
	try {
		const response = await axios.delete(`${API_URL}/${id}`, {
			withCredentials: true,
			headers: {
				...getAuthHeaders(),
				'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
			},
		})
		return response.data
	} catch (error) {
		throw error
	}
}
