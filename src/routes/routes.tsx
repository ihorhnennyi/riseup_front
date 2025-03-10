import ProtectedRoute from '@components/ProtectedRoute'
import { Layout } from '@layouts/index'
import {
	Dashboard,
	Leads,
	Login,
	Recruiters, // ✅ Подключаем новую страницу
	Settings,
	Statistics,
} from '@pages/index'
import RecruiterDetails from '@pages/Recruiters/RecruiterDetails'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
	{ path: '/login', element: <Login /> }, // Маршрут для логина

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
					{ path: '/recruiters/:id', element: <RecruiterDetails /> },
					{ path: '/statistics', element: <Statistics /> },
					{ path: '/settings', element: <Settings /> },
				],
			},
		],
	},
])
