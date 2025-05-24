import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import SquareButton from '../ui/SquareButton'

const GAP = 8

// 0 - Sun, 1 - Mon, 2 - Tue, 3 - Wed, 4 - Thu, 5 - Fri, 6 - Sat
const DAYS_OF_WEEK = [0, 1, 2, 3, 4, 5, 6] as const

interface WeekdaySelectorProps {
  selectedDays: boolean[]
  setSelectedDays?: React.Dispatch<React.SetStateAction<boolean[]>>
}

const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({ selectedDays, setSelectedDays }) => {
  const ref = React.useRef<View>(null)
  const theme = useColorScheme()
  const { t } = useTranslation()

  return (
    <View ref={ref} style={styles.container}>
      {DAYS_OF_WEEK.map((item, index) => (
        <SquareButton
          value={selectedDays[index]}
          onValueChange={value =>
            setSelectedDays?.(prev => [...prev.slice(0, index), value, ...prev.slice(index + 1)])
          }
          key={item + index}
          style={styles.button}
        >
          <Text style={{ color: selectedDays[index] ? Colors.dark.text : Colors[theme].text }}>
            {t(`days.oneLetter.${item}`)}
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
  },
  button: {
    flex: 1,
    aspectRatio: 1
  }
})
