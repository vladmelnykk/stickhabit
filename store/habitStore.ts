import { create } from 'zustand'

interface HabitStore {
  habits: Habit[] | null
  setHabits: (habits: Habit[]) => void
}

export const useHabitStore = create<HabitStore>(set => ({
  habits: null,
  setHabits: habits => set({ habits })
}))
