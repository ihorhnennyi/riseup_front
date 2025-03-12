import { CssBaseline } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // ✅ Используем только BrowserRouter
import { AuthProvider } from './context/AuthContext'
import { ThemeProviderWrapper } from './context/ThemeContext'
import './index.css'
import AppRoutes from './routes/AppRoutes' // ✅ Импортируем маршруты в виде компонента

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<ThemeProviderWrapper>
						<CssBaseline />
						<SnackbarProvider maxSnack={3} autoHideDuration={3000}>
							<AppRoutes /> {/* ✅ Используем компонент с маршрутами */}
						</SnackbarProvider>
					</ThemeProviderWrapper>
				</LocalizationProvider>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
)
