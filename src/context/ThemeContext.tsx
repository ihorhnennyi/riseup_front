import { CssBaseline, ThemeProvider } from '@mui/material'
import { createContext, useContext, useMemo, useState } from 'react'
import { darkTheme, lightTheme } from '../theme'

interface ThemeContextType {
	toggleTheme: () => void
	isDarkMode: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(
		localStorage.getItem('theme') === 'dark'
	)

	const toggleTheme = () => {
		setIsDarkMode(prev => {
			const newTheme = !prev
			localStorage.setItem('theme', newTheme ? 'dark' : 'light')
			return newTheme
		})
	}

	const theme = useMemo(
		() => (isDarkMode ? darkTheme : lightTheme),
		[isDarkMode]
	)

	return (
		<ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ThemeContext.Provider>
	)
}

export const useThemeContext = (): ThemeContextType => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error(
			'useThemeContext must be used within a ThemeProviderWrapper'
		)
	}
	return context
}
