import BottomSheet from '@/components/bottomSheet/BottomSheet'
import BottomSheetHeader from '@/components/bottomSheet/BottomSheetHeader'
import DeleteHabit from '@/components/bottomSheet/DeleteHabit'
import Header from '@/components/common/Header'
import ColorList from '@/components/habit-form/ColorList'
import ReminderControls from '@/components/habit-form/ReminderControls'
import Icon from '@/components/ui/Icon'
import Input from '@/components/ui/Input'
import ThemedButton from '@/components/ui/ThemedButton'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors, DANGER_COLOR } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { CONTAINER_PADDING } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useDatabase } from '@/providers/DatabaseProvider'
import { useStore } from '@/store/store'
import { confirm } from '@/utils/alert'
import { archiveHabit, deleteHabit, updateHabit } from '@/utils/habit'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import React, { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

const ColorPicker = lazy(() => import('@/components/bottomSheet/ColorPicker'))
type BottomSheetContentType = 'color' | 'delete'

type EditFormData = {
  title: string
  color: string | null
  reminders: Date[]
}

const initalData: EditFormData = {
  title: '',
  color: null,
  reminders: []
}

const Page = () => {
  const { id } = useLocalSearchParams()
  const theme = useColorScheme()
  const { db } = useDatabase()
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const habits = useStore(state => state.habits)

  const numericId = Number(id)
  const habit = useMemo(() => habits.find(h => h.id === numericId), [habits, numericId])

  const bottomSheetRef = React.useRef<BottomSheetMethods>(null)
  const [bottomSheetContentType, setBottomSheetContentType] =
    useState<BottomSheetContentType>('color')
  const [editFormData, setEditFormData] = useState<Partial<EditFormData>>({})

  const formData = {
    ...initalData,
    title: habit?.title || '',
    color: habit?.color || null,
    reminders: habit?.notificationTime.map(time => new Date(time)) || [],
    ...editFormData
  }
  const [isReminderEnabled, setIsReminderEnabled] = useState(formData.reminders.length > 0)

  const handleColorSelect = useCallback((color: string | null) => {
    setEditFormData(prev => ({ ...prev, color }))
    bottomSheetRef.current?.close()
  }, [])

  if (!habit) {
    return <Redirect href="/habits" />
  }

  const handleDeleteAndKeep = async () => {
    const onConfirm = async () => {
      try {
        await archiveHabit(db, habit)
        Toast.show({
          type: 'success',
          text1: t('toast.success'),
          text2: t('habit.toast.archive.success', { title: habit.title })
        })
        router.replace('/habits')
      } catch {
        Toast.show({
          type: 'error',
          text1: t('toast.somethingWentWrong'),
          text2: t('habit.toast.archive.error')
        })
      }
    }

    confirm(
      t('habit.edit.archive'),
      t('habit.toast.archive.confirm'),
      t('habit.toast.archive.confirmArchive'),
      t('toast.cancel'),
      onConfirm
    )
  }

  const handleDeleteAndClear = async () => {
    const onConfirm = async () => {
      try {
        deleteHabit(db, habit)
        Toast.show({
          type: 'success',
          text1: t('toast.success'),
          text2: t('habit.toast.delete.success', { title: habit.title })
        })
        router.replace('/habits')
      } catch {
        Toast.show({
          type: 'error',
          text1: t('toast.somethingWentWrong'),
          text2: t('habit.toast.delete.error')
        })
      }
    }

    confirm(
      'Delete Habit',
      t('habit.toast.delete.confirm'),
      t('habit.toast.delete.confirmDelete'),
      t('toast.cancel'),
      onConfirm
    )
  }

  const renderBottomSheetContent = () => {
    switch (bottomSheetContentType) {
      case 'color':
        return (
          <Suspense fallback={null}>
            <ColorPicker onPickColor={handleColorSelect} />
          </Suspense>
        )
      case 'delete':
        return (
          <DeleteHabit
            onDeleteAndKeep={handleDeleteAndKeep}
            onDeleteAndClear={handleDeleteAndClear}
          />
        )
      default:
        return null
    }
  }

  const isDirty =
    formData.title !== habit?.title ||
    formData.color !== habit?.color ||
    formData.reminders.length !== habit?.notificationTime.length ||
    formData.reminders.some((reminder, index) => {
      const habitReminder = new Date(habit?.notificationTime[index])
      return (
        reminder.getHours() !== habitReminder.getHours() ||
        reminder.getMinutes() !== habitReminder.getMinutes()
      )
    })

  const reset = () => {
    setEditFormData({})
  }

  const handleSave = async () => {
    const isReminderChanged = habit.notificationTime.length > 0 && !isReminderEnabled
    if (isDirty || isReminderChanged) {
      // Validate data
      const validationError = !formData.title
        ? t('habit.toast.validation.name')
        : !formData.color
        ? t('habit.toast.validation.color')
        : null

      if (validationError) {
        Toast.show({
          type: 'error',
          text1: t('habit.toast.validation.error'),
          text2: validationError
        })
        return
      }

      try {
        const updatedHabit = {
          title: formData.title,
          color: formData.color!,
          notificationTime: isReminderEnabled
            ? formData.reminders.map(reminder => reminder.getTime())
            : []
        }
        updateHabit(db, habit, updatedHabit, isReminderEnabled ? formData.reminders : [])

        Toast.show({
          type: 'success',
          text1: t('toast.success'),
          text2: t('habit.toast.update.success', { title: updatedHabit.title })
        })
        router.back()
      } catch {
        Toast.show({
          type: 'error',
          text1: t('toast.somethingWentWrong'),
          text2: t('habit.toast.update.error')
        })
      }
    }
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: Colors[theme].background }
      ]}
    >
      <Header
        title={t('habit.edit.title')}
        leftIcon="arrow-left"
        onLeftPress={() => router.back()}
        renderRightItem={() => (
          <View style={styles.rightIcons}>
            <TouchableOpacity
              onPress={() => {
                if (bottomSheetRef.current) {
                  setBottomSheetContentType('delete')
                  bottomSheetRef.current.expand()
                }
              }}
            >
              <Icon name="trash" size={24} color={DANGER_COLOR} />
            </TouchableOpacity>
          </View>
        )}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <View style={styles.sectionContainer}>
            <ThemedText type="subtitle">{t('habit.name')}</ThemedText>
            <Input
              placeholder={t('habit.name')}
              value={formData.title}
              onChangeText={text => setEditFormData({ ...editFormData, title: text })}
            />
          </View>

          <ThemedText type="subtitle">{t('habit.color')}</ThemedText>
          <ColorList
            color={formData.color}
            onColorWheelPress={() => {
              if (bottomSheetRef.current) {
                setBottomSheetContentType('color')
                bottomSheetRef.current.expand()
              }
            }}
            onColorPress={item => {
              if (item === formData.color) {
                setEditFormData({ ...editFormData, color: null })
              } else setEditFormData({ ...editFormData, color: item })
            }}
          />

          <ReminderControls
            reminders={formData.reminders}
            setReminders={reminders => {
              setEditFormData({ ...editFormData, reminders })
            }}
            isReminderEnabled={isReminderEnabled}
            setIsReminderEnabled={setIsReminderEnabled}
          />
        </View>

        <View style={styles.rowContainer}>
          <ThemedButton
            title={t('habit.edit.save')}
            style={styles.bottomButton}
            primary
            onPress={handleSave}
          />
          <ThemedButton
            style={styles.bottomButton}
            disabled={!isDirty}
            title={t('habit.edit.reset')}
            onPress={() => reset()}
          />
        </View>
      </ScrollView>
      <BottomSheet ref={bottomSheetRef}>
        <BottomSheetHeader
          title={t(`bottomSheet.title.${bottomSheetContentType}`)}
          titleStyle={bottomSheetContentType === 'delete' && styles.dangerText}
        />
        {renderBottomSheetContent()}
      </BottomSheet>
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
  scrollView: { flex: 1 },
  scrollContainer: {
    justifyContent: 'space-between',
    flexGrow: 1,
    paddingVertical: 20
  },
  form: {
    gap: 18
  },
  rightIcons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16
  },
  sectionContainer: { gap: 8 },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  },
  list: { flexGrow: 0 },
  listContainer: { gap: 12, flexShrink: 1 },
  listColumnWrapper: { justifyContent: 'space-between' },
  addReminderText: {
    fontSize: 16,
    fontFamily: FontFamily.RobotoLight
  },
  bottomButton: { flex: 1 },
  dangerText: {
    color: DANGER_COLOR
  }
})
