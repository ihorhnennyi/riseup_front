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
import LeadDetails from '@pages/Leads/LeadDetails'
import RecruiterDetails from '@pages/Recruiters/RecruiterDetails'
import { useRoutes } from 'react-router-dom'

const AppRoutes = () => {
	const routes = useRoutes([
		{ path: '/login', element: <Login /> },

		{
			path: '/',
			element: <ProtectedRoute />,
			children: [
				{
					path: '/',
					element: <Layout />,
					children: [
						{ path: 'dashboard', element: <Dashboard /> },
						{ path: 'candidates', element: <Leads /> },
						{ path: 'candidates/:id', element: <LeadDetails /> },
						{ path: 'recruiters', element: <Recruiters /> },
						{ path: 'recruiters/:id', element: <RecruiterDetails /> },
						{ path: 'statistics', element: <Statistics /> },
						{ path: 'settings', element: <Settings /> },
					],
				},
			],
		},
	])

	return routes
}

export default AppRoutes
