import Header from '@/components/common/Header'
import Logo from '@/components/ui/Logo'
import { ThemedText } from '@/components/ui/ThemedText'
import { CONTAINER_PADDING } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useStore } from '@/store/store'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Page = () => {
  const insets = useSafeAreaInsets()
  const tabBarHeight = useBottomTabBarHeight()
  const habits = useStore(state => state.habits)
  const theme = useColorScheme()

  return (
    <ScrollView
      style={[styles.scrollView, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.container, { paddingBottom: tabBarHeight }]}
    >
      <Header title="Statistics" renderLeftItem={() => <Logo />} />
      <ThemedText>Page</ThemedText>
    </ScrollView>
  )
}

export default Page

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  container: { flex: 1, paddingHorizontal: CONTAINER_PADDING }
})
