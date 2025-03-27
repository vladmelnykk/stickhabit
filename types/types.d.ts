interface Habit {
  id: number
  title: string
  color: string
  timesPerDay: number
  daysOfWeek: number[]
  completedDates: { date: number; times: number }[]
  createdAt: number
  notificationTime: number[]
}

interface TodayHabit extends Habit {
  currentDate: { date: number; times: number }
}

interface WeeklyHabit extends Habit {
  completedDaysThisWeek: number[]
}
