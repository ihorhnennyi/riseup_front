import { logout } from '@api/authApi'
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
import { Link } from 'react-router-dom'
import { useThemeContext } from '../../context/ThemeContext'

interface SidebarProps {
	role: 'admin' | 'user'
	collapsed: boolean
	setCollapsed: (value: boolean) => void
}

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

const Sidebar: React.FC<SidebarProps> = ({ role, collapsed, setCollapsed }) => {
	const { toggleTheme, isDarkMode } = useThemeContext()
	const sidebarWidth = collapsed ? 80 : 240

	const handleLogout = async () => {
		await logout()
	}

	return (
		<Drawer
			variant='permanent'
			sx={{
				width: sidebarWidth,
				flexShrink: 0,
				overflow: 'hidden',
				height: '100vh',
				transition: 'width 0.3s ease-in-out',
				'& .MuiDrawer-paper': {
					width: sidebarWidth,
					boxSizing: 'border-box',
					display: 'flex',
					flexDirection: 'column',
					height: '100vh',
					overflow: 'hidden',
					alignItems: collapsed ? 'center' : 'flex-start',
					transition: 'width 0.3s ease-in-out',
				},
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: collapsed ? 'center' : 'space-between',
					p: 2,
					width: '100%',
				}}
			>
				{!collapsed && <Typography variant='h6'>RiseUp</Typography>}
				<IconButton onClick={() => setCollapsed(!collapsed)}>
					<Menu />
				</IconButton>
			</Box>

			<Box sx={{ flexGrow: 1, width: '100%' }}>
				<List>
					{menuItems[role].map(({ text, icon, path }) => (
						<ListItemButton
							key={text}
							component={Link}
							to={path}
							sx={{
								justifyContent: collapsed ? 'center' : 'flex-start',
								px: 2,
								width: '100%',
								transition: 'padding 0.3s ease-in-out',
							}}
						>
							<ListItemIcon sx={{ minWidth: 40, justifyContent: 'center' }}>
								{icon}
							</ListItemIcon>
							{!collapsed && <ListItemText primary={text} sx={{ ml: 2 }} />}
						</ListItemButton>
					))}
				</List>
			</Box>

			<Box sx={{ width: '100%' }}>
				<Divider />
				<List sx={{ display: 'flex', flexDirection: 'column', pb: 2 }}>
					<ListItemButton
						onClick={toggleTheme}
						sx={{
							justifyContent: collapsed ? 'center' : 'flex-start',
							px: 2,
							width: '100%',
						}}
					>
						<ListItemIcon sx={{ minWidth: 40, justifyContent: 'center' }}>
							{isDarkMode ? <LightMode /> : <DarkMode />}
						</ListItemIcon>
						{!collapsed && <ListItemText primary='Тема' sx={{ ml: 2 }} />}
					</ListItemButton>

					<ListItemButton onClick={handleLogout}>
						<ListItemIcon sx={{ minWidth: 40, justifyContent: 'center' }}>
							<ExitToApp />
						</ListItemIcon>
						{!collapsed && <ListItemText primary='Выход' sx={{ ml: 2 }} />}
					</ListItemButton>
				</List>
			</Box>
		</Drawer>
	)
}

export default Sidebar
