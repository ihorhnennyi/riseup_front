import { fetchCities } from '@api/cityApi' // 🔹 Импорт API запроса
import PageHeader from '@components/PageHeader'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import BranchBlock from './components/BranchBlock'
import CityBlock from './components/CityBlock'
import IntegrationBlock from './components/IntergrationBlock'
import StatusBlock from './components/StatusBlock'

type City = {
	_id: string
	name: string
}

const Settings = () => {
	const [cities, setCities] = useState<City[]>([]) // 📌 Храним города

	// 🔹 Загружаем города с API при старте
	useEffect(() => {
		const loadCities = async () => {
			try {
				const cityData = await fetchCities() // 🔹 Запрос на сервер
				setCities(cityData) // 📌 Записываем в state
			} catch (error) {
				console.error('Ошибка загрузки городов:', error)
			}
		}

		loadCities()
	}, [])

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
			<PageHeader
				title='Настройки'
				description='Управляйте параметрами системы и настройками пользователей'
			/>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
				<StatusBlock />
				<CityBlock />
				<BranchBlock cities={cities} /> {/* ✅ Передаем загруженные города */}
				<IntegrationBlock />
			</Box>
		</Box>
	)
}

export default Settings
