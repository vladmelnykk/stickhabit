import Header from '@/components/common/Header'
import Icon from '@/components/ui/Icon'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors, DANGER_COLOR } from '@/constants/Colors'
import { CONTAINER_PADDING } from '@/constants/global'
import { habitSchema } from '@/db/schema/habits'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useDatabase } from '@/providers/DatabaseProvider'
import { useStore } from '@/store/store'
import { IconName } from '@/types/global'
import { confirm } from '@/utils/alert'
import { backupDatabase, restoreDatabase } from '@/utils/db'
import { router } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

const Page = () => {
  const insets = useSafeAreaInsets()
  const theme = useColorScheme()
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
    } catch {
      Toast.show({
        type: 'error',
        text1: t('toast.error'),
        text2: t('settings.dataManagement.toast.import.error')
      })
    }
  }

  const managementOptions: {
    title: string
    onPress: () => void
    icon: IconName
    color?: string
  }[] = [
    {
      title: t('settings.dataManagement.export'),
      onPress: exportData,
      icon: 'database'
    },
    {
      title: t('settings.dataManagement.import'),
      onPress: importData,
      icon: 'archive'
    },
    {
      title: t('settings.dataManagement.clear'),
      onPress: deleteAllData,
      icon: 'trash',
      color: DANGER_COLOR
    }
  ]

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title={t('settings.dataManagement.title')}
        leftIcon="arrow-left"
        onLeftPress={() => router.back()}
      />

      <View>
        {managementOptions.map(({ title, onPress, icon, color }) => (
          <Pressable
            onPress={onPress}
            key={title}
            style={({ pressed }) => [styles.itemContainer, { opacity: pressed ? 0.5 : 1 }]}
          >
            <View style={styles.valueContainer}>
              <Icon name={icon} color={color || Colors[theme].text} />
              <ThemedText lightColor={color} darkColor={color} type="subtitle">
                {title}
              </ThemedText>
            </View>
            <Icon name={'chevron-right'} color={color || Colors[theme].text} />
          </Pressable>
        ))}
      </View>
      <ThemedText style={{ textAlign: 'center' }}>
        {t('settings.dataManagement.description')}
      </ThemedText>
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
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    gap: 8
  }
})
