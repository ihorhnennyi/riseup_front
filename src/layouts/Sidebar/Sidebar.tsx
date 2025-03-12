import { logout } from '@api/authApi'
import { useAuth } from '@context/AuthContext'
import { useThemeContext } from '@context/ThemeContext'
import {
	BarChart,
	DarkMode,
	Dashboard,
	ExitToApp,
	LightMode,
	Menu,
	People,
	Settings,
} from '@mui/icons-material'
import {
	Box,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material'
import { useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const menuItems = {
	admin: [
		{ text: 'Дашборд', icon: <Dashboard />, path: '/' },
		{ text: 'Кандидаты', icon: <People />, path: '/candidates' },
		{ text: 'Рекрутеры', icon: <People />, path: '/recruiters' },
		{ text: 'Статистика', icon: <BarChart />, path: '/statistics' },
		{ text: 'Настройки', icon: <Settings />, path: '/settings' },
	],
	user: [
		{ text: 'Дашборд', icon: <Dashboard />, path: '/' },
		{ text: 'Кандидаты', icon: <People />, path: '/candidates' },
	],
}

const Sidebar: React.FC<{
	collapsed: boolean
	setCollapsed: (value: boolean) => void
}> = ({ collapsed, setCollapsed }) => {
	const { toggleTheme, isDarkMode } = useThemeContext()
	const navigate = useNavigate()
	const location = useLocation()

	const auth = useAuth()

	useEffect(() => {
		if (auth) {
			setCollapsed(false) // Принудительно раскрываем меню при логине
		}
	}, [auth])

	if (!auth) return null

	const { role } = auth
	const menu = useMemo(() => menuItems[role] || [], [role])

	const handleLogout = async () => {
		await logout()
		navigate('/login')
	}

	return (
		<Drawer
			variant='permanent'
			sx={{
				width: collapsed ? 80 : 240,
				flexShrink: 0,
				height: '100vh',
				transition: 'width 0.3s ease-in-out',
				'& .MuiDrawer-paper': {
					width: collapsed ? 80 : 240,
					height: '100vh',
					transition: 'width 0.3s ease-in-out',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					alignItems: collapsed ? 'center' : 'flex-start',
					paddingY: 2,
				},
			}}
		>
			{/* Верхняя часть */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: collapsed ? 'center' : 'space-between',
					width: '100%',
					p: 2,
				}}
			>
				{!collapsed && <Typography variant='h6'>RiseUp</Typography>}
				<IconButton onClick={() => setCollapsed(!collapsed)}>
					<Menu />
				</IconButton>
			</Box>

			<List sx={{ flexGrow: 1, width: '100%' }}>
				{menu.map(({ text, icon, path }) => (
					<ListItemButton
						key={text}
						component={Link}
						to={path}
						sx={{
							width: '100%', // ✅ Ссылка на всю ширину
							justifyContent: collapsed ? 'center' : 'flex-start',
							px: 2,
							transition: 'background 0.2s ease-in-out',
							'&:hover': {
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
							},
							backgroundColor:
								location.pathname === path ? 'rgba(0, 0, 0, 0.15)' : 'inherit',
						}}
					>
						<ListItemIcon
							sx={{
								justifyContent: 'center',
								minWidth: collapsed ? 'unset' : 56,
							}}
						>
							{icon}
						</ListItemIcon>
						{!collapsed && <ListItemText primary={text} />}
					</ListItemButton>
				))}
			</List>

			{/* Нижняя часть */}
			<Box sx={{ width: '100%' }}>
				<Divider />

				<List sx={{ width: '100%' }}>
					<ListItemButton
						onClick={toggleTheme}
						sx={{
							width: '100%', // ✅ Кнопка на всю ширину
							justifyContent: collapsed ? 'center' : 'flex-start',
							transition: 'background 0.2s ease-in-out',
							'&:hover': {
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
							},
						}}
					>
						<ListItemIcon
							sx={{
								justifyContent: 'center',
								minWidth: collapsed ? 'unset' : 56,
							}}
						>
							{isDarkMode ? <LightMode /> : <DarkMode />}
						</ListItemIcon>
						{!collapsed && <ListItemText primary='Тема' />}
					</ListItemButton>

					<ListItemButton
						onClick={handleLogout}
						sx={{
							width: '100%', // ✅ Кнопка на всю ширину
							justifyContent: collapsed ? 'center' : 'flex-start',
							transition: 'background 0.2s ease-in-out',
							'&:hover': {
								backgroundColor: 'rgba(0, 0, 0, 0.1)',
							},
						}}
					>
						<ListItemIcon
							sx={{
								justifyContent: 'center',
								minWidth: collapsed ? 'unset' : 56,
							}}
						>
							<ExitToApp />
						</ListItemIcon>
						{!collapsed && <ListItemText primary='Выход' />}
					</ListItemButton>
				</List>
			</Box>
		</Drawer>
	)
}

export default Sidebar
