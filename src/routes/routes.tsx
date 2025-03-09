import ProtectedRoute from '@components/ProtectedRoute'
import { Layout } from '@layouts/index'
import {
	Dashboard,
	Leads,
	Login,
	Recruiters,
	Settings,
	Statistics,
} from '@pages/index'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
	{ path: '/', element: <Login /> }, // Страница логина

	{
		path: '/',
		element: <ProtectedRoute />, // Защита маршрутов
		children: [
			{
				path: '/',
				element: <Layout />,
				children: [
					{ path: '/dashboard', element: <Dashboard /> },
					{ path: '/candidates', element: <Leads /> },
					{ path: '/recruiters', element: <Recruiters /> },
					{ path: '/statistics', element: <Statistics /> },
					{ path: '/settings', element: <Settings /> },
				],
			},
		],
	},
])
