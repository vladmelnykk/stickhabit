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
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
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
      </GestureHandlerRootView>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({ container: { flex: 1 } })
