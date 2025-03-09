import axios from 'axios'

const API_URL = 'http://localhost:8000/auth'

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
})

export const getCsrfToken = async () => {
	try {
		const response = await api.get('/csrf-token')
		return response.data.csrfToken
	} catch (error) {
		console.error('Ошибка получения CSRF-токена:', error)
		throw error
	}
}

export const login = async (
	username: string,
	password: string,
	rememberMe: boolean,
	csrfToken: string
) => {
	try {
		const response = await api.post(
			'/login',
			{ username, password, rememberMe },
			{
				headers: {
					'Content-Type': 'application/json',
					'X-XSRF-TOKEN': csrfToken,
				},
			}
		)
		return response.data
	} catch (error) {
		console.error('Ошибка входа:', error.response?.data || error.message)
		throw error
	}
}
