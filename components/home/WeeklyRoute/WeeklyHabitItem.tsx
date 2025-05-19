import HabitOverviewCard from '@/components/common/HabitOverviewCard'
import DayIndicator from '@/components/ui/DayIndicator'
import { WINDOW_WIDTH } from '@/constants/global'
import { WeeklyHabit } from '@/types/types'
import React from 'react'

const DAYS_OF_WEEK = [
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
  { id: 0, label: 'Sun' }
]

const CIRCLE_SIZE = WINDOW_WIDTH / 10

interface WeeklyHabitItemProps {
  habit: WeeklyHabit
}
const WeeklyHabitItem: React.FC<WeeklyHabitItemProps> = ({ habit }) => {
  return (
    <HabitOverviewCard habit={habit}>
      {DAYS_OF_WEEK.map(day => {
        const isCompleted = habit.completedDaysThisWeek.includes(day.id)

        return (
          <DayIndicator
            size={CIRCLE_SIZE}
            key={day.id}
            color={habit.color}
            label={day.label}
            isCompleted={isCompleted}
          />
        )
      })}
    </HabitOverviewCard>
  )
}

export default WeeklyHabitItem
// export default React.memo(
//   WeeklyHabitItem,
//   (prev, next) =>
//     prev.habit.id === next.habit.id &&
//     prev.habit.completedDaysThisWeek.length === next.habit.completedDaysThisWeek.length
// )
