import { Brightness4, Brightness7 } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useThemeContext } from '../../context/ThemeContext'

const ThemeToggleButton = () => {
	const { toggleTheme, isDarkMode } = useThemeContext()

	return (
		<IconButton onClick={toggleTheme} color='inherit'>
			{isDarkMode ? <Brightness7 /> : <Brightness4 />}
		</IconButton>
	)
}

export default ThemeToggleButton
