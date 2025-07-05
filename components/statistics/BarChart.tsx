import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { CONTAINER_PADDING, WINDOW_WIDTH } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BarChart as BarChartRNGC, barDataItem } from 'react-native-gifted-charts'

const LABEL_WIDTH = 20
const SPACING = 8
const CHART_WIDTH = WINDOW_WIDTH - CONTAINER_PADDING * 2 - LABEL_WIDTH - SPACING - 12

const BAR_WIDTH = (CHART_WIDTH - SPACING * 7 - 15) / 7
export const TOOLTIP_WIDTH = BAR_WIDTH + SPACING
interface BarChartProps {
  data: barDataItem[]
  maxValue: number
}

const BarChart: React.FC<BarChartProps> = ({ data, maxValue }) => {
  const theme = useColorScheme()

  const renderTooltip = (item: barDataItem, index: number) => {
    return (
      <View
        style={[
          styles.tooltip,
          { borderColor: Colors[theme].tint, backgroundColor: Colors[theme].background }
        ]}
      >
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={[styles.tooltipText, { color: Colors[theme].text }]}
        >
          {item.value}
        </Text>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={[styles.tooltipText, { color: Colors[theme].text }]}
        >
          habits
        </Text>
        <View style={[styles.tooltipArrow, { borderTopColor: Colors[theme].tint }]} />
      </View>
    )
  }

  return (
    <BarChartRNGC
      data={data}
      scrollToIndex={-1}
      // overflowTop={5}
      yAxisExtraHeight={TOOLTIP_WIDTH * 1.2}
      yAxisThickness={0}
      xAxisThickness={0}
      hideRules
      yAxisLabelWidth={LABEL_WIDTH}
      parentWidth={CHART_WIDTH}
      initialSpacing={SPACING}
      spacing={SPACING}
      barWidth={BAR_WIDTH}
      // activeOpacity={1}
      noOfSections={maxValue < 7 ? maxValue : 5}
      maxValue={maxValue <= 10 ? maxValue + 2 : undefined}
      frontColor={Colors[theme].tint}
      highlightEnabled
      focusBarOnPress
      endSpacing={0}
      focusedBarConfig={{ color: Colors[theme].tint }}
      roundedTop
      formatYLabel={(value: string) => String(Number(value))}
      yAxisTextStyle={{ color: Colors[theme].text }}
      xAxisLabelTextStyle={{ color: Colors[theme].text, textTransform: 'capitalize', fontSize: 13 }}
      renderTooltip={renderTooltip}
    />
  )
}

export default BarChart

const styles = StyleSheet.create({
  tooltip: {
    marginBottom: 5,
    padding: 6,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    width: TOOLTIP_WIDTH,
    height: TOOLTIP_WIDTH,
    borderWidth: 4,
    left: '-50%',
    transform: [{ translateX: BAR_WIDTH / 2 }],
    zIndex: 100
  },
  tooltipText: {
    fontFamily: FontFamily.RobotoRegular,
    textAlign: 'center'
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
  }
})
