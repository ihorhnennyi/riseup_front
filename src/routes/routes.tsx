import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../layouts'
import { Dashboard, Leads, Recruiters, Settings, Statistics } from '../pages'

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
