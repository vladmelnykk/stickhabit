import HabitOverviewCard from '@/components/common/HabitOverviewCard'
import DayIndicator from '@/components/ui/DayIndicator'
import { WINDOW_WIDTH } from '@/constants/global'
import { WeeklyHabit } from '@/types/types'
import React from 'react'
import { useTranslation } from 'react-i18next'

// 0 - Sun, 1 - Mon, 2 - Tue, 3 - Wed, 4 - Thu, 5 - Fri, 6 - Sat
const DAYS_OF_WEEK = [1, 2, 3, 4, 5, 6, 0] as const

const CIRCLE_SIZE = WINDOW_WIDTH / 10

interface WeeklyHabitItemProps {
  habit: WeeklyHabit
}
const WeeklyHabitItem: React.FC<WeeklyHabitItemProps> = ({ habit }) => {
  const { t } = useTranslation()
  return (
    <HabitOverviewCard habit={habit}>
      {DAYS_OF_WEEK.map(day => {
        const isCompleted = habit.completedDaysThisWeek.includes(day)

        return (
          <DayIndicator
            size={CIRCLE_SIZE}
            key={day}
            color={habit.color}
            label={t(`days.short.${day}`)}
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
