import ColorWheelSvg from '@/components/svg/ColorWheelSvg'
import ColorCircle from '@/components/ui/ColorCircle'
import Icon from '@/components/ui/Icon'
import { Colors } from '@/constants/Colors'
import { CONTAINER_PADDING, WINDOW_WIDTH } from '@/constants/global'
import { COLOR_WHEEL, HabitColors } from '@/constants/HabitColors'
import React from 'react'
import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

const LIST_ITEM_HEIGHT = (WINDOW_WIDTH - CONTAINER_PADDING * 2) / 7
const ICON_COLOR = '#212121'
const ListColorItem = ({
  index,
  item,
  onColorPress,
  color,
  onColorWheelPress
}: {
  index: number
  item: string
  onColorPress: (color: string) => void
  onColorWheelPress: (event: GestureResponderEvent) => void
  color: string | null
}) => {
  if (item === COLOR_WHEEL) {
    const isChosen = color ? (HabitColors.includes(color) ? false : true) : false

    return (
      <Pressable
        onPress={onColorWheelPress}
        style={({ pressed }) => ({
          width: LIST_ITEM_HEIGHT,
          height: LIST_ITEM_HEIGHT,
          borderRadius: 100,
          overflow: 'hidden',
          opacity: pressed ? 0.5 : 1
        })}
      >
        <ColorWheelSvg />
        {isChosen && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.chosenColor}>
            <Icon name="check" size={LIST_ITEM_HEIGHT / 2} color={Colors.light.text} />
          </Animated.View>
        )}
      </Pressable>
    )
  }

  return (
    <Pressable
      onPress={() => {
        onColorPress(item)
      }}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1
      })}
    >
      <ColorCircle key={index} color={item} size={LIST_ITEM_HEIGHT} />
      {color === item && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.chosenColor}>
          <Icon name="check" size={LIST_ITEM_HEIGHT / 2} color={ICON_COLOR} />
        </Animated.View>
      )}
    </Pressable>
  )
}

export default React.memo(ListColorItem)

const styles = StyleSheet.create({
  chosenColor: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100
  }
})
