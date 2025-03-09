import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' // Добавляем контекст авторизации
import { ThemeProviderWrapper } from './context/ThemeContext'
import './index.css'
import { router } from './routes/routes'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<ThemeProviderWrapper>
				<AuthProvider>
					{' '}
					{/* Оборачиваем приложение в AuthProvider */}
					<RouterProvider router={router} />
				</AuthProvider>
			</ThemeProviderWrapper>
		</LocalizationProvider>
	</React.StrictMode>
)
