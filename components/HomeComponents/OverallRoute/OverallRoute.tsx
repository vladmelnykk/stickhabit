import { useHabitStore } from '@/store/habitStore'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import OverallHabitItem from './OverallHabitItem'

interface OverallRouteProps {
  setListRef: (key: string) => (ref: FlatList | null) => void
  route: string
}

const OverallRoute: React.FC<OverallRouteProps> = ({ setListRef, route }) => {
  const habits = useHabitStore(state => state.habits)
  const tabBarHeight = useBottomTabBarHeight()

  return (
    <FlatList
      ref={setListRef(route)}
      style={styles.flatList}
      overScrollMode="never"
      bounces={false}
      contentContainerStyle={[styles.flatListContent, { paddingBottom: tabBarHeight * 2 }]}
      data={habits}
      renderItem={({ item }) => <OverallHabitItem habit={item} />}
      showsVerticalScrollIndicator={false}
    />
  )
}

export default React.memo(OverallRoute)

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    marginTop: 12
  },
  flatListContent: {
    gap: 12
  }
})
