import Header from '@/components/common/Header'
import ProgressBar from '@/components/common/ProgressBar'
import TodayRoute from '@/components/HomeComponents/TodayRoute'
import RoundPlusButton from '@/components/ui/RoundPlusButton'
import TabView from '@/components/ui/TabView'
import { Colors } from '@/constants/Colors'
import { CONTAINER_PADDING } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Image, StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SceneMap } from 'react-native-tab-view'

const SecondRoute = () => <View style={[{ flex: 1, backgroundColor: 'white' }]} />

const renderScene = SceneMap({
  today: TodayRoute,
  weekly: SecondRoute,
  overall: SecondRoute
})

const routes = [
  { key: 'today', title: 'Today' },
  { key: 'weekly', title: 'Weekly' },
  { key: 'overall', title: 'Overall' }
]

export default function Home() {
  const { width } = useWindowDimensions()
  const tabBarHeight = useBottomTabBarHeight()
  const insets = useSafeAreaInsets()

  const [tabBarIndex, setTabBarIndex] = React.useState(0)
  const theme = useColorScheme()
  const [currentDate, setCurrentDate] = useState(new Date())

  const handleCreateHabitPress = () => {
    router.push('/habit')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={Colors[theme].background} />
      <Animated.View entering={FadeInUp}>
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
      <Animated.View entering={FadeInDown}>
        <ProgressBar currentDate={currentDate} />
      </Animated.View>

      {/* TODO: RENDER LAZY PLACEHOLDER */}
      <Animated.View entering={FadeInDown} style={{ flex: 1 }}>
        <TabView
          navigationState={{ index: tabBarIndex, routes }}
          renderScene={renderScene}
          onIndexChange={setTabBarIndex}
          initialLayout={{ width: width - CONTAINER_PADDING * 2 }}
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
    gap: 18,
    paddingHorizontal: CONTAINER_PADDING
  }
})
