import Header from '@/components/common/Header'
import ChartWithRangePicker from '@/components/statistics/ChartWithRangePicker'
import StatisticsPanel from '@/components/statistics/StatisticsPanel'
import { ChartRange } from '@/constants/ChartRange'
import { CONTAINER_PADDING } from '@/constants/global'
import { useStore } from '@/store/store'
import {
  calculateCompletedHabitsForChart,
  calculateCompletionRateForChart,
  calculateStatistics
} from '@/utils/statistics'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Page = () => {
  const insets = useSafeAreaInsets()
  const tabBarHeight = useBottomTabBarHeight()
  const { t } = useTranslation()

  const habits = useStore(state => state.habits)

  const statistics = useMemo(() => calculateStatistics(habits), [habits])

  const chartRange = ChartRange.map((label, index) => ({
    value: index,
    label: t(`chartRange.${label}`)
  }))

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title={t('statistics.title')} showLogo />
      <ScrollView
        style={[styles.scrollView]}
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: tabBarHeight + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <StatisticsPanel {...statistics} />
        <ChartWithRangePicker
          title={t('statistics.habitsCompleted')}
          range={chartRange}
          buildChartData={calculateCompletedHabitsForChart}
        />
        <ChartWithRangePicker
          title={t('statistics.completionRate')}
          range={chartRange}
          chartType="line"
          buildChartData={calculateCompletionRateForChart}
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
    paddingTop: 20
  }
})
