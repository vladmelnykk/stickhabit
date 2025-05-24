import { type Language } from '@/constants/Language'
import { Habit, Theme } from '@/types/types'
import zustandStorage from '@/utils/zustandStorage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
interface Store {
  /* <-- Common --> */
  theme: Theme
  setTheme: (theme: Theme) => void

  language: Language
  setLanguage: (language: Language) => void

  /* <-- Habits --> */
  habits: Habit[]
  setHabits: (habits: Habit[]) => void
}

export const useStore = create<Store>()(
  persist(
    (set): Store => ({
      /* <-- Common --> */
      theme: 'system',
      setTheme: theme => set({ theme }),

      language: 'en',
      setLanguage: language => set({ language }),

      /* <-- Habits --> */
      habits: [],
      setHabits: habits => set({ habits })
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: state => ({
        theme: state.theme,
        language: state.language
      })
    }
  )
)
