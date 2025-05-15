import Header from '@/components/common/Header'
import WeekdaySelector from '@/components/habit-form/WeekdaySelector'
import StatisticsPanel from '@/components/statistics/StatisticsPanel'
import Icon from '@/components/ui/Icon'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { CONTAINER_PADDING } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useStore } from '@/store/store'
import { calculateStatistics } from '@/utils/statistics'
import { format, isToday } from 'date-fns'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Calendar, CalendarProps } from 'react-native-calendars'
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const DATE_TEXT_COLOR = '#fff'

const initialDays = new Array(7).fill(false)

const Page = () => {
  const { id } = useLocalSearchParams()
  const theme = useColorScheme()
  const insets = useSafeAreaInsets()

  const habits = useStore(state => state.habits)

  const numericId = Number(id)
  const habit = useMemo(() => habits.find(h => h.id === numericId), [habits, numericId])

  console.log(habit?.notificationIds)

  if (!habit) {
    return <Redirect href="/habits" />
  }

  const statistics = calculateStatistics([habit])

  const frequency =
    habit && (habit.daysOfWeek.length < 7 ? `${habit.daysOfWeek.length} days per week` : 'Everyday')

  const selectedDays = initialDays.map((_, index) => habit.daysOfWeek.includes(index))

  const markedDates = habit?.completedDates.reduce((acc: Record<string, MarkingProps>, d) => {
    const date = new Date(d.date)

    const formattedDate = format(date, 'yyyy-MM-dd')
    const isTodayDate = isToday(date)
    const isThisMonth = date.getMonth() === new Date().getMonth()

    acc[formattedDate] = {
      selected: true,
      marked: isTodayDate,
      disableTouchEvent: true,
      selectedTextColor: isThisMonth ? DATE_TEXT_COLOR : Colors[theme].textSecondary,
      customStyles: { container: styles.selectedContainer }
    }

    return acc
  }, {})

  const calendarTheme = {
    selectedDayBackgroundColor: Colors[theme].tint,
    dayTextColor: Colors[theme].text,
    textInactiveColor: Colors[theme].textSecondary,
    textDisabledColor: Colors[theme].textSecondary,
    textSectionTitleColor: Colors[theme].text,
    textDayHeaderFontSize: 16,
    textDayFontSize: 18,
    textDayFontFamily: FontFamily.RobotoSemiBold,
    textMonthFontFamily: FontFamily.RobotoBold,
    monthTextColor: Colors[theme].text,
    calendarBackground: Colors[theme].background,
    todayTextColor: Colors[theme].tint
  } as CalendarProps['theme']

  const renderArrow: CalendarProps['renderArrow'] = direction => (
    <Icon
      name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
      size={24}
      color={Colors[theme].text}
    />
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title="Habit"
        leftIcon="arrow-left"
        onLeftPress={() => router.back()}
        renderRightItem={() => (
          <View style={styles.rightIcons}>
            <TouchableOpacity onPress={() => router.navigate(`/habit/${id}/edit`)}>
              <Icon name="edit-3" size={24} color={Colors[theme].text} />
            </TouchableOpacity>
          </View>
        )}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <StatisticsPanel {...statistics} title={habit.title} frequency={frequency} />

        <ThemedText type="subtitle">Days</ThemedText>
        <WeekdaySelector selectedDays={selectedDays} />

        <ThemedText type="subtitle">Calendar Stats</ThemedText>
        <Calendar
          key={theme}
          style={[styles.calendar, { backgroundColor: Colors[theme].background }]}
          firstDay={1}
          markingType="custom"
          markedDates={markedDates}
          disableAllTouchEventsForDisabledDays
          disableAllTouchEventsForInactiveDays
          theme={calendarTheme}
          // TODO: fix TS
          // @ts-ignore
          renderArrow={renderArrow}
        />
      </ScrollView>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    paddingHorizontal: CONTAINER_PADDING,
    position: 'relative'
  },
  scrollView: { flex: 1 },
  scrollContainer: {
    gap: 18,
    paddingVertical: 20
  },
  calendar: {
    borderRadius: 8,
    paddingBottom: 40
  },
  selectedContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  rightIcons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16
  }
})
