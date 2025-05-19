import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import SQLiteProvider from '@/providers/DatabaseProvider'
import {
  DefaultTheme,
  DarkTheme as NavigationDarkTheme,
  ThemeProvider
} from '@react-navigation/native'
import * as Notifications from 'expo-notifications'
import { SplashScreen, Stack } from 'expo-router'
import * as SystemUI from 'expo-system-ui'
import React, { useMemo } from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
const DarkTheme: typeof NavigationDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: Colors.dark.background,
    card: Colors.dark.background,
    primary: Colors.dark.tint,
    text: Colors.dark.text
  }
}

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    card: Colors.light.background,
    primary: Colors.light.tint,
    text: Colors.light.text
  }
}

// TODO: Is it possible to remove this?
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

// Notifications.cancelAllScheduledNotificationsAsync()

SplashScreen.preventAutoHideAsync()
export default function RootLayout() {
  const theme = useColorScheme()
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider value={theme === 'dark' ? DarkTheme : LightTheme}>
        <StatusBar
          backgroundColor={Colors[theme].background}
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <SQLiteProvider>
          <Stack
            screenOptions={{
              headerShown: false
            }}
          />
        </SQLiteProvider>
        {/*         
        // TODO: fix Toast
        @ts-ignore */}
        <Toast config={toastConfig} visibilityTime={1500} swipeable={false} />
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({ container: { flex: 1 } })
