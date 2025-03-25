import Header from '@/components/common/Header'
import DateTimePickerIOS from '@/components/HabitComponents/DateTimePickerIOS'
import ListColorItem from '@/components/HabitComponents/ListColorItem'
import ReminderCard from '@/components/HabitComponents/ReminderCard'
import WeekdaySelector from '@/components/HabitComponents/WeekdaySelector'
import Checkbox from '@/components/ui/Checkbox'
import Icon from '@/components/ui/Icon'
import Input from '@/components/ui/Input'
import ThemedButton from '@/components/ui/ThemedButton'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { COLOR_WHEEL, HabitColors } from '@/constants/HabitColors'
import { habits } from '@/db/schema/habits'
import { useColorScheme } from '@/hooks/useColorScheme'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { router } from 'expo-router'
import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Switch,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { db } from './_layout'

const BottomSheetColorPicker = lazy(() => import('@/components/common/BottomSheetColorPicker'))

// TODO: create component provider for padding
const CONTAINER_PADDING = 18
const COLORS = [...HabitColors, COLOR_WHEEL]
const DAYS = 7

const Page = () => {
  const theme = useColorScheme()
  const insets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheetMethods>(null)

  // TODO: change this to controlled inputs
  const nameValueRef = useRef<string | null>(null)
  const goalValueRef = useRef<string | null>(null)
  const [color, setColor] = useState<string | null>(null)

  const [isAllDaysSelected, setIsAllDaysSelected] = useState(false)
  const [selectedDays, setSelectedDays] = useState<boolean[]>(Array(DAYS).fill(true))

  const [isReminderEnabled, setIsReminderEnabled] = useState(false)

  // TODO: determine how to handle reminders ( formats for ui, notifications, database etc. )
  const [reminders, setReminders] = useState<Date[]>([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [date, setDate] = useState<Date | null>(null)

  useEffect(() => {
    if (selectedDays.every(day => day)) {
      setIsAllDaysSelected(true)
    } else {
      setIsAllDaysSelected(false)
    }
  }, [selectedDays])

  const renderColorListItem = useCallback(
    ({ index, item }: { index: number; item: string }) => {
      return (
        <ListColorItem
          index={index}
          item={item}
          setColor={setColor}
          color={color}
          bottomSheetRef={bottomSheetRef}
        />
      )
    },
    [color]
  )

  const handleCheckboxChange = (value: boolean) => {
    setSelectedDays(Array(DAYS).fill(value))
  }

  const handleLeftIconPress = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  const handleDateChangeAndroid: React.ComponentProps<typeof DateTimePicker>['onChange'] = (
    { type },
    date
  ) => {
    if (type === 'set' && date) {
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
        setReminders(prev => [...prev, date].sort((a, b) => a.getTime() - b.getTime()))
      } else {
        // TODO: implement warning for IOS
        ToastAndroid.show('Reminder already exists', ToastAndroid.SHORT)
      }
    }
  }

  const handleDateChangeIOS: React.ComponentProps<typeof DateTimePicker>['onChange'] = (
    { type },
    date
  ) => {
    if (type === 'set') {
      if (date) setDate(date)
    } else {
      setShowDatePicker(false)
    }
  }

  const handleAddReminder = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date || new Date(),
        mode: 'time',
        onChange: handleDateChangeAndroid
      })
    } else {
      setShowDatePicker(true)
    }
  }

  // TODO: optimize and refactor date picker stuff
  const confirmDateIOS = () => {
    if (date) setReminders(prev => [...prev, date])
    setShowDatePicker(false)
    setDate(null)
  }

  const toggleDatePicker = () => {
    setShowDatePicker(prev => !prev)
  }

  const handleRemoveReminder = (index: number) => {
    setReminders(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    // TODO: input validation
    const habitName = nameValueRef.current || ''
    const goal = parseInt(goalValueRef.current || '0', 10)

    if (!habitName) {
      ToastAndroid.show('Please enter a habit name', ToastAndroid.SHORT)
      return
    }

    if (goal <= 0 || isNaN(goal)) {
      ToastAndroid.show('Please enter a valid goal', ToastAndroid.SHORT)
      return
    }

    if (!color) {
      ToastAndroid.show('Please select a color', ToastAndroid.SHORT)
      return
    }

    if (!selectedDays.some(day => day)) {
      ToastAndroid.show('Please select at least one day', ToastAndroid.SHORT)
      return
    }

    const daysOfWeek = selectedDays
      .map((isSelected, index) => (isSelected ? index : null))
      .filter(day => day !== null)

    // TODO: determine how to set time (getTime() or only HH:MM etc. )
    const notificationTime = reminders.map(reminder => reminder.getTime())
    const habitData = {
      title: habitName,
      timesPerDay: goal,
      color,
      daysOfWeek: daysOfWeek,
      notificationTime: notificationTime,
      completedDates: [],
      createdAt: new Date().getTime()
    } satisfies typeof habits.$inferInsert

    console.log('Saving habit:', habitData)

    try {
      await db.insert(habits).values(habitData)

      ToastAndroid.show('Habit saved successfully!', ToastAndroid.SHORT)

      router.back()
    } catch (error) {
      console.error('Error saving habit:', error)

      ToastAndroid.show('Error saving habit', ToastAndroid.SHORT)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors[theme].background} />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <Header title="Create Habit" leftIcon="x" onLeftPress={handleLeftIconPress} />

        <Animated.View style={styles.sectionContainer} entering={FadeInUp}>
          <ThemedText type="subtitle">Habit Name</ThemedText>
          <Input placeholder="Habit Name" onChangeText={text => (nameValueRef.current = text)} />
        </Animated.View>

        <Animated.View style={styles.sectionContainer} entering={FadeInUp}>
          <ThemedText type="subtitle">How many times a day?</ThemedText>
          <Input
            placeholder="Your Goal"
            keyboardType="number-pad"
            onChangeText={text => (goalValueRef.current = text)}
          />
        </Animated.View>

        <ThemedText type="subtitle">Color</ThemedText>

        <View>
          <FlatList
            data={COLORS}
            extraData={color}
            scrollEnabled={false}
            keyExtractor={item => item}
            numColumns={5}
            getItemLayout={(data, index) => ({
              length: 50,
              offset: 50 * Math.floor(index / 5),
              index
            })}
            style={styles.list}
            contentContainerStyle={[styles.listContainer]}
            columnWrapperStyle={styles.listColumnWrapper}
            renderItem={renderColorListItem}
          />
        </View>

        <View style={styles.rowContainer}>
          <ThemedText type="subtitle">Days</ThemedText>
          <View style={styles.rowContainer}>
            <ThemedText>All day</ThemedText>
            <Checkbox value={isAllDaysSelected} onValueChange={handleCheckboxChange} />
          </View>
        </View>
        <WeekdaySelector selectedDays={selectedDays} setSelectedDays={setSelectedDays} />

        {Platform.OS === 'ios' && showDatePicker ? null : (
          <View style={styles.rowContainer}>
            <ThemedText type="subtitle">Set Reminder</ThemedText>
            <Switch
              value={isReminderEnabled}
              trackColor={{ true: Colors[theme].tint }}
              thumbColor={Colors.dark.text}
              onValueChange={setIsReminderEnabled}
            />
          </View>
        )}

        {/* TODO: add limitation for number of reminders */}
        {isReminderEnabled && !showDatePicker && (
          <View style={styles.sectionContainer}>
            <TouchableOpacity style={styles.rowContainer} onPress={handleAddReminder}>
              <ThemedText
                lightColor={Colors.light.tint}
                darkColor={Colors.dark.tint}
                style={[styles.addReminderText]}
              >
                Add new reminder
              </ThemedText>
              <Icon name="plus-circle" color={Colors[theme].tint} />
            </TouchableOpacity>

            <View style={styles.sectionContainer}>
              {reminders.map((item, index) => (
                <ReminderCard key={index} time={item} onPress={() => handleRemoveReminder(index)} />
              ))}
            </View>
          </View>
        )}

        {isReminderEnabled && showDatePicker && (
          <DateTimePickerIOS
            date={date}
            onChange={handleDateChangeIOS}
            toggleDatePicker={toggleDatePicker}
            confirmDate={confirmDateIOS}
          />
        )}
      </ScrollView>
      <ThemedButton title="Save" onPress={handleSave} />

      <Suspense fallback={null}>
        <BottomSheetColorPicker setColor={setColor} ref={bottomSheetRef} />
      </Suspense>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    paddingHorizontal: CONTAINER_PADDING,
    paddingBottom: CONTAINER_PADDING
  },
  scrollView: { flex: 1 },
  scrollContainer: {
    gap: 18,
    paddingBottom: 20
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
