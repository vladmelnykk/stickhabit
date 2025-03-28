import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import {
  DefaultTheme,
  DarkTheme as NavigationDarkTheme,
  ThemeProvider
} from '@react-navigation/native'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
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
    if (success) {
      SplashScreen.hideAsync()
      // ;(async () => {
      //   await db.delete(habits)
      // })()
    }
  }, [success])

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
