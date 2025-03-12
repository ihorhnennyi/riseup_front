import api from './apiClient' // ✅ Убираем getAuthHeaders

export const fetchLeads = async () => {
	const response = await api.get('/leads', { withCredentials: true })
	return response.data
}

export const fetchLeadById = async (id: string) => {
	const response = await api.get(`/leads/${id}`, { withCredentials: true })
	return response.data
}

export const createLead = async (leadData: FormData) => {
	return api.post('/leads', leadData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		withCredentials: true,
	})
}

export const updateLead = async (id: string, leadData: FormData) => {
	return api.put(`/leads/${id}`, leadData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		withCredentials: true,
	})
}

export const deleteLead = async (id: string) => {
	const response = await api.delete(`/leads/${id}`, { withCredentials: true })
	return response.data
}
