import { Layout } from '@layouts/index'
import {
	Dashboard,
	Leads,
	Recruiters,
	Settings,
	Statistics,
} from '@pages/index'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{ path: '/', element: <Dashboard /> },
			{ path: '/candidates', element: <Leads /> },
			{ path: '/recruiters', element: <Recruiters /> },
			{ path: '/statistics', element: <Statistics /> },
			{ path: '/settings', element: <Settings /> },
		],
	},
])
