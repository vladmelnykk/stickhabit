import { Colors } from '@/constants/Colors'
import { WINDOW_WIDTH } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useStore } from '@/store/store'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { barDataItem, lineDataItem } from 'react-native-gifted-charts'
import Dropdown from '../common/Dropdown'
import { ThemedText } from '../ui/ThemedText'

import { Language } from '@/constants/Language'
import { Habit } from '@/types/types'
import { useTranslation } from 'react-i18next'
import BarChart from './BarChart'
import LineChart from './LineChart'
export interface Range {
  value: number
  label: string
}

interface ChartWithRangePickerProps {
  title: string
  range: Range[]
  chartType?: 'bar' | 'line'
  buildChartData: (
    habits: Habit[],
    selectedRangeIndex: number,
    lng: Language
  ) => { data: barDataItem[] | lineDataItem[]; maxValue: number }
}

const ChartWithRangePicker: React.FC<ChartWithRangePickerProps> = ({
  title,
  range,
  chartType = 'bar',
  buildChartData
}) => {
  const theme = useColorScheme()
  const habits = useStore(state => state.habits)
  const { i18n } = useTranslation()
  const [selectedRangeIndex, setSelectedRangeIndex] = React.useState<number>(0)

  const { data, maxValue } = useMemo(
    () => buildChartData(habits, selectedRangeIndex, i18n.language as Language),
    [habits, selectedRangeIndex, buildChartData, i18n.language]
  )

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].secondary }]}>
      <View style={styles.rowContainer}>
        <ThemedText style={styles.title} type="subtitle">
          {title}
        </ThemedText>

        <Dropdown
          direction="right"
          options={range}
          selectedIndex={selectedRangeIndex}
          onSelect={value => {
            setSelectedRangeIndex(value)
          }}
        />
      </View>
      <View style={[styles.line, { backgroundColor: Colors[theme].textSecondary }]} />
      <View>
        {/* TODO: fix Layout.animation configuration isAnimated  */}
        {chartType === 'bar' ? (
          <BarChart data={data} maxValue={maxValue} />
        ) : (
          <LineChart data={data} />
        )}
        {/* TODO: fix LineChart bug with dropdown [newArchitecture]  */}
      </View>
    </View>
  )
}

export default ChartWithRangePicker

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: '100%'
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  line: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    marginVertical: 8
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 100,
    paddingHorizontal: 8,
    width: WINDOW_WIDTH / 3
  },
  title: { fontSize: 18, flexShrink: 1 }
})
