import '@/i18n'
import SQLiteProvider from '@/providers/DatabaseProvider'
import { Stack } from 'expo-router'
import React from 'react'

export default function RootLayout() {
  return (
    <SQLiteProvider>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      />
    </SQLiteProvider>
  )
}
