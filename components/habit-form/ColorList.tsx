import { FontFamily } from '@/constants/FontFamily'
import { COLOR_WHEEL, HabitColors } from '@/constants/HabitColors'
import React, { useCallback } from 'react'
import { FlatList, GestureResponderEvent, StyleSheet } from 'react-native'
import ListColorItem from './ListColorItem'

const COLORS = [...HabitColors, COLOR_WHEEL]

interface ColorListProps {
  color: string | null
  onColorPress: (color: string) => void
  onColorWheelPress: (event: GestureResponderEvent) => void
}
const ColorList: React.FC<ColorListProps> = ({ color, onColorPress, onColorWheelPress }) => {
  const renderColorListItem = useCallback(
    ({ index, item }: { index: number; item: string }) => {
      return (
        <ListColorItem
          index={index}
          item={item}
          color={color}
          onColorPress={onColorPress}
          onColorWheelPress={onColorWheelPress}
        />
      )
    },
    [color, onColorPress, onColorWheelPress]
  )

  return (
    <FlatList
      data={COLORS}
      scrollEnabled={false}
      keyExtractor={item => item}
      numColumns={5}
      getItemLayout={(data, index) => ({
        length: 50,
        offset: 50 * Math.floor(index / 5),
        index
      })}
      style={styles.list}
      contentContainerStyle={[styles.listContainer]}
      columnWrapperStyle={styles.listColumnWrapper}
      renderItem={renderColorListItem}
    />
  )
}

export default ColorList

const styles = StyleSheet.create({
  list: { flexGrow: 0 },
  listContainer: { gap: 12, flexShrink: 1 },
  listColumnWrapper: { justifyContent: 'space-between' },
  addReminderText: {
    fontSize: 16,
    fontFamily: FontFamily.RobotoLight
  }
})
