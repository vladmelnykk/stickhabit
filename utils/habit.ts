import { db } from '@/app/_layout'
import { habitSchema } from '@/db/schema/habits'
import { eq } from 'drizzle-orm'
import { cancelAllHabitNotifications, refreshHabitNotifications } from './notification'

async function createHabit(
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

async function archiveHabit(habit: Habit) {
  // Cancel all notifications
  await cancelAllHabitNotifications(habit?.notificationIds || [])

  // Archive habit
  await db
    .update(habitSchema)
    .set({ isArchived: true, archivedAt: new Date().getTime() })
    .where(eq(habitSchema.id, habit.id))
}

async function deleteHabit(habit: Habit) {
  // Cancel all notifications
  await cancelAllHabitNotifications(habit?.notificationIds || [])

  // Delete habit
  await db.delete(habitSchema).where(eq(habitSchema.id, habit.id))
}

async function updateHabit(
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
