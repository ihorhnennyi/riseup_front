import { Button, Paper, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { DateCalendar, PickersDay } from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs'
import { useState } from 'react'

const StyledPickersDay = styled(PickersDay)<{
	isInRange?: boolean
	isStart?: boolean
	isEnd?: boolean
}>(({ isInRange, isStart, isEnd, theme }) => ({
	backgroundColor:
		isStart || isEnd
			? theme.palette.primary.main
			: isInRange
			? theme.palette.primary.light
			: 'transparent',
	borderRadius: isStart
		? '50% 0 0 50%'
		: isEnd
		? '0 50% 50% 0'
		: isInRange
		? '0'
		: '50%',
	color: isStart || isEnd ? '#fff' : theme.palette.text.primary,
	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
	},
	transition: 'background-color 0.3s ease-in-out',
}))

const CustomCalendar = ({
	onDateChange,
}: {
	onDateChange: (dates: Dayjs[]) => void
}) => {
	const theme = useTheme()
	const [range, setRange] = useState<{
		start: Dayjs | null
		end: Dayjs | null
	}>({
		start: null,
		end: null,
	})

	const handleSelect = (date: Dayjs | null) => {
		if (!date) return
		setRange(prev => {
			if (!prev.start || prev.end) {
				return { start: date, end: null }
			}
			return {
				start: prev.start,
				end: date.isAfter(prev.start) ? date : prev.start,
			}
		})
	}

	const applyFilter = () => {
		if (range.start && range.end) {
			const dates = []
			let currentDate = range.start
			while (
				currentDate.isBefore(range.end) ||
				currentDate.isSame(range.end, 'day')
			) {
				dates.push(currentDate)
				currentDate = currentDate.add(1, 'day')
			}
			onDateChange(dates)
		}
	}

	const clearSelection = () => {
		setRange({ start: null, end: null })
		onDateChange([])
	}

	return (
		<Paper
			sx={{
				padding: 2,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 2,
				width: 320,
				backgroundColor: theme.palette.background.default,
			}}
		>
			<strong>Выбор дат</strong>
			<DateCalendar
				onChange={handleSelect}
				value={range.end || range.start}
				slotProps={{
					day: (props: any) => {
						const { day, ...other } = props
						const isInRange =
							range.start &&
							range.end &&
							day.isAfter(range.start.subtract(1, 'day')) &&
							day.isBefore(range.end.add(1, 'day'))
						const isStart = range.start && day.isSame(range.start, 'day')
						const isEnd = range.end && day.isSame(range.end, 'day')
						return (
							<StyledPickersDay
								{...other}
								key={day.format('YYYY-MM-DD')}
								day={day}
								isInRange={isInRange}
								isStart={isStart}
								isEnd={isEnd}
								onClick={() => handleSelect(day)}
							/>
						)
					},
				}}
			/>
			<div style={{ display: 'flex', gap: '10px' }}>
				<Button
					variant='contained'
					color='primary'
					onClick={applyFilter}
					disabled={!range.start || !range.end}
				>
					Применить
				</Button>
				<Button variant='outlined' color='secondary' onClick={clearSelection}>
					Очистить
				</Button>
			</div>
		</Paper>
	)
}

export default CustomCalendar
