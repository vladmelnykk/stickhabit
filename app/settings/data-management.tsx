import Header from '@/components/common/Header'
import ThemedButton from '@/components/ui/ThemedButton'
import { DANGER_COLOR } from '@/constants/Colors'
import { CONTAINER_PADDING } from '@/constants/global'
import { habitSchema } from '@/db/schema/habits'
import { useDatabase } from '@/providers/DatabaseProvider'
import { useStore } from '@/store/store'
import { confirm } from '@/utils/alert'
import { backupDatabase, restoreDatabase } from '@/utils/db'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

const Page = () => {
  const insets = useSafeAreaInsets()
  const setHabits = useStore(state => state.setHabits)
  const { db, sqlite, refreshDatabase } = useDatabase()

  const deleteAllData = async () => {
    const onConfirm = async () => {
      try {
        await db.delete(habitSchema)
        setHabits([])
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Successfully deleted all data`
        })
        router.replace('/settings')
      } catch {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: `Failed to delete all data`
        })
      }
    }

    confirm(
      'Delete All Data',
      'Are you sure you want to delete all data? This action cannot be undone.',
      'Delete',
      onConfirm
    )
  }

  const exportData = async () => {
    try {
      await backupDatabase(sqlite, 'backup')
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: `Failed to export data`
      })
    }
  }

  const importData = async () => {
    try {
      const isSqlite = await restoreDatabase(sqlite)

      if (!isSqlite) {
        Toast.show({
          type: 'error',
          text1: 'Invalid file',
          text2: `Please select a valid SQLite file`
        })
        return
      }

      await refreshDatabase()
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Successfully imported data`
      })
    } catch (err) {
      console.log(err)
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: `Failed to import data`
      })
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Data Management" leftIcon="arrow-left" onLeftPress={() => router.back()} />

      <View style={styles.buttonContainer}>
        <ThemedButton title="Export" primary onPress={exportData} />

        <ThemedButton title="Import" primary onPress={importData} />

        <ThemedButton
          title="Delete All"
          primary
          onPress={deleteAllData}
          style={{ backgroundColor: DANGER_COLOR }}
        />
      </View>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    paddingHorizontal: CONTAINER_PADDING
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 50
  }
})
