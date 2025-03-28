import Header from '@/components/common/Header'
import ProgressBar from '@/components/common/ProgressBar'
import OverallRoute from '@/components/HomeComponents/OverallRoute/OverallRoute'
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
import React, { useCallback, useEffect } from 'react'
import { FlatList, Image, StatusBar, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Route, SceneRendererProps } from 'react-native-tab-view'
import { db } from '../_layout'

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

export default function Home() {
  const tabBarHeight = useBottomTabBarHeight()
  const insets = useSafeAreaInsets()
  const theme = useColorScheme()

  const routesRef = React.useRef<{ [key: string]: FlatList | null }>({})

  const setHabits = useHabitStore(state => state.setHabits)

  const { data } = useLiveQuery(db.select().from(habits), [new Date().getDay()])

  const [tabBarIndex, setTabBarIndex] = React.useState(0)
  const [progress, setProgress] = React.useState<number>(0)
  console.log('rendered index route')
  const handleCreateHabitPress = () => {
    router.push('/habit')
  }
  const handleTabPress = (routeKey: string) => {
    if (routesRef.current[routeKey] && routes[tabBarIndex].key === routeKey) {
      routesRef.current[routeKey]?.scrollToOffset({ offset: 0, animated: true })
    }
  }
  const setListRef = useCallback(
    (key: string) => (ref: FlatList | null) => {
      routesRef.current[key] = ref
    },
    []
  )

  useEffect(() => {
    if (data) {
      console.log('new data')

      setHabits(data)
    }
  }, [data, setHabits])

  const renderScene = ({ route }: SceneRendererProps & { route: Route }) => {
    switch (route.key) {
      case 'today':
        return <TodayRoute route={route.key} setProgress={setProgress} setListRef={setListRef} />
      case 'weekly':
        return <WeeklyRoute route={route.key} setListRef={setListRef} />
      case 'overall':
        return <OverallRoute route={route.key} setListRef={setListRef} />
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
        <ProgressBar progress={progress} />
      </Animated.View>

      {/* TODO: RENDER LAZY PLACEHOLDER */}
      <Animated.View entering={FadeInDown} style={{ flex: 1 }}>
        <TabView
          handleTabPress={handleTabPress}
          overScrollMode="never"
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
      </Animated.View>
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
