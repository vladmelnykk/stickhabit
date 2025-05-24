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
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

const Page = () => {
  const insets = useSafeAreaInsets()
  const setHabits = useStore(state => state.setHabits)
  const { db, sqlite, refreshDatabase } = useDatabase()
  const { t } = useTranslation()
  const deleteAllData = async () => {
    const onConfirm = async () => {
      try {
        await db.delete(habitSchema)
        setHabits([])
        Toast.show({
          type: 'success',
          text1: t('toast.success'),
          text2: t('settings.dataManagement.toast.clear.success')
        })
        router.replace('/settings')
      } catch {
        Toast.show({
          type: 'error',
          text1: t('toast.error'),
          text2: t('settings.dataManagement.toast.clear.error')
        })
      }
    }

    confirm(
      t('settings.dataManagement.clear'),
      t('settings.dataManagement.toast.clear.confirm'),
      t('settings.dataManagement.toast.clear.confirmClear'),
      t('toast.cancel'),
      onConfirm
    )
  }

  const exportData = async () => {
    try {
      await backupDatabase(sqlite, 'backup')
    } catch {
      Toast.show({
        type: 'error',
        text1: t('toast.error'),
        text2: t('settings.dataManagement.toast.export.error')
      })
    }
  }

  const importData = async () => {
    try {
      const isSqlite = await restoreDatabase(sqlite)

      if (!isSqlite) {
        Toast.show({
          type: 'error',
          text1: t('toast.error'),
          text2: t('settings.dataManagement.toast.import.invalidFile')
        })
        return
      }

      await refreshDatabase()
      Toast.show({
        type: 'success',
        text1: t('toast.success'),
        text2: t('settings.dataManagement.toast.import.success')
      })
    } catch (err) {
      console.log(err)
      Toast.show({
        type: 'error',
        text1: t('toast.error'),
        text2: t('settings.dataManagement.toast.import.error')
      })
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title={t('settings.dataManagement.title')}
        leftIcon="arrow-left"
        onLeftPress={() => router.back()}
      />

      <View style={styles.buttonContainer}>
        <ThemedButton title={t('settings.dataManagement.export')} primary onPress={exportData} />

        <ThemedButton title={t('settings.dataManagement.import')} primary onPress={importData} />

        <ThemedButton
          title={t('settings.dataManagement.clear')}
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
