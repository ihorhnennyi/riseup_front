import api from './apiClient' // ✅ Убираем getAuthHeaders

export const fetchLeads = async () => {
	const response = await api.get('/leads', { withCredentials: true })
	return response.data
}

// export const fetchLeadById = async (id: string) => {
// 	const response = await api.get(`/leads/${id}`, { withCredentials: true })
// 	return response.data
// }

export const fetchLeadById = async (leadId: string) => {
	try {
		const response = await api.get(`/leads/${leadId}?populate=recruiter`, {
			withCredentials: true,
		})
		return response.data
	} catch (error) {
		console.error('Ошибка при загрузке лида:', error)
		throw error
	}
}

// api/leadsApi.ts
export const createLead = async (leadData: any) => {
	if (leadData instanceof FormData) {
		return api.post('/leads', leadData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			withCredentials: true,
		})
	} else {
		return api.post('/leads', leadData, {
			headers: {
				'Content-Type': 'application/json',
			},
			withCredentials: true,
		})
	}
}

export const updateLead = async (id: string, leadData: any) => {
	console.log(`📡 Отправляем PUT запрос: /leads/${id}`)

	// Проверяем, FormData или JSON
	const isFormData = leadData instanceof FormData

	return api.put(`/leads/${id}`, leadData, {
		headers: {
			'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
		},
		withCredentials: true,
	})
}

export const deleteLead = async (id: string) => {
	console.log(`🗑 Удаление кандидата с ID: ${id}`)
	const response = await api.delete(`/leads/${id}`, { withCredentials: true })
	return response.data
}
