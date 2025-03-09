import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { SnackbarProvider } from 'notistack' // ✅ Добавляем notistack
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProviderWrapper } from './context/ThemeContext'
import './index.css'
import { router } from './routes/routes'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<ThemeProviderWrapper>
				<AuthProvider>
					<SnackbarProvider maxSnack={3} autoHideDuration={3000}>
						{' '}
						{/* ✅ Теперь алерты будут работать */}
						<RouterProvider router={router} />
					</SnackbarProvider>
				</AuthProvider>
			</ThemeProviderWrapper>
		</LocalizationProvider>
	</React.StrictMode>
)
