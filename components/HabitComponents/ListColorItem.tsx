import ColorWheelSvg from '@/components/svg/ColorWheelSvg'
import ColorCircle from '@/components/ui/ColorCircle'
import Icon from '@/components/ui/Icon'
import { Colors } from '@/constants/Colors'
import { COLOR_WHEEL, HabitColors } from '@/constants/HabitColors'
import BottomSheet from '@gorhom/bottom-sheet'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

const LIST_ITEM_HEIGHT = 50
const ICON_COLOR = '#212121'
const ListColorItem = ({
  index,
  item,
  setColor,
  color,
  bottomSheetRef
}: {
  index: number
  item: string
  setColor: React.Dispatch<React.SetStateAction<string | null>>
  bottomSheetRef: React.RefObject<BottomSheet>
  color: string | null
}) => {
  if (item === COLOR_WHEEL) {
    const isChosen = color ? (HabitColors.includes(color) ? false : true) : false

    return (
      <Pressable
        onPress={() => {
          bottomSheetRef.current?.expand()
        }}
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
        setColor(prev => (prev === item ? null : item))
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
