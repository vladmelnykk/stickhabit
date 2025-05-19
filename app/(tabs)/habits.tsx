import Header from '@/components/common/Header'
import Icon from '@/components/ui/Icon'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { CONTAINER_PADDING } from '@/constants/global'
import { habitSchema } from '@/db/schema/habits'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useDatabase } from '@/providers/DatabaseProvider'
import { useStore } from '@/store/store'
import { Habit } from '@/types/types'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { eq } from 'drizzle-orm'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, StatusBar, StyleSheet, View } from 'react-native'
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator
} from 'react-native-draggable-flatlist'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Page = () => {
  const insets = useSafeAreaInsets()
  const tabBarHeight = useBottomTabBarHeight()
  const theme = useColorScheme()
  const habits = useStore(state => state.habits)
  const setHabits = useStore(state => state.setHabits)
  const { db } = useDatabase()
  const filterHabits = habits.filter(habit => habit.isArchived === false)

  const updateHabitsOrderInDB = async (habits: Habit[]) => {
    await Promise.all(
      habits.map((habit, index) =>
        db.update(habitSchema).set({ position: index }).where(eq(habitSchema.id, habit.id))
      )
    )
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Habit>) => {
    return (
      <View style={styles.containerItem}>
        <ScaleDecorator activeScale={0.97}>
          <Pressable
            style={({ pressed }) => [
              styles.listItem,
              {
                backgroundColor: item.color || '#fff',
                borderColor: Colors[theme].accent,
                opacity: pressed ? 0.8 : 1
              }
            ]}
            onPress={() => {
              router.navigate({ pathname: '/habit/[id]', params: { id: item.id } })
            }}
            disabled={isActive}
          >
            <ThemedText type="subtitle" darkColor="#000">
              {item.title}
            </ThemedText>
            <Pressable onPressIn={drag}>
              <Icon name="menu" color={'#000'} />
            </Pressable>
          </Pressable>
        </ScaleDecorator>
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={Colors[theme].background} />
      <Animated.View entering={FadeInUp}>
        <Header title="My Habits" showLogo />
      </Animated.View>
      <View style={styles.draggableContainer}>
        <DraggableFlatList
          keyExtractor={(item, index) => index.toString()}
          data={filterHabits}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onDragEnd={({ data }) => {
            setHabits(data)
            updateHabitsOrderInDB(data)
          }}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: tabBarHeight + 10 }}
        />
      </View>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 18,
    paddingHorizontal: CONTAINER_PADDING
  },
  draggableContainer: {
    flex: 1,
    overflow: 'visible'
  },
  listItem: {
    width: '100%',
    padding: 22,
    gap: 4,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  containerItem: {
    marginBottom: 12
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FontFamily.RobotoBold,
    color: '#000'
  }
})
