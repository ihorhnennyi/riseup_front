import { Box } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'

const Layout = () => {
	const userRole: 'admin' | 'user' = 'admin'
	const [collapsed, setCollapsed] = useState(false)
	const sidebarWidth = collapsed ? 20 : 60

	return (
		<Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
			<Sidebar
				role={userRole}
				collapsed={collapsed}
				setCollapsed={setCollapsed}
			/>

			<Box
				sx={{
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column',
					transition: 'margin 0.3s ease-in-out',
					mr: '20px',
					ml: `${sidebarWidth}px`,
				}}
			>
				<Box component='main' sx={{ flexGrow: 1, p: 3 }}>
					<Outlet />
				</Box>
			</Box>
		</Box>
	)
}

export default Layout
