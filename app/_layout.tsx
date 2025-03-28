import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import {
  DefaultTheme,
  DarkTheme as NavigationDarkTheme,
  ThemeProvider
} from '@react-navigation/native'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import * as Notifications from 'expo-notifications'
import { SplashScreen, Stack } from 'expo-router'
import * as SQLite from 'expo-sqlite'
import React, { useEffect, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import migrations from '../drizzle/migrations'

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

async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.getPermissionsAsync()
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync()
    if (newStatus !== 'granted') {
      console.log('Permission for notifications was denied')
      return
    }
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

const expo = SQLite.openDatabaseSync('db.db', { enableChangeListener: true })
export const db = drizzle(expo)

SplashScreen.preventAutoHideAsync()
export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations)
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

  useEffect(() => {
    registerForPushNotificationsAsync()
  }, [])

  useEffect(() => {
    if (success) {
      SplashScreen.hideAsync()
      // ;(async () => {
      //   await db.delete(habits)
      // })()
    }
  }, [success])

  useEffect(() => {
    async function getScheduledNotifications() {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync()
      console.log(scheduled)
    }
    getScheduledNotifications()
  }, [])
  if (!success) {
    console.log('error', error)
    return null
  }

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : LightTheme}>
      <GestureHandlerRootView style={styles.container}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="habit" options={{ headerShown: false }} />
        </Stack>
        <Toast config={toastConfig} visibilityTime={1500} />
      </GestureHandlerRootView>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({ container: { flex: 1 } })
