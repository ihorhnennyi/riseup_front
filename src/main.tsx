import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ThemeProviderWrapper } from './context/ThemeContext'
import { router } from './routes/routes'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProviderWrapper>
			<RouterProvider router={router} />
		</ThemeProviderWrapper>
	</React.StrictMode>
)
