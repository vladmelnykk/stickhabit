import Header from '@/components/common/Header'
import Icon from '@/components/ui/Icon'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors } from '@/constants/Colors'
import { CONTAINER_PADDING } from '@/constants/global'
import { habitSchema } from '@/db/schema/habits'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useDatabase } from '@/providers/DatabaseProvider'
import { useStore } from '@/store/store'
import { Habit, Theme } from '@/types/global'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { eq } from 'drizzle-orm'
import { Link, router } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ListRenderItemInfo, Pressable, StatusBar, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import ReorderableList, {
  ReorderableListReorderEvent,
  useIsActive,
  useReorderableDrag
} from 'react-native-reorderable-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface ListItemProps {
  id: number
  color: string
  title: string
  theme: Exclude<Theme, 'system'>
}
const ListItem: React.FC<ListItemProps> = React.memo(({ color, id, theme, title }) => {
  const drag = useReorderableDrag()
  const isActive = useIsActive()
  return (
    <View style={styles.containerItem}>
      <Pressable
        style={[
          styles.listItem,
          {
            backgroundColor: color || '#fff',
            borderColor: Colors[theme].accent
          }
        ]}
        onPress={() => {
          router.navigate({ pathname: '/habit/[id]', params: { id: id } })
        }}
        disabled={isActive}
      >
        <ThemedText numberOfLines={1} style={styles.title} type="subtitle" darkColor="#000">
          {title}
        </ThemedText>
        <Pressable onPressIn={drag}>
          <Icon name="menu" color={'#000'} />
        </Pressable>
      </Pressable>
    </View>
  )
})
ListItem.displayName = 'ListItem'

const Page = () => {
  const insets = useSafeAreaInsets()
  const tabBarHeight = useBottomTabBarHeight()
  const theme = useColorScheme()
  const { t } = useTranslation()
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

  const renderItem = ({ item }: ListRenderItemInfo<Habit>) => {
    return <ListItem color={item.color} id={item.id} theme={theme} title={item.title} />
  }

  const onReorder = ({ from, to }: ReorderableListReorderEvent) => {
    const newHabits = [...filterHabits]

    const reorderedHabit = newHabits.splice(from, 1)[0] // remove the item from the original array
    newHabits.splice(to, 0, reorderedHabit)

    setHabits(newHabits)
    updateHabitsOrderInDB(newHabits)
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={Colors[theme].background} />
      <Animated.View style={{ paddingHorizontal: CONTAINER_PADDING }} entering={FadeInUp}>
        <Header title={t('habits.title')} showLogo />
      </Animated.View>
      <Animated.View entering={FadeInDown} style={styles.draggableContainer}>
        <ReorderableList
          keyExtractor={item => 'draggable-' + item.id}
          data={filterHabits}
          ListEmptyComponent={
            <View style={styles.emptyListContainer}>
              <ThemedText type="subtitle">{t('habits.empty')}</ThemedText>
              <Link href={'/habit/add'}>
                <ThemedText type="link">{t('habits.emptyCreate')}</ThemedText>
              </Link>
            </View>
          }
          renderItem={renderItem}
          cellAnimations={{ opacity: 1 }}
          showsVerticalScrollIndicator={false}
          onReorder={onReorder}
          style={styles.draggableContainer}
          contentContainerStyle={{
            paddingTop: CONTAINER_PADDING,
            paddingBottom: tabBarHeight + 10,
            paddingHorizontal: CONTAINER_PADDING
          }}
        />
      </Animated.View>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8
  },
  draggableContainer: {
    flex: 1
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
    flexShrink: 1
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  }
})
