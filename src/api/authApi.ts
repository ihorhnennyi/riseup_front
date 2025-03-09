import axios from 'axios'

const API_URL = 'http://localhost:8000/auth'

// ✅ Функция для получения CSRF-токена
export const fetchCsrfToken = async () => {
	const response = await axios.get(`${API_URL}/csrf-token`, {
		withCredentials: true,
	})
	return response.data.csrfToken
}

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
})

export const getCsrfToken = async () => {
	try {
		const response = await api.get('/csrf-token')
		return response.data.csrfToken
	} catch (error) {
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
		throw error
	}
}
