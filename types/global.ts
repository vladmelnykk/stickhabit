import { LANGUAGES } from '@/constants/Language'

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
export type Language = (typeof LANGUAGES)[number]['code']

export type Theme = 'light' | 'dark' | 'system'

export type IconName =
  | 'archive'
  | 'arrow-left'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'clock'
  | 'database'
  | 'edit-3'
  | 'eye'
  | 'grid'
  | 'home'
  | 'info'
  | 'menu'
  | 'minus-circle'
  | 'plus'
  | 'plus-circle'
  | 'settings'
  | 'trash'
  | 'trash-2'
  | 'trending-up'
  | 'x'
  | 'logo'
