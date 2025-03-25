import Header from '@/components/common/Header'
import ProgressBar from '@/components/common/ProgressBar'
import TodayRoute from '@/components/HomeComponents/TodayRoute/TodayRoute'
import WeeklyRoute from '@/components/HomeComponents/WeeklyRoute/WeeklyRoute'
import RoundPlusButton from '@/components/ui/RoundPlusButton'
import TabView from '@/components/ui/TabView'
import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { CONTAINER_PADDING, WINDOW_WIDTH } from '@/constants/global'
import { habits } from '@/db/schema/habits'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useHabitStore } from '@/store/habitStore'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { router } from 'expo-router'
import React, { useEffect } from 'react'
import { Image, StatusBar, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { db } from '../_layout'

const SecondRoute = React.memo(function SecondRoute() {
  console.log('second route rendered')

  return <View style={[{ flex: 1, backgroundColor: 'white' }]} />
})

// const renderScene = SceneMap({
//   today: TodayRoute,
//   weekly: SecondRoute,
//   overall: SecondRoute
// })

const routes = [
  { key: 'today', title: 'Today' },
  { key: 'weekly', title: 'Weekly' },
  { key: 'overall', title: 'Overall' }
]

// TODO: Bad name for progress interface, use another way to save progress

export default function Home() {
  const tabBarHeight = useBottomTabBarHeight()
  const insets = useSafeAreaInsets()
  const theme = useColorScheme()

  const setHabits = useHabitStore(state => state.setHabits)
  const { data } = useLiveQuery(
    db.select().from(habits)
    // .where(sql`
    //     EXISTS (
    //       SELECT 1 FROM json_each(habits.daysOfWeek)
    //       WHERE json_each.value = ${new Date().getDay()}
    //     )
    //   `)
  )

  const [tabBarIndex, setTabBarIndex] = React.useState(0)
  const [progress, setProgress] = React.useState<CurrentProgress>({
    current: 0,
    goal: 1
  })

  const handleCreateHabitPress = () => {
    router.push('/habit')
  }

  useEffect(() => {
    if (data) {
      setHabits(data)
    }
  }, [data, setHabits])

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'today':
        return <TodayRoute setProgress={setProgress} />
      case 'weekly':
        return <WeeklyRoute />
      case 'overall':
        return <SecondRoute />
      default:
        return null
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={Colors[theme].background} />
      <Animated.View style={styles.verticalOffset} entering={FadeInUp}>
        <Header
          title="Home"
          leftIcon="menu"
          renderLeftIcon={() => (
            <Image
              style={{ width: 38, height: 38 }}
              source={require('../../assets/images/favicon.png')}
            />
          )}
        />
      </Animated.View>
      <Animated.View style={styles.verticalOffset} entering={FadeInDown}>
        <ProgressBar goal={progress.goal} current={progress.current} />
      </Animated.View>

      {/* TODO: RENDER LAZY PLACEHOLDER */}
      {/* <Animated.View entering={FadeInDown} style={{ flex: 1 }}> */}
      <TabView
        commonOptions={{
          labelStyle: { fontFamily: FontFamily.RobotoSemiBold },
          sceneStyle: { paddingHorizontal: CONTAINER_PADDING }
        }}
        pageMargin={CONTAINER_PADDING}
        navigationState={{ index: tabBarIndex, routes }}
        renderScene={renderScene}
        onIndexChange={setTabBarIndex}
        initialLayout={{ width: WINDOW_WIDTH }}
        // lazy={true}
        // renderLazyPlaceholder={() => <ThemedText>Loading...</ThemedText>}
      />
      {/* </Animated.View> */}
      <RoundPlusButton
        style={{
          position: 'absolute',
          bottom: tabBarHeight + 20,
          right: 20
        }}
        onPress={handleCreateHabitPress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 18
  },
  verticalOffset: {
    paddingHorizontal: CONTAINER_PADDING
  }
})
