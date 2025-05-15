import * as Notifications from 'expo-notifications'

async function scheduleHabitNotification(
  title: string,
  body: string,
  time: Date,
  daysOfWeek: number[]
) {
  const ids: string[] = []

  for (const day of daysOfWeek) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default'
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: day + 1,
        hour: time.getHours(),
        minute: time.getMinutes()
      }
    })

    if (id) {
      ids.push(id)
    }
  }

  return ids
}

async function cancelAllHabitNotifications(notificationIds: string[]) {
  for (const id of notificationIds) {
    await Notifications.cancelScheduledNotificationAsync(id)
  }
}

async function refreshHabitNotifications({
  notificationIdsToCancel,
  reminders,
  title,
  daysOfWeek
}: {
  notificationIdsToCancel: string[]
  reminders: Date[]
  title: string
  daysOfWeek: number[]
}): Promise<string[]> {
  const newNotificationIds: string[] = []

  await cancelAllHabitNotifications(notificationIdsToCancel)

  for (const reminder of reminders) {
    const ids = await scheduleHabitNotification(
      `Time for «${title}»`,
      'Stay consistent with your habit!',
      reminder,
      daysOfWeek
    )
    newNotificationIds.push(...ids)
  }

  return newNotificationIds
}

export { cancelAllHabitNotifications, refreshHabitNotifications, scheduleHabitNotification }
