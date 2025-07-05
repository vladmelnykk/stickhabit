import { Language } from '@/constants/Language'
import { Habit } from '@/types/types'
import {
  addDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  format,
  getYear,
  isSameDay,
  isSameMonth,
  Locale,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths
} from 'date-fns'
import { enUS, uk } from 'date-fns/locale'
import { barDataItem } from 'react-native-gifted-charts'
import { ChartRange } from '../constants/ChartRange'

const localeMap: Record<Language, Locale> = {
  en: enUS,
  uk: uk
}

function calculateStatistics(habits: Habit[]) {
  const minCreatedAt = Math.min(...habits.map(habit => habit.createdAt))
  const startDate = new Date(minCreatedAt)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date()
  endDate.setHours(0, 0, 0, 0)

  let totalScheduled = 0
  let totalCompleted = 0
  const perfectDays: { date: Date; perfect: boolean }[] = []

  function isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  }

  for (let d = new Date(startDate); d.getTime() <= endDate.getTime(); d.setDate(d.getDate() + 1)) {
    let dayScheduled = 0
    let dayCompleted = 0
    const dayTimestamp = d.getTime()
    const currentWeekDay = d.getDay()

    habits.forEach(habit => {
      const habitCreatedAt = habit.createdAt
      const habitArchivedAt = habit.archivedAt ?? Infinity

      if (habitCreatedAt > dayTimestamp + 24 * 60 * 60 * 1000 - 1) {
        return
      }

      if (habitArchivedAt < dayTimestamp) {
        return
      }
      if (!habit.daysOfWeek.includes(currentWeekDay)) {
        return
      }

      dayScheduled += 1

      const completedEntry = habit.completedDates.find(entry => {
        const entryDate = new Date(entry.date)
        return isSameDay(entryDate, d)
      })

      if (completedEntry && completedEntry.times === habit.timesPerDay) {
        dayCompleted += 1
      }
    })

    totalScheduled += dayScheduled
    totalCompleted += dayCompleted

    const perfect = dayScheduled > 0 && dayCompleted === dayScheduled
    perfectDays.push({ date: new Date(d), perfect })

    // if (perfect) {
    //   currentStreak++
    // }
  }

  // const todayIsPerfect = perfectDays[perfectDays.length - 1]?.perfect

  // if (!todayIsPerfect) {
  //   currentStreak = perfectDays.filter(day => day.perfect).length
  // }

  const totalPerfectDays = perfectDays.filter(day => day.perfect).length
  // console.log(perfectDays)

  let currentStreak = 0

  for (let i = perfectDays.length - 1; i >= 0; i--) {
    const { date, perfect } = perfectDays[i]

    const weekday = date.getDay()
    const dayHasHabits = habits.some(habit => {
      const isScheduled = habit.daysOfWeek.includes(weekday)
      const isCreatedBefore = habit.createdAt <= date.getTime() + 24 * 60 * 60 * 1000 - 1
      return isScheduled && isCreatedBefore
    })

    const isToday = isSameDay(date, new Date())

    if (dayHasHabits && !perfect && !isToday) break
    if (dayHasHabits && perfect) currentStreak++
  }
  const completionRate = totalScheduled > 0 ? (totalCompleted / totalScheduled) * 100 : 0

  return {
    currentStreak,
    habitsCompleted: totalCompleted,
    completionRate,
    totalPerfectDays
  }
}

function calculateCompletedHabitsForChart(
  habits: Habit[],
  selectedRangeIndex: number,
  lng: Language
) {
  const now = new Date()
  const data: (barDataItem & Required<Pick<barDataItem, 'value'>>)[] = []
  const locale = localeMap[lng] || localeMap.en

  const getCompletedCountForDate = (date: Date) => {
    const weekday = date.getDay()
    const currentDayStart = date.getTime()

    return habits.reduce((count, habit) => {
      const isScheduled = habit.daysOfWeek.includes(weekday)
      const habitCreatedDayStart = startOfDay(habit.createdAt).getTime()

      const isCreatedBefore = habitCreatedDayStart <= currentDayStart
      const isArchivedAfter =
        habit.archivedAt === null || startOfDay(habit.archivedAt).getTime() >= currentDayStart

      if (!isScheduled || !isCreatedBefore || !isArchivedAfter) return count

      const isCompleted = habit.completedDates.some(
        entry => isSameDay(new Date(entry.date), date) && entry.times === habit.timesPerDay
      )

      return isCompleted ? count + 1 : count
    }, 0)
  }

  if (ChartRange[selectedRangeIndex] === 'thisWeek') {
    const start = startOfWeek(now, { weekStartsOn: 1 })
    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i)
      const label = format(day, 'ccc', { locale })
      const value = getCompletedCountForDate(day)
      data.push({ label, value })
    }
  }

  if (ChartRange[selectedRangeIndex] === 'thisMonth') {
    const start = startOfMonth(now)
    const end = now
    const days = eachDayOfInterval({ start, end })

    days.forEach(day => {
      const label = format(day, 'd', { locale }) // Just the day number
      const value = getCompletedCountForDate(day)
      data.push({ label, value })
    })
  }

  if (ChartRange[selectedRangeIndex] === 'lastMonth') {
    const lastMonth = subMonths(now, 1)
    const start = startOfMonth(lastMonth)
    const end = endOfMonth(lastMonth)
    const days = eachDayOfInterval({ start, end })

    days.forEach(day => {
      const label = format(day, 'd', { locale })
      const value = getCompletedCountForDate(day)
      data.push({ label, value })
    })
  }

  if (ChartRange[selectedRangeIndex] === 'last6Months') {
    const start = subMonths(now, 5)
    const end = now
    const months = eachMonthOfInterval({ start, end })

    months.forEach(monthDate => {
      const label = format(monthDate, 'MMM', { locale })
      const start = startOfMonth(monthDate)
      const end = endOfMonth(monthDate)
      const days = eachDayOfInterval({ start, end })

      const total = days.reduce((sum, day) => sum + getCompletedCountForDate(day), 0)
      data.push({ label, value: total })
    })
  }

  if (ChartRange[selectedRangeIndex] === 'thisYear') {
    const amountOfMonths = now.getMonth() + 1

    for (let month = 0; month < amountOfMonths; month++) {
      const start = new Date(getYear(now), month, 1)
      const end = endOfMonth(start)
      const days = eachDayOfInterval({ start, end })

      const total = days.reduce((sum, day) => sum + getCompletedCountForDate(day), 0)
      const label = format(start, 'MMM', { locale })
      data.push({ label, value: total })
    }
  }

  if (ChartRange[selectedRangeIndex] === 'lastYear') {
    const lastYear = getYear(now) - 1
    for (let month = 0; month < 12; month++) {
      const start = new Date(lastYear, month, 1)
      const end = endOfMonth(start)
      const days = eachDayOfInterval({ start, end })

      const total = days.reduce((sum, day) => sum + getCompletedCountForDate(day), 0)
      const label = format(start, 'MMM', { locale })
      data.push({ label, value: total })
    }
  }

  if (ChartRange[selectedRangeIndex] === 'allTime') {
    const years = new Set<number>()
    habits.forEach(habit => {
      habit.completedDates.forEach(entry => {
        years.add(new Date(entry.date).getFullYear())
      })
    })

    Array.from(years)
      .sort((a, b) => b - a)
      .forEach(year => {
        const days = habits.flatMap(habit =>
          habit.completedDates.filter(
            entry =>
              new Date(entry.date).getFullYear() === year && entry.times === habit.timesPerDay
          )
        )

        data.push({ label: String(year), value: days.length })
      })
  }
  const maxValue = Math.max(...data.map(item => item.value))

  return {
    data,
    maxValue
  }
}

function calculateCompletionRateForChart(
  habits: Habit[],
  selectedRangeIndex: number,
  lng: Language
) {
  const now = new Date()
  const data: (barDataItem & Required<Pick<barDataItem, 'value'>>)[] = []
  const locale = localeMap[lng] || localeMap.en

  const getRelevantHabitsForDay = (date: Date) => {
    const weekday = date.getDay()
    const currentDayStart = startOfDay(date).getTime()

    return habits.filter(habit => {
      const createdAtStart = startOfDay(habit.createdAt).getTime()

      const isCreatedBefore = createdAtStart <= currentDayStart
      const isArchivedAfter =
        habit.archivedAt === null || startOfDay(habit.archivedAt).getTime() >= currentDayStart

      return habit.daysOfWeek.includes(weekday) && isCreatedBefore && isArchivedAfter
    })
  }

  const getRateForDate = (date: Date): number => {
    const relevantHabits = getRelevantHabitsForDay(date)
    if (relevantHabits.length === 0) return 0

    const completedCount = relevantHabits.reduce((count, habit) => {
      const isCompleted = habit.completedDates.some(
        entry => isSameDay(new Date(entry.date), date) && entry.times === habit.timesPerDay
      )
      return isCompleted ? count + 1 : count
    }, 0)

    return (completedCount / relevantHabits.length) * 100
  }

  const addAverageRateForDays = (label: string, days: Date[]) => {
    const validDays = days.filter(day => getRelevantHabitsForDay(day).length > 0)
    const rates = validDays.map(getRateForDate)
    const avgRate = rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : 0
    data.push({ label, value: avgRate })
  }

  const range = ChartRange[selectedRangeIndex]

  // if (range === 'Today') {
  //   data.push({ label: 'Today', value: getRateForDate(now) })
  // }

  if (range === 'thisWeek') {
    const start = startOfWeek(now, { weekStartsOn: 1 })
    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i)
      data.push({ label: format(day, 'ccc', { locale }), value: getRateForDate(day) })
    }
  }

  if (range === 'thisMonth' || range === 'lastMonth') {
    const month = range === 'thisMonth' ? now : subMonths(now, 1)
    const days = eachDayOfInterval({
      start: startOfMonth(month),
      end: isSameMonth(month, now) ? now : endOfMonth(month)
    })

    days.forEach(day => {
      data.push({ label: format(day, 'd', { locale }), value: getRateForDate(day) })
    })
  }

  if (range === 'last6Months') {
    const months = eachMonthOfInterval({ start: subMonths(now, 5), end: now })
    months.forEach(monthDate => {
      const isCurrentMonth = isSameMonth(monthDate, now)
      const end = isCurrentMonth ? now : endOfMonth(monthDate)
      const days = eachDayOfInterval({ start: startOfMonth(monthDate), end })
      addAverageRateForDays(format(monthDate, 'MMM', { locale }), days)
    })
  }

  if (range === 'thisYear' || range === 'lastYear') {
    const year = range === 'thisYear' ? getYear(now) : getYear(now) - 1

    const amountOfMonths = year === getYear(now) ? now.getMonth() + 1 : 12

    for (let month = 0; month < amountOfMonths; month++) {
      const start = new Date(year, month, 1)
      const end = year === getYear(now) && month === now.getMonth() ? now : endOfMonth(start)
      const days = eachDayOfInterval({ start, end })
      addAverageRateForDays(format(start, 'MMM', { locale }), days)
    }
  }

  if (range === 'allTime') {
    const years = new Set<number>()
    habits.forEach(habit =>
      habit.completedDates.forEach(entry => years.add(new Date(entry.date).getFullYear()))
    )

    Array.from(years)
      .sort((a, b) => b - a)
      .forEach(year => {
        const start = new Date(year, 0, 1)
        const end = year === now.getFullYear() ? now : new Date(year, 11, 31)
        const days = eachDayOfInterval({ start, end })
        addAverageRateForDays(String(year), days)
      })
  }

  const maxValue = Math.max(...data.map(item => item.value))
  return { data, maxValue }
}

export { calculateCompletedHabitsForChart, calculateCompletionRateForChart, calculateStatistics }
