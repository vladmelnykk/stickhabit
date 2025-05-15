import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const habitSchema = sqliteTable('habits', {
  id: integer('id').primaryKey({ autoIncrement: true }).notNull(), // Уникальный идентификатор (храним как текст, например, UUID)
  title: text('title').notNull(), // Название привычки
  daysOfWeek: text('daysOfWeek', { mode: 'json' }).$type<number[]>().notNull(), // Дни недели в формате JSON (например, "[1,3,5]")
  timesPerDay: integer('timesPerDay')
    .notNull()
    .default(sql`(json_array())`), // Сколько раз за день нужно выполнять
  color: text('color').notNull(), // Цвет карточки (HEX, например, "#FF5733")
  notificationTime: text('notificationTime', { mode: 'json' })
    .$type<number[]>()
    .notNull()
    .default(sql`(json_array())`), // Время уведомления (опционально, например, "08:00")
  notificationIds: text('notificationIds', { mode: 'json' })
    .$type<string[]>()
    .notNull()
    .default(sql`(json_array())`),
  completedDates: text('completedDates', { mode: 'json' })
    .$type<{ date: number; times: number }[]>()
    .notNull()
    .default(sql`(json_array())`), // Даты выполнения привычки (в формате JSON, например, '[2321312321312, 2321312321312]')
  position: integer('position').notNull(), // Позиция в списке (для сортировки)
  createdAt: integer('createdAt').notNull(), // Дата и время создания
  isArchived: integer('isArchived', { mode: 'boolean' }).$type<boolean>().notNull().default(false),
  archivedAt: integer('archivedAt').$type<number | null>().default(null)
})
