import Feather from '@expo/vector-icons/Feather'

export const TabBarIcons = {
  index: 'home',
  statistics: 'trending-up',
  habits: 'grid',
  settings: 'settings'
} satisfies Record<string, React.ComponentProps<typeof Feather>['name']>
