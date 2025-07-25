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
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Calendar, CalendarProps } from 'react-native-calendars'
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const initialDays = new Array(7).fill(false)

const Page = () => {
  const { id } = useLocalSearchParams()
  const theme = useColorScheme()
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const habits = useStore(state => state.habits)

  const numericId = Number(id)
  const habit = useMemo(() => habits.find(h => h.id === numericId), [habits, numericId])

  if (!habit) {
    return <Redirect href="/habits" />
  }

  const statistics = calculateStatistics({ habits: [habit] })

  const frequency =
    habit &&
    (habit.daysOfWeek.length < 7
      ? `${habit.daysOfWeek.length} ${t('statistics.daysPerWeek')}`
      : t('statistics.everyday'))

  const selectedDays = initialDays.map((_, index) => habit.daysOfWeek.includes(index))

  const markedDates = habit?.completedDates.reduce((acc: Record<string, MarkingProps>, d) => {
    const date = new Date(d.date)

    const formattedDate = format(date, 'yyyy-MM-dd')
    const isTodayDate = isToday(date)

    acc[formattedDate] = {
      selected: true,
      marked: isTodayDate,
      disableTouchEvent: true,
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
    textDayFontWeight: 'semibold',
    textDayFontFamily: FontFamily.RobotoSemiBold,
    textMonthFontWeight: 'bold',
    textMonthFontFamily: FontFamily.RobotoBold,
    monthTextColor: Colors[theme].text,
    calendarBackground: Colors[theme].background,
    todayTextColor: Colors[theme].tint,
    weekVerticalMargin: 5
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
        title={t('habit.title')}
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

        <ThemedText type="subtitle">{t('habit.days')}</ThemedText>
        <WeekdaySelector selectedDays={selectedDays} />

        <ThemedText type="subtitle">{t('habit.calendarStatistics')}</ThemedText>
        <Calendar
          key={theme}
          style={[styles.calendar, { backgroundColor: Colors[theme].background }]}
          firstDay={1}
          markingType="custom"
          markedDates={markedDates}
          disableAllTouchEventsForDisabledDays
          disableAllTouchEventsForInactiveDays
          theme={calendarTheme}
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
    justifyContent: 'center'
  },
  rightIcons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16
  }
})
