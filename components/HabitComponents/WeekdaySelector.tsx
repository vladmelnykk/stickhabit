import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React, { useLayoutEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SquareButton from '../ui/SquareButton'

export const DAYS_OF_WEEK = [
  { id: '0', name: 'S' },
  { id: '1', name: 'M' },
  { id: '2', name: 'T' },
  { id: '3', name: 'W' },
  { id: '4', name: 'T' },
  { id: '5', name: 'F' },
  { id: '6', name: 'S' }
]

const GAP = 8

interface WeekdaySelectorProps {
  selectedDays: boolean[]
  setSelectedDays: React.Dispatch<React.SetStateAction<boolean[]>>
}

const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({ selectedDays, setSelectedDays }) => {
  const [itemWidth, setItemWidth] = React.useState(0)
  const ref = React.useRef<View>(null)
  const theme = useColorScheme()

  useLayoutEffect(() => {
    ref.current?.measureInWindow((x, y, width, height) => {
      const itemWidth = (Math.floor(width) - GAP * (DAYS_OF_WEEK.length - 1)) / DAYS_OF_WEEK.length
      setItemWidth(itemWidth)
    })
  }, [])

  return (
    <View ref={ref} style={styles.container}>
      {DAYS_OF_WEEK.map((item, index) => (
        <SquareButton
          value={selectedDays[index]}
          onValueChange={value =>
            setSelectedDays(prev => [...prev.slice(0, index), value, ...prev.slice(index + 1)])
          }
          key={item.id}
          style={{ width: itemWidth, height: itemWidth }}
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
