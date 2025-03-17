import { createLead } from '@api/leadsApi'
import { fetchCurrentUser, fetchUserById } from '@api/userApi'
import { ModalWrapper } from '@components/index'
import { Button, TextField } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface AddLeadFromRabotaModalProps {
	open: boolean
	onClose: () => void
	onLeadAdded: () => void // ✅ Добавляем пропс для обновления списка лидов
}

const AddLeadFromRabotaModal: React.FC<AddLeadFromRabotaModalProps> = ({
	open,
	onClose,
	onLeadAdded,
}) => {
	const [error, setError] = useState<string | null>(null)
	const [login, setLogin] = useState<string | null>(null)
	const [password, setPassword] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [userId, setUserId] = useState<string | null>(null)
	const [candidateId, setCandidateId] = useState<string>('')
	const [resume, setResume] = useState<any>(null)

	useEffect(() => {
		const loadCurrentUser = async () => {
			try {
				const user = await fetchCurrentUser() // ✅ Получаем актуальные данные
				console.log('🔍 fetchCurrentUser вернул:', user) // 🔥 Лог

				if (!user || !user._id) {
					setError('❌ Ошибка: API вернул пустого пользователя!')
					return
				}

				setUserId(user._id) // ✅ Устанавливаем корректный ID

				// 🛠 Исправляем поиск интеграции
				const rabotaIntegration = user.integrations?.find(
					(integration: any) =>
						integration.name.toLowerCase().trim() === 'rabota.ua'
				)

				if (rabotaIntegration) {
					setLogin(rabotaIntegration.login.trim())
					setPassword(rabotaIntegration.password.trim())
					console.log('✅ Найдена интеграция Rabota.ua:', rabotaIntegration)
				} else {
					setError('❌ У вас нет интеграции с Rabota.ua!')
				}
			} catch (err) {
				console.error('❌ Ошибка загрузки пользователя:', err)
				setError('Ошибка загрузки данных пользователя')
			}
		}

		loadCurrentUser()
	}, [])

	const handleFetchAndSaveCandidate = async () => {
		setError(null)
		setLoading(true)

		console.log('🚀 Старт обработки кандидата...')

		if (!login || !password) {
			setError('❌ Логин или пароль не найдены в интеграции!')
			setLoading(false)
			return
		}

		try {
			// 🔹 Авторизация в Rabota.ua API
			console.log('🔑 Авторизация в Rabota.ua...')
			const authResponse = await axios.post(
				'https://auth-api.robota.ua/Login',
				{ username: login, password: password, remember: true }
			)
			const token = authResponse.data
			console.log('✅ Успешный вход, токен получен')

			// 🔹 Получение данных кандидата
			console.log(`🔍 Запрос резюме кандидата: ID ${candidateId}`)
			const resumeResponse = await axios.get(
				`https://employer-api.robota.ua/resume/${candidateId}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			if (!resumeResponse.data) {
				throw new Error('Пустой ответ от API Rabota.ua')
			}

			const candidateData = resumeResponse.data
			console.log('📄 Данные кандидата:', candidateData)

			// 🔹 Проверяем существование рекрутера
			if (!userId) {
				throw new Error('❌ Ошибка: ID текущего пользователя не найден!')
			}

			console.log(`🔍 Проверяем существование рекрутера: ${userId}`)
			const recruiterExists = await fetchUserById(userId)

			if (!recruiterExists) {
				setError('❌ Ошибка: Рекрутер не найден в базе!')
				setLoading(false)
				console.log('❌ Рекрутер не найден!')
				return
			}

			console.log('✅ Рекрутер найден:', recruiterExists)

			// 🔹 Создаём объект нового кандидата
			const newCandidate = {
				name: candidateData.name || '',
				surname: candidateData.surname || '',
				email: candidateData.email || '',
				phone: candidateData.phone || '',
				age: Number(candidateData.age) || 0,
				salaryExpectation: Number(candidateData.salary) || undefined,
				relocation: candidateData.relocations?.length > 0 ? true : undefined,
				remoteWork: candidateData.workSchedule?.includes(7) ? true : undefined,
				workSchedule: candidateData.scheduleIds
					? candidateData.scheduleIds.split(',')
					: undefined,
				notes: candidateData.notes ? candidateData.notes.join('\n') : undefined,
				recruiter: userId, // ✅ ID проверенного рекрутера
			}

			console.log('📡 Отправляем данные на сервер:', newCandidate)

			// 🔹 Отправляем данные на создание
			const response = await createLead(newCandidate)

			console.log('✅ Кандидат успешно создан:', response)
			setResume(candidateData)

			// ✅ Проверяем, передан ли onLeadAdded перед вызовом
			if (onLeadAdded) {
				onLeadAdded()
			} else {
				console.warn('⚠️ onLeadAdded не передан в AddLeadFromRabotaModal')
			}

			// ✅ Закрываем модалку
			if (onClose) {
				onClose()
			} else {
				console.warn('⚠️ onClose не передан в AddLeadFromRabotaModal')
			}
		} catch (error: any) {
			console.error('❌ Ошибка при запросе резюме:', error)
			setError(error.response?.data?.message || 'Ошибка загрузки резюме')
		} finally {
			setLoading(false)
		}
	}

	return (
		<ModalWrapper title='Rabota.ua' open={open} onClose={onClose}>
			<TextField
				fullWidth
				label='ID кандидата'
				value={candidateId}
				onChange={e => setCandidateId(e.target.value)}
				variant='outlined'
				sx={{ marginBottom: '20px' }}
			/>
			<Button
				color='primary'
				onClick={handleFetchAndSaveCandidate}
				disabled={loading}
			>
				{loading ? 'Загрузка...' : 'Найти и сохранить кандидата'}
			</Button>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</ModalWrapper>
	)
}

export default AddLeadFromRabotaModal
