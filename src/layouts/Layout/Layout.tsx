import { Box } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'

const Layout = () => {
	// const { role } = useAuth() // ✅ Получаем текущую роль пользователя
	const [collapsed, setCollapsed] = useState(false)

	return (
		<Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
			<Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

			{/* Основной контейнер с учетом Sidebar */}
			<Box
				sx={{
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column',
					width: `calc(100vw - ${collapsed ? 80 : 240}px)`, // ✅ Динамическая ширина
					maxWidth: `calc(100vw - ${collapsed ? 80 : 240}px)`, // ✅ Контент не выходит за границы
					overflowX: 'hidden',
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
