import { resources } from '@/i18n'

export const ChartRange: (keyof typeof resources.en.translation.chartRange)[] = [
  'thisWeek',
  'thisMonth',
  'lastMonth',
  'last6Months',
  'thisYear',
  'lastYear',
  'allTime'
] as const
