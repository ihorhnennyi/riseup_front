import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'

const Layout = () => {
	const userRole: 'admin' | 'user' = 'admin'

	return (
		<Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
			<Sidebar role={userRole} />
			<Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
				<Box component='main' sx={{ flexGrow: 1, p: 3 }}>
					<Outlet />
				</Box>
			</Box>
		</Box>
	)
}

export default Layout
