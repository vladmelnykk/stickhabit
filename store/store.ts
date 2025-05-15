import { create } from 'zustand'

interface Store {
  /* <-- Common --> */
  theme: Theme
  setTheme: (theme: Theme) => void

  /* <-- Habits --> */
  habits: Habit[]
  setHabits: (habits: Habit[]) => void
}

export const useStore = create<Store>(set => ({
  /* <-- Common --> */
  theme: 'system',
  setTheme: theme => set({ theme }),

  /* <-- Habits --> */
  habits: [],
  setHabits: habits => set({ habits })
}))
