import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../layouts/'
// import Dashboard from './pages/Dashboard'
// import Leads from './pages/Leads'
// import Offers from './pages/Offers'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			// { path: '/', element: <Dashboard /> },
			// { path: '/leads', element: <Leads /> },
			// { path: '/offers', element: <Offers /> },
		],
	},
])
