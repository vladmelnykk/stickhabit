import Icon from '@/components/ui/Icon'
import { Colors } from '@/constants/Colors'
import { TabBarIcons } from '@/constants/TabBarIcons'
import { PlatformPressable } from '@react-navigation/elements'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

export const TAB_BAR_HEIGHT = Platform.OS === 'android' ? 60 : null

export default function TabLayout() {
  const { t } = useTranslation()
  return (
    <Tabs
      screenOptions={({ route, theme }) => {
        return {
          headerShown: false,
          tabBarButton: props => <PlatformPressable {...props} android_ripple={{ radius: 40 }} />,
          tabBarIcon: ({ color }) => {
            const name = TabBarIcons[route.name as keyof typeof TabBarIcons]
            return <Icon color={color} name={name} />
          },
          // TODO: Animated tab bar label

          // tabBarLabel: ({ color, focused }) => {
          //   return (
          //     <Animated.View layout={LinearTransition} style={{ width: focused ? 'auto' : 0 }}>
          //       <Text style={{ color, width: focused ? 'auto' : 0 }}>{route.name}</Text>
          //     </Animated.View>
          //   )
          // },
          // tabBarLabelPosition: 'beside-icon',

          // ------------------------------------

          tabBarInactiveTintColor: Colors[theme.dark ? 'dark' : 'light'].tabIconDefault,
          tabBarStyle: styles.tabBar,
          tabBarBackground: () =>
            Platform.OS === 'android' ? null : (
              <BlurView
                intensity={60}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }}
              />
            )
        }
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('home.title') }} />
      <Tabs.Screen name="statistics" options={{ title: t('statistics.title') }} />
      <Tabs.Screen name="habits" options={{ title: t('habits.title') }} />
      <Tabs.Screen name="settings" options={{ title: t('settings.title') }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: { height: TAB_BAR_HEIGHT, position: 'absolute', elevation: 0 }
})
