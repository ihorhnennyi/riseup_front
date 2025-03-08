import { createTheme, ThemeOptions } from '@mui/material/styles'

const commonComponents: ThemeOptions['components'] = {
	MuiButton: {
		styleOverrides: {
			root: {
				textTransform: 'none',
				borderRadius: '8px',
				fontWeight: 600,
			},
		},
	},
	MuiCard: {
		styleOverrides: {
			root: {
				borderRadius: '12px',
				boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
			},
		},
	},
}

const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#7B61FF',
		},
		background: {
			default: '#F4F7FE',
			paper: '#FFFFFF',
		},
		text: {
			primary: '#1D1D1D',
			secondary: '#6B6F82',
		},
	},
	typography: {
		fontFamily: 'Inter, sans-serif',
	},
	components: commonComponents,
})

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#7B61FF',
		},
		background: {
			default: '#121212',
			paper: '#1E1E2F',
		},
		text: {
			primary: '#FFFFFF',
			secondary: '#A6A7B2',
		},
	},
	typography: {
		fontFamily: 'Inter, sans-serif',
	},
	components: commonComponents,
})

export { darkTheme, lightTheme }
