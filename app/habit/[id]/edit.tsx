import BottomSheet from '@/components/common/BottomSheet'
import Header from '@/components/common/Header'
import ColorList from '@/components/habit-form/ColorList'
import ColorPicker from '@/components/habit-form/ColorPicker'
import DeleteHabit from '@/components/habit-form/DeleteHabit'
import ReminderControls from '@/components/habit-form/ReminderControls'
import Icon from '@/components/ui/Icon'
import Input from '@/components/ui/Input'
import ThemedButton from '@/components/ui/ThemedButton'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { CONTAINER_PADDING } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useStore } from '@/store/store'
import { archiveHabit, deleteHabit, updateHabit } from '@/utils/habit'
import BottomSheetRN from '@gorhom/bottom-sheet'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

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
  const insets = useSafeAreaInsets()
  const habits = useStore(state => state.habits)

  const numericId = Number(id)
  const habit = useMemo(() => habits.find(h => h.id === numericId), [habits, numericId])

  const bottomSheetRef = React.useRef<BottomSheetRN>(null)
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
    try {
      await archiveHabit(habit)
      Toast.show({
        type: 'info',
        text1: 'Success',
        text2: `Successfully archived ${habit?.title}`
      })
      router.replace('/habits')
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: `Failed to archive habit`
      })
    }
  }

  const handleDeleteAndClear = async () => {
    try {
      deleteHabit(habit)

      Toast.show({
        type: 'info',
        text1: 'Success',
        text2: `Successfully deleted ${habit?.title}`
      })
      router.replace('/habits')
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: `Failed to save habit`
      })
    }
  }

  const renderBottomSheetContent = () => {
    switch (bottomSheetContentType) {
      case 'color':
        return <ColorPicker onPickColor={handleColorSelect} />
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
        ? 'Please enter a habit name'
        : !formData.color
        ? 'Please select a color'
        : null

      if (validationError) {
        Toast.show({ type: 'error', text1: 'Validation Error', text2: validationError })
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
        updateHabit(habit, updatedHabit, isReminderEnabled ? formData.reminders : [])

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Habit updated successfully`
        })
        router.back()
      } catch {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: `Failed to save habit`
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
        title="Habit"
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
              <Icon name="trash" size={24} color="#F75656" />
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
            <ThemedText type="subtitle">Habit Name</ThemedText>
            <Input
              placeholder="Habit Name"
              value={formData.title}
              onChangeText={text => setEditFormData({ ...editFormData, title: text })}
            />
          </View>

          <ThemedText type="subtitle">Color</ThemedText>
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
          <ThemedButton title="Save" style={{}} onPress={handleSave} />
          <ThemedButton disabled={!isDirty} primary={false} title="Reset" onPress={() => reset()} />
        </View>
      </ScrollView>
      <BottomSheet ref={bottomSheetRef}>{renderBottomSheetContent()}</BottomSheet>
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
  }
})
