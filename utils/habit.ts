import { habitSchema } from '@/db/schema/habits'
import { Habit } from '@/types/types'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { cancelAllHabitNotifications, refreshHabitNotifications } from './notification'

async function createHabit(
  db: ReturnType<typeof drizzle>,
  habit: Omit<Habit, 'id' | 'notificationIds' | 'isArchived' | 'archivedAt'>,
  reminders?: Date[]
) {
  //  Schedule notifications
  const newNotificationIds = await refreshHabitNotifications({
    daysOfWeek: habit.daysOfWeek,
    notificationIdsToCancel: [],
    title: habit.title,
    reminders: reminders || []
  })

  await db.insert(habitSchema).values({ ...habit, notificationIds: newNotificationIds })
}

async function archiveHabit(db: ReturnType<typeof drizzle>, habit: Habit) {
  // Cancel all notifications
  await cancelAllHabitNotifications(habit?.notificationIds || [])

  // Archive habit
  await db
    .update(habitSchema)
    .set({ isArchived: true, archivedAt: new Date().getTime() })
    .where(eq(habitSchema.id, habit.id))
}

async function deleteHabit(db: ReturnType<typeof drizzle>, habit: Habit) {
  // Cancel all notifications
  await cancelAllHabitNotifications(habit?.notificationIds || [])

  // Delete habit
  await db.delete(habitSchema).where(eq(habitSchema.id, habit.id))
}

async function updateHabit(
  db: ReturnType<typeof drizzle>,
  habit: Habit,
  updatedHabit: Pick<Habit, 'title' | 'color' | 'notificationTime'>,
  reminders?: Date[]
) {
  // Cancel all notifications and schedule new ones
  const newNotificationIds = await refreshHabitNotifications({
    daysOfWeek: habit.daysOfWeek,
    notificationIdsToCancel: habit.notificationIds,
    title: updatedHabit.title,
    reminders: reminders || []
  })

  // Update habit
  await db
    .update(habitSchema)
    .set({
      ...updatedHabit,
      notificationIds: newNotificationIds
    })
    .where(eq(habitSchema.id, habit.id))
}

export { archiveHabit, createHabit, deleteHabit, updateHabit }
