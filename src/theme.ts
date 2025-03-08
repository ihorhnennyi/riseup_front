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
			main: '#8053FF', // Чуть ярче и контрастнее
		},
		background: {
			default: '#0D0D19', // Глубокий чёрный с мягким оттенком
			paper: '#17172B', // Чуть светлее для карточек
		},
		text: {
			primary: '#FFFFFF', // Белый текст
			secondary: '#B2B5C3', // Светло-серый, но не тусклый
		},
	},
	typography: {
		fontFamily: 'Inter, sans-serif',
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					borderRadius: '8px',
					fontWeight: 600,
					backgroundColor: '#8053FF',
					color: '#FFFFFF',
					'&:hover': {
						backgroundColor: '#6D44E5',
					},
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: '12px',
					backgroundColor: '#17172B',
					boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					color: '#FFFFFF',
					borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
				},
			},
		},
	},
})

export { darkTheme, lightTheme }
