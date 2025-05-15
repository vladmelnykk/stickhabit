import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SquareButton from '../ui/SquareButton'

const GAP = 8

const DAYS_OF_WEEK = [
  { id: '0', name: 'S', label: 'Sun' },
  { id: '1', name: 'M', label: 'Mon' },
  { id: '2', name: 'T', label: 'Tue' },
  { id: '3', name: 'W', label: 'Wed' },
  { id: '4', name: 'T', label: 'Thu' },
  { id: '5', name: 'F', label: 'Fri' },
  { id: '6', name: 'S', label: 'Sat' }
]
interface WeekdaySelectorProps {
  selectedDays: boolean[]
  setSelectedDays?: React.Dispatch<React.SetStateAction<boolean[]>>
}

const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({ selectedDays, setSelectedDays }) => {
  // const [itemWidth, setItemWidth] = React.useState(0)
  const ref = React.useRef<View>(null)
  const theme = useColorScheme()

  // TODO: old architecture does not support this way
  // useLayoutEffect(() => {
  //   ref.current?.measureInWindow((x, y, width, height) => {
  //     const itemWidth = (Math.floor(width) - GAP * (DAYS_OF_WEEK.length - 1)) / DAYS_OF_WEEK.length
  //     setItemWidth(itemWidth)
  //   })
  // }, [])

  return (
    <View
      ref={ref}
      // onLayout={(event: LayoutChangeEvent) => {
      //   const { width } = event.nativeEvent.layout
      //   const itemWidth =
      //     (Math.floor(width) - GAP * (DAYS_OF_WEEK.length - 1)) / DAYS_OF_WEEK.length
      //   setItemWidth(itemWidth)
      // }}
      style={styles.container}
    >
      {DAYS_OF_WEEK.map((item, index) => (
        <SquareButton
          value={selectedDays[index]}
          onValueChange={value =>
            setSelectedDays?.(prev => [...prev.slice(0, index), value, ...prev.slice(index + 1)])
          }
          key={item.id}
          style={{ flex: 1, aspectRatio: 1 }}
        >
          <Text style={{ color: selectedDays[index] ? Colors.dark.text : Colors[theme].text }}>
            {item.name}
          </Text>
        </SquareButton>
      ))}
    </View>
  )
}

export default WeekdaySelector

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: GAP,
    justifyContent: 'space-between'
  }
})
