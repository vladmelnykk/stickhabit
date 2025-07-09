import Header from '@/components/common/Header'
import OverallRoute from '@/components/home/OverallRoute/OverallRoute'
import ProgressBar from '@/components/home/ProgressBar'
import TodayRoute from '@/components/home/TodayRoute/TodayRoute'
import WeeklyRoute from '@/components/home/WeeklyRoute/WeeklyRoute'
import RoundPlusButton from '@/components/ui/RoundPlusButton'
import TabView from '@/components/ui/TabView'
import { FontFamily } from '@/constants/FontFamily'
import { CONTAINER_PADDING, WINDOW_WIDTH } from '@/constants/global'
import { habitSchema } from '@/db/schema/habits'
import migrations from '@/drizzle/migrations'
import { useDatabase } from '@/providers/DatabaseProvider'
import { useStore } from '@/store/store'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { router, SplashScreen } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Route, SceneRendererProps } from 'react-native-tab-view'

export default function Home() {
  const tabBarHeight = useBottomTabBarHeight()
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const routesRef = React.useRef<{ [key: string]: FlatList | ScrollView | null }>({})

  const setHabits = useStore(state => state.setHabits)
  const { db } = useDatabase()

  const { success, error } = useMigrations(db, migrations)

  useEffect(() => {
    if (success && !error) {
      SplashScreen.hideAsync()
    }
  }, [success, error])

  const { data } = useLiveQuery(db.select().from(habitSchema).orderBy(habitSchema.position), [
    new Date().getDay()
  ])

  const [tabBarIndex, setTabBarIndex] = React.useState(0)
  const [progress, setProgress] = React.useState<number>(0)

  const handleCreateHabitPress = () => {
    router.navigate('/habit/add')
  }
  const handleTabPress = (routeKey: string) => {
    const ref = routesRef.current[routeKey]

    if (ref && routes[tabBarIndex].key === routeKey) {
      if ('scrollToOffset' in ref) {
        ref.scrollToOffset({ offset: 0, animated: true })
      } else if ('scrollTo' in ref) {
        ref.scrollTo({ y: 0, animated: true })
      }
    }
  }

  const setListRef = useCallback(
    (key: string) => (ref: FlatList | ScrollView | null) => {
      routesRef.current[key] = ref
    },
    []
  )

  useEffect(() => {
    if (data) {
      setHabits(data)
    }
  }, [data, setHabits])

  const routes = [
    { key: 'today', title: t('home.today') },
    { key: 'weekly', title: t('home.weekly') },
    { key: 'overall', title: t('home.overall') }
  ]

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
      <Animated.View style={styles.verticalOffset} entering={FadeInUp}>
        <Header title={t('home.title')} showLogo />
        <ProgressBar progress={progress} />
      </Animated.View>

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
          lazy={true}
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
