import { Box } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'

const Layout = () => {
	const userRole: 'admin' | 'user' = 'admin'
	const [collapsed, setCollapsed] = useState(false)
	const sidebarWidth = collapsed ? 80 : 240 // ⚡️ Учитываем ширину Sidebar

	return (
		<Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
			<Sidebar
				role={userRole}
				collapsed={collapsed}
				setCollapsed={setCollapsed}
			/>

			{/* Основной контейнер с учетом Sidebar */}
			<Box
				sx={{
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column',
					width: `calc(100vw - ${sidebarWidth}px)`, // ✅ Контент теперь адаптируется
					maxWidth: `calc(100vw - ${sidebarWidth}px)`, // ✅ Не выходит за границы
					overflowX: 'hidden', // ✅ Запрещаем горизонтальный скролл у Layout
				}}
			>
				<Box component='main' sx={{ flexGrow: 1, p: 3, overflow: 'hidden' }}>
					<Outlet />
				</Box>
			</Box>
		</Box>
	)
}

export default Layout
