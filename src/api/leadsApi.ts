import api, { getAuthHeaders } from './apiClient'

export const fetchLeads = async () => {
	const headers = await getAuthHeaders()
	const response = await api.get('/leads', { headers, withCredentials: true })
	return response.data
}

export const fetchLeadById = async (id: string) => {
	const headers = await getAuthHeaders()
	const response = await api.get(`/leads/${id}`, {
		headers,
		withCredentials: true,
	})
	return response.data
}

export const createLead = async (leadData: FormData) => {
	const headers = await getAuthHeaders()
	delete headers['Content-Type']
	return api.post('/leads', leadData, {
		headers,
		withCredentials: true,
	})
}

export const deleteLead = async (id: string) => {
	const headers = await getAuthHeaders()
	const response = await api.delete(`/leads/${id}`, {
		headers,
		withCredentials: true,
	})
	return response.data
}
