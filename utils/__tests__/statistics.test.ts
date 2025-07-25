import { ChartRange } from '@/constants/ChartRange'
import { Habit } from '@/types/global'
import {
  calculateCompletedHabitsForChart,
  calculateCompletionRateForChart,
  calculateStatistics
} from '../statistics'

const mockHabit: Habit = {
  id: 1,
  title: 'Habit 1',
  // 0 - Sun, 1 - Mon, 2 - Tue, 3 - Wed, 4 - Thu, 5 - Fri, 6 - Sat
  daysOfWeek: [1, 2, 3],
  completedDates: [],
  //
  // 2025-01-06 is MONDAY
  //
  createdAt: new Date('2025-01-06').getTime(),
  archivedAt: null,
  isArchived: false,
  timesPerDay: 1,
  notificationIds: [],
  notificationTime: [],
  position: 0,
  color: '#000'
}

describe('calculateStatistics', () => {
  it('returns default values for empty habits array', () => {
    const habits: Habit[] = []
    const result = calculateStatistics({ habits })
    expect(result).toEqual({
      currentStreak: 0,
      habitsCompleted: 0,
      completionRate: 0,
      totalPerfectDays: 0
    })
  })

  it('returns correct values for single habit with no completed dates', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: []
      }
    ]
    const result = calculateStatistics({ habits })
    expect(result).toEqual({
      currentStreak: 0,
      habitsCompleted: 0,
      completionRate: 0,
      totalPerfectDays: 0
    })
  })

  it('returns correct values for single habit with completed dates', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2025-01-06').getTime(), times: 1 },
          { date: new Date('2025-01-07').getTime(), times: 1 }
        ]
      }
    ]
    const result = calculateStatistics({ habits, to: new Date('2025-01-07') })

    expect(result).toEqual({
      currentStreak: 2,
      habitsCompleted: 2,
      completionRate: 100,
      totalPerfectDays: 2
    })
  })

  it('returns correct values for multiple habits with completed dates', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2025-01-06').getTime(), times: 1 },
          { date: new Date('2025-01-07').getTime(), times: 1 }
        ]
      },
      {
        ...mockHabit,
        id: 2,
        title: 'Habit 2',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2025-01-07').getTime(), times: 1 },
          { date: new Date('2025-01-08').getTime(), times: 1 }
        ],
        createdAt: new Date('2025-01-07').getTime()
      }
    ]
    const result = calculateStatistics({ habits, to: new Date('2025-01-08') })
    expect(result).toEqual({
      currentStreak: 2,
      habitsCompleted: 4,
      // 4- done habits, 5 - must be done to 2025-01-08
      completionRate: (4 / 5) * 100,
      totalPerfectDays: 2
    })
  })

  it('returns correct values for habits with archived dates', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2025-01-06').getTime(), times: 1 },
          { date: new Date('2025-01-07').getTime(), times: 1 }
        ],
        archivedAt: new Date('2025-01-07').getTime()
      }
    ]
    const result = calculateStatistics({ habits, to: new Date('2025-01-10') })
    expect(result).toEqual({
      currentStreak: 0,
      habitsCompleted: 2,
      completionRate: 100,
      totalPerfectDays: 2
    })
  })

  it('returns correct values for habits with different days of the week', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2025-01-06').getTime(), times: 1 },
          { date: new Date('2025-01-07').getTime(), times: 1 }
        ]
      },
      {
        ...mockHabit,
        id: 2,
        title: 'Habit 2',
        daysOfWeek: [4, 5, 6],
        completedDates: [
          { date: new Date('2025-01-09').getTime(), times: 1 },
          { date: new Date('2025-01-10').getTime(), times: 1 }
        ],
        createdAt: new Date('2025-01-09').getTime()
      }
    ]
    const result = calculateStatistics({ habits, to: new Date('2025-01-10') })
    expect(result).toEqual({
      currentStreak: 2,
      habitsCompleted: 4,
      completionRate: (4 / 5) * 100,
      totalPerfectDays: 4
    })
  })

  it("returns correct values for edge case: today's date is not perfect", () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2025-01-06').getTime(), times: 1 },
          { date: new Date('2025-01-07').getTime(), times: 1 }
        ]
      }
    ]
    const result = calculateStatistics({ habits, to: new Date('2025-01-08') })
    expect(result).toEqual({
      currentStreak: 2,
      habitsCompleted: 2,
      completionRate: (2 / 3) * 100,
      totalPerfectDays: 2
    })
  })

  it("returns correct values for edge case: today's date is perfect", () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2025-01-06').getTime(), times: 1 },
          { date: new Date('2025-01-07').getTime(), times: 1 },
          { date: new Date('2025-01-08').getTime(), times: 1 }
        ]
      }
    ]
    const result = calculateStatistics({ habits, to: new Date('2025-01-08') })
    expect(result).toEqual({
      currentStreak: 3,
      habitsCompleted: 3,
      completionRate: 100,
      totalPerfectDays: 3
    })
  })
})

describe('calculateCompletedHabitsForChart', () => {
  it('returns empty data with empty habits array', () => {
    const habits: Habit[] = []
    const result = calculateCompletedHabitsForChart(habits, ChartRange.indexOf('thisWeek'), 'en')
    expect(result.data.length).toBe(7)
    expect(result.maxValue).toBe(0)
  })

  it('returns data for thisWeek chart range', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2025-01-06').getTime(), times: 1 },
          { date: new Date('2025-01-07').getTime(), times: 1 }
        ]
      }
    ]
    const result = calculateCompletedHabitsForChart(
      habits,
      ChartRange.indexOf('thisWeek'),
      'en',
      new Date('2025-01-08')
    )
    expect(result.data.length).toBe(7)
    expect(result.maxValue).toBe(1)
  })

  it('returns data for thisMonth chart range', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2025-01-06').getTime(), times: 1 },
          { date: new Date('2025-01-07').getTime(), times: 1 }
        ]
      }
    ]
    const result = calculateCompletedHabitsForChart(
      habits,
      ChartRange.indexOf('thisMonth'),
      'en',
      new Date('2025-01-08')
    )
    expect(result.data.length).toBe(3)
    expect(result.maxValue).toBe(1)
  })

  it('returns data for lastMonth chart range', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2025-01-06').getTime(), times: 2 },
          { date: new Date('2025-01-07').getTime(), times: 2 }
        ],
        timesPerDay: 2
      }
    ]
    const result = calculateCompletedHabitsForChart(
      habits,
      ChartRange.indexOf('lastMonth'),
      'en',
      new Date('2025-02-08')
    )
    expect(result.data.length).toBe(2)
    expect(result.maxValue).toBe(1)
  })

  it('returns data for last6Months chart range', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2025-01-06').getTime(), times: 2 },
          { date: new Date('2025-01-07').getTime(), times: 2 }
        ],
        timesPerDay: 2
      }
    ]
    const result = calculateCompletedHabitsForChart(
      habits,
      ChartRange.indexOf('last6Months'),
      'en',
      new Date('2025-02-08')
    )
    expect(result.data.length).toBe(6)
    expect(result.maxValue).toBe(2)
  })

  it('returns data for thisYear chart range', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2024-11-04').getTime(), times: 2 },
          { date: new Date('2024-11-05').getTime(), times: 2 }
        ],
        timesPerDay: 2,
        createdAt: new Date('2024-11-04').getTime()
      }
    ]
    const result = calculateCompletedHabitsForChart(
      habits,
      ChartRange.indexOf('thisYear'),
      'en',
      new Date('2024-11-05')
    )

    expect(result.data.length).toBe(11)
    expect(result.maxValue).toBe(2)
  })

  it('returns data for lastYear chart range', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2024-12-09').getTime(), times: 2 },
          { date: new Date('2024-12-10').getTime(), times: 2 }
        ],
        timesPerDay: 2,
        createdAt: new Date('2024-12-09').getTime()
      }
    ]
    const result = calculateCompletedHabitsForChart(
      habits,
      ChartRange.indexOf('lastYear'),
      'en',
      new Date('2025-01-06')
    )

    expect(result.data.length).toBe(12)
    expect(result.maxValue).toBe(2)
  })

  it('returns data for allTime chart range', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        id: 1,
        title: 'Habit 1',
        daysOfWeek: [1, 2, 3],
        completedDates: [
          { date: new Date('2024-12-09').getTime(), times: 2 },
          { date: new Date('2024-12-10').getTime(), times: 2 }
        ],
        timesPerDay: 2,
        createdAt: new Date('2024-12-09').getTime()
      }
    ]
    const result = calculateCompletedHabitsForChart(
      habits,
      ChartRange.indexOf('allTime'),
      'en',
      new Date('2025-01-06')
    )

    expect(result.data.length).toBe(1)
    expect(result.maxValue).toBe(2)
  })
})

describe('calculateCompletionRateForChart', () => {
  it('returns 0 rate for empty habits array', () => {
    const result = calculateCompletionRateForChart([], ChartRange.indexOf('thisWeek'), 'en')
    expect(result.data.length).toBe(7)
    result.data.forEach(item => expect(item.value).toBe(0))
    expect(result.maxValue).toBe(0)
  })

  it('calculates rates correctly for thisWeek', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        completedDates: [
          { date: new Date('2025-01-06').getTime(), times: 1 }, // Monday
          { date: new Date('2025-01-07').getTime(), times: 1 } // Tuesday
        ]
      }
    ]
    const result = calculateCompletionRateForChart(
      habits,
      ChartRange.indexOf('thisWeek'),
      'en',
      new Date('2025-01-08')
    )
    expect(result.data.length).toBe(7)
    expect(result.maxValue).toBeGreaterThan(0)
  })

  it('calculates day-based rates for thisMonth', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        completedDates: [{ date: new Date('2025-01-06').getTime(), times: 1 }]
      }
    ]
    const result = calculateCompletionRateForChart(
      habits,
      ChartRange.indexOf('thisMonth'),
      'en',
      new Date('2025-01-08')
    )
    expect(result.data.length).toBe(8)
    expect(result.maxValue).toBeGreaterThan(0)
  })

  it('calculates day-based rates for lastMonth', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        completedDates: [{ date: new Date('2024-12-09').getTime(), times: 1 }],
        createdAt: new Date('2024-12-09').getTime()
      }
    ]
    const result = calculateCompletionRateForChart(
      habits,
      ChartRange.indexOf('lastMonth'),
      'en',
      new Date('2025-01-08')
    )
    expect(result.data.length).toBeGreaterThan(0)
    console.log(result.maxValue)

    expect(result.maxValue).toBeGreaterThan(0)
  })

  it('returns average month rates for last6Months', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        completedDates: [
          { date: new Date('2024-09-05').getTime(), times: 1 },
          { date: new Date('2024-10-10').getTime(), times: 1 },
          { date: new Date('2024-11-20').getTime(), times: 1 },
          { date: new Date('2025-01-05').getTime(), times: 1 }
        ],
        createdAt: new Date('2024-09-05').getTime()
      }
    ]
    const result = calculateCompletionRateForChart(
      habits,
      ChartRange.indexOf('last6Months'),
      'en',
      new Date('2025-01-08')
    )
    expect(result.data.length).toBe(6)
    expect(result.maxValue).toBeGreaterThan(0)
  })

  it('returns average month rates for thisYear', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        completedDates: [
          { date: new Date('2025-01-06').getTime(), times: 1 },
          { date: new Date('2025-02-04').getTime(), times: 1 }
        ],
        createdAt: new Date('2025-01-03').getTime()
      }
    ]
    const result = calculateCompletionRateForChart(
      habits,
      ChartRange.indexOf('thisYear'),
      'en',
      new Date('2025-02-08')
    )
    expect(result.data.length).toBe(2)
    expect(result.maxValue).toBeGreaterThan(0)
  })

  it('returns average month rates for lastYear', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        createdAt: new Date('2024-01-01').getTime(),
        completedDates: [
          { date: new Date('2024-03-03').getTime(), times: 1 },
          { date: new Date('2024-12-09').getTime(), times: 1 },
          { date: new Date('2024-12-10').getTime(), times: 1 }
        ]
      }
    ]
    const result = calculateCompletionRateForChart(
      habits,
      ChartRange.indexOf('lastYear'),
      'en',
      new Date('2025-01-08')
    )
    expect(result.data.length).toBe(12)
    expect(result.maxValue).toBeGreaterThan(0)
  })

  it('returns average yearly rates for allTime', () => {
    const habits: Habit[] = [
      {
        ...mockHabit,
        completedDates: [
          { date: new Date('2023-01-01').getTime(), times: 1 },
          { date: new Date('2024-12-09').getTime(), times: 1 },
          { date: new Date('2025-01-06').getTime(), times: 1 }
        ]
      }
    ]
    const result = calculateCompletionRateForChart(
      habits,
      ChartRange.indexOf('allTime'),
      'en',
      new Date('2025-07-01')
    )
    expect(result.data.length).toBeGreaterThanOrEqual(3)
    expect(result.maxValue).toBeGreaterThan(0)
  })
})
