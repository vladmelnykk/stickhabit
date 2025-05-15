interface Habit {
  id: number
  title: string
  color: string
  timesPerDay: number
  daysOfWeek: number[]
  completedDates: { date: number; times: number }[]
  createdAt: number
  notificationTime: number[]
  notificationIds: string[]
  position: number
  isArchived: boolean
  archivedAt: number | null
}

interface TodayHabit extends Habit {
  currentDate: { date: number; times: number }
}

interface WeeklyHabit extends Habit {
  completedDaysThisWeek: number[]
}

type Theme = 'light' | 'dark' | 'system'
