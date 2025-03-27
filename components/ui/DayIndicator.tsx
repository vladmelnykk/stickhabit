import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { useColorScheme } from '@/hooks/useColorScheme'
import { StyleSheet, Text, View } from 'react-native'
import Icon from './Icon'

const ICON_COLOR = '#212121'
interface DayItemProps {
  color: string
  label: string
  isCompleted: boolean
  size: number
}

const DayIndicator: React.FC<DayItemProps> = ({ size, color, label, isCompleted }) => {
  const theme = useColorScheme()

  return (
    <View style={styles.dayItem}>
      <Text
        style={{
          fontFamily: FontFamily.RobotoRegular,
          color: isCompleted ? Colors[theme].tint : Colors[theme].text,
          fontSize: size / 2.5
        }}
      >
        {label}
      </Text>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1,
          borderColor: isCompleted ? color : Colors[theme].textSecondary,
          backgroundColor: isCompleted ? color : Colors[theme].secondary,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {isCompleted && <Icon name="check" color={ICON_COLOR} size={size / 1.5} />}
      </View>
    </View>
  )
}

export default DayIndicator

const styles = StyleSheet.create({
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  }
})
