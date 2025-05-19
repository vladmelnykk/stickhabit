export interface Habit {
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

export interface TodayHabit extends Habit {
  currentDate: { date: number; times: number }
}

export interface WeeklyHabit extends Habit {
  completedDaysThisWeek: number[]
}

export type Theme = 'light' | 'dark' | 'system'
