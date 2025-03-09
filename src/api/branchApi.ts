import axios from 'axios'

const API_URL = 'http://localhost:8000/branches'

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

export const fetchBranches = async () => {
	try {
		const response = await axios.get(API_URL, {
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

export const createBranch = async (name: string, cityId: string) => {
	try {
		const response = await axios.post(
			API_URL,
			{ name, cityId },
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
		throw error
	}
}

export const deleteBranch = async (id: string) => {
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
