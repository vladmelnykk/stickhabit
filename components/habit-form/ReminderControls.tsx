import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { MAX_REMINDERS } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import { registerForPushNotificationsAsync } from '@/utils/notification'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, Switch, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import Icon from '../ui/Icon'
import { ThemedText } from '../ui/ThemedText'
import DateTimePickerIOS from './DateTimePickerIOS'
import ReminderCard from './ReminderCard'

interface ReminderControlsProps {
  reminders: Date[]
  setReminders: (reminders: Date[]) => void
  isReminderEnabled?: boolean
  setIsReminderEnabled?: React.Dispatch<React.SetStateAction<boolean>>
}
const ReminderControls: React.FC<ReminderControlsProps> = ({
  reminders,
  setReminders,
  isReminderEnabled,
  setIsReminderEnabled
}) => {
  const theme = useColorScheme()
  const { t } = useTranslation()
  const [showIosDatePicker, setShowIosDatePicker] = useState(false)

  const addReminder = (date: Date) => {
    const newTime = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    })

    const isDuplicate = reminders.some(reminder => {
      const existingTime = reminder.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
      return existingTime === newTime
    })

    if (!isDuplicate) {
      const newReminders = [...reminders, date].sort((a, b) => a.getTime() - b.getTime())

      setReminders(newReminders)
    } else {
      Toast.show({
        type: 'error',
        text1: t('toast.oops'),
        text2: t('habit.toast.reminder.duplicate')
      })
    }
  }

  const handleDateChangeAndroid: React.ComponentProps<typeof DateTimePicker>['onChange'] = (
    { type },
    date
  ) => {
    if (type === 'set' && date) {
      addReminder(date)
    }
  }

  const handleAddReminder = async () => {
    if (reminders.length >= MAX_REMINDERS) {
      Toast.show({
        type: 'error',
        text1: t('toast.oops'),
        text2: t('habit.toast.reminder.limit', { limit: MAX_REMINDERS })
      })
      return
    }

    const isNotificationsEnabled = await registerForPushNotificationsAsync()

    if (!isNotificationsEnabled) {
      Toast.show({
        type: 'error',
        text1: t('toast.oops'),
        text2: t('habit.toast.reminder.notifications')
      })
      return
    }

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: new Date(),
        mode: 'time',
        onChange: handleDateChangeAndroid
      })
    } else {
      setShowIosDatePicker(true)
    }
  }

  const confirmDateIOS = (date: Date | null) => {
    if (date) {
      addReminder(date)
    }
    setShowIosDatePicker(false)
  }

  const toggleDatePicker = () => {
    setShowIosDatePicker(prev => !prev)
  }

  const handleRemoveReminder = (index: number) => {
    const newReminders = reminders.filter((_, i) => i !== index)

    setReminders(newReminders)
  }

  return (
    <>
      {Platform.OS === 'ios' && showIosDatePicker ? null : (
        <View style={styles.rowContainer}>
          <ThemedText type="subtitle">{t('habit.setReminders')}</ThemedText>
          <Switch
            value={isReminderEnabled}
            trackColor={{ true: Colors[theme].tint }}
            thumbColor={Colors.dark.text}
            onValueChange={setIsReminderEnabled}
          />
        </View>
      )}

      {isReminderEnabled && !showIosDatePicker && (
        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.rowContainer} onPress={handleAddReminder}>
            <ThemedText
              lightColor={
                reminders.length >= MAX_REMINDERS ? Colors.light.textSecondary : Colors.light.tint
              }
              darkColor={
                reminders.length >= MAX_REMINDERS ? Colors.dark.textSecondary : Colors.dark.tint
              }
              style={[styles.addReminderText]}
            >
              {t('habit.addReminder')}
            </ThemedText>
            <Icon
              name="plus-circle"
              color={
                reminders.length >= MAX_REMINDERS ? Colors.light.textSecondary : Colors[theme].tint
              }
            />
          </TouchableOpacity>

          <View style={styles.sectionContainer}>
            {reminders.map((item, index) => (
              <ReminderCard key={index} time={item} onPress={() => handleRemoveReminder(index)} />
            ))}
          </View>
        </View>
      )}

      {isReminderEnabled && showIosDatePicker && (
        <DateTimePickerIOS toggleDatePicker={toggleDatePicker} confirmDate={confirmDateIOS} />
      )}
    </>
  )
}

export default ReminderControls

const styles = StyleSheet.create({
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
