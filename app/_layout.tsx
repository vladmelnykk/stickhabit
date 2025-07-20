import { Colors, DarkTheme, LightTheme } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import '@/i18n'
import { useStore } from '@/store/store'
import { getLocalLanguage, setAppLanguage } from '@/utils/language'
import { ThemeProvider } from '@react-navigation/native'
import * as Notifications from 'expo-notifications'
import { SplashScreen, Stack } from 'expo-router'
import * as SystemUI from 'expo-system-ui'
import React, { useEffect, useMemo } from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
})

const storedLanguage = useStore.getState().language
const isFirstLaunch = !useStore.getState().onBoardingCompleted

const language = isFirstLaunch ? getLocalLanguage() : storedLanguage
setAppLanguage(language)

SplashScreen.preventAutoHideAsync()
export default function RootLayout() {
  const theme = useColorScheme()
  const onBoardingCompleted = useStore(state => state.onBoardingCompleted)
  const toastConfig = useMemo(
    () => ({
      success: (props: any) => (
        <BaseToast
          {...props}
          style={{ backgroundColor: Colors[theme].accent, borderLeftColor: '#15d18e' }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            color: Colors[theme].text,
            fontSize: 16
          }}
          text2Style={{
            color: Colors[theme].text,
            fontSize: 14
          }}
        />
      ),
      error: (props: any) => (
        <ErrorToast
          {...props}
          style={{ backgroundColor: Colors[theme].accent, borderLeftColor: '#ff9898' }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            color: Colors[theme].text,
            fontSize: 16
          }}
          text2Style={{
            color: Colors[theme].text,
            fontSize: 14
          }}
        />
      )
    }),
    [theme]
  )

  SystemUI.setBackgroundColorAsync(Colors[theme].background)
  useEffect(() => {
    if (!onBoardingCompleted) {
      SplashScreen.hideAsync()
    }
  }, [onBoardingCompleted])
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider value={theme === 'dark' ? DarkTheme : LightTheme}>
        <StatusBar
          backgroundColor={Colors[theme].background}
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <Stack screenOptions={{ headerShown: false }}>
          {/* Use protected routes */}
          <Stack.Protected guard={onBoardingCompleted}>
            <Stack.Screen name="(root)" />
          </Stack.Protected>

          <Stack.Protected guard={!onBoardingCompleted}>
            <Stack.Screen name="onboarding" />
          </Stack.Protected>
        </Stack>
        <Toast config={toastConfig} visibilityTime={1500} swipeable={false} />
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({ container: { flex: 1 } })
