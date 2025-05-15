import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { CONTAINER_PADDING, WINDOW_WIDTH } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CurveType, LineChart as LineChartRN, lineDataItem } from 'react-native-gifted-charts'
import { TOOLTIP_WIDTH } from './BarChart'

const DATA_POINT_SIZE = 20
const Y_AXIS_LABEL_WIDTH = 35
const CHART_WIDTH =
  WINDOW_WIDTH - CONTAINER_PADDING * 2 - TOOLTIP_WIDTH / 2 - Y_AXIS_LABEL_WIDTH - 25

const LineChart = ({ data }: { data: lineDataItem[] }) => {
  const theme = useColorScheme()

  const focusedDataPointLabelComponent = (item: lineDataItem) => {
    return (
      item.value !== undefined && (
        <View style={[styles.tooltipWrapper, { borderColor: Colors[theme].tint }]}>
          <View style={styles.tooltipContent}>
            <Text style={styles.tooltipText}>{Math.floor(item.value)}%</Text>
          </View>
        </View>
      )
    )
  }

  return (
    <LineChartRN
      data={data}
      // overflowTop={30}
      overflowBottom={30}
      dataPointLabelWidth={TOOLTIP_WIDTH}
      dataPointLabelComponent={focusedDataPointLabelComponent}
      dataPointLabelShiftY={-TOOLTIP_WIDTH / 2}
      focusedDataPointLabelComponent={focusedDataPointLabelComponent}
      xAxisLabelsVerticalShift={5}
      initialSpacing={TOOLTIP_WIDTH / 2}
      spacing={data.length > 7 ? undefined : CHART_WIDTH / data.length + 1}
      endSpacing={TOOLTIP_WIDTH / 4}
      scrollToIndex={-1}
      width={CHART_WIDTH}
      formatYLabel={value => `${Number(value)}%`}
      yAxisLabelTexts={['0%', '20%', '40%', '60%', '80%', '100%', ' ']}
      startFillColor={Colors[theme].tint}
      startOpacity={0.8}
      endFillColor={Colors[theme].background}
      endOpacity={0.1}
      thickness1={6}
      color={Colors[theme].tint}
      customDataPoint={() => (
        <View style={[styles.dataPoint, { borderColor: Colors[theme].tint }]} />
      )}
      curveType={CurveType.QUADRATIC}
      curved
      yAxisLabelWidth={Y_AXIS_LABEL_WIDTH}
      dataPointsHeight={DATA_POINT_SIZE}
      dataPointsWidth={DATA_POINT_SIZE}
      dataPointsRadius={10}
      yAxisThickness={0}
      xAxisThickness={0}
      hideRules
      maxValue={120}
      yAxisLabelContainerStyle={styles.yAxisLabelContainer}
      yAxisTextStyle={[
        styles.yAxisText,
        {
          color: Colors[theme].text,
          fontFamily: FontFamily.RobotoRegular
        }
      ]}
      noOfSections={6}
      areaChart
      xAxisLabelTextStyle={[styles.xAxisText, { color: Colors[theme].text }]}
      focusEnabled
      showDataPointLabelOnFocus
      unFocusOnPressOut={false}
    />
  )
}

export default LineChart

const styles = StyleSheet.create({
  tooltipWrapper: {
    position: 'absolute',
    right: 0,
    zIndex: 1000,
    borderRadius: 48,
    width: TOOLTIP_WIDTH,
    minHeight: TOOLTIP_WIDTH,
    borderWidth: 4,
    alignItems: 'center'
  },
  tooltipContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    aspectRatio: 1,
    alignSelf: 'stretch',
    borderRadius: 48,
    backgroundColor: '#fff'
  },
  tooltipText: {
    fontFamily: FontFamily.RobotoRegular,
    fontSize: 14,
    color: '#000'
  },
  tooltipArrow: {
    zIndex: 100,
    position: 'absolute',
    bottom: -10,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent'
  },
  dataPoint: {
    width: DATA_POINT_SIZE,
    height: DATA_POINT_SIZE,
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 4
  },
  yAxisLabelContainer: {
    paddingRight: 0
  },
  yAxisText: {
    textAlign: 'left',
    fontSize: 13,
    marginLeft: -5
  },
  xAxisText: {
    fontSize: 13
  }
})
