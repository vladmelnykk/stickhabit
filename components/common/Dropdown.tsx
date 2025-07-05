import { Colors } from '@/constants/Colors'
import { WINDOW_WIDTH } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import React, { useCallback, useState } from 'react'
import {
  FlatList,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import type { Range } from '../statistics/ChartWithRangePicker'
import Icon from '../ui/Icon'
import { ThemedText } from '../ui/ThemedText'

interface Props {
  options: Range[]
  selectedIndex: number
  onSelect: (value: number) => void
  placeholder?: string
  direction?: 'left' | 'right'
  style?: StyleProp<ViewStyle>
  itemStyle?: StyleProp<ViewStyle>
}

const Dropdown: React.FC<Props> = ({
  options,
  selectedIndex,
  onSelect,
  placeholder,
  direction = 'left',
  style,
  itemStyle
}) => {
  const [open, setOpen] = useState(false)
  const ref = React.useRef<View>(null)
  const [position, setPosition] = useState<{
    top: number
    left: number
    bottom: number
    width: number
    height: number
  } | null>(null)
  const theme = useColorScheme()

  const label = options[selectedIndex]?.label

  const toggleDropdown = () => {
    measurePosition()
    setOpen(!open)
  }
  // Use useSafeAreaFrame to get the height of the safe area
  const frame = useSafeAreaFrame()

  const handleSelect = (value: number) => {
    setOpen(false)
    onSelect(value)
  }

  const measurePosition = useCallback(() => {
    ref.current?.measureInWindow((x, y, width, height) => {
      setPosition({
        top: Math.floor(y),
        bottom: Math.floor(y + height),
        left: x,
        width,
        height
      })
    })
  }, [])

  return (
    <View>
      <Pressable
        ref={ref}
        style={StyleSheet.flatten([
          styles.button,
          { borderColor: Colors[theme].text, backgroundColor: Colors[theme].secondary },
          style
        ])}
        onPress={toggleDropdown}
      >
        <ThemedText style={styles.buttonText}>{label || placeholder || 'Select'}</ThemedText>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} color={Colors[theme].text} />
      </Pressable>

      {open && position && (
        <Modal visible={open} transparent onRequestClose={toggleDropdown}>
          <TouchableWithoutFeedback onPress={toggleDropdown}>
            <View style={{ flex: 1 }}>
              <View
                style={[
                  styles.dropdown,
                  {
                    top: position.bottom + 2,
                    right:
                      direction === 'right'
                        ? WINDOW_WIDTH - position.left - position.width
                        : undefined,
                    left: direction === 'left' ? position.left : undefined,
                    backgroundColor: Colors[theme].background,
                    maxHeight: Math.min(frame.height - position.bottom, 200)
                  }
                ]}
              >
                <FlatList
                  style={[styles.flatList]}
                  data={options}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  keyExtractor={(item, index) => item.label + index}
                  ItemSeparatorComponent={() => (
                    <View style={[styles.separator, { backgroundColor: Colors[theme].accent }]} />
                  )}
                  renderItem={({ item }) => (
                    <Pressable
                      style={StyleSheet.flatten([styles.option, itemStyle])}
                      onPress={() => handleSelect(item.value)}
                    >
                      <ThemedText type="defaultSemiBold">{item.label}</ThemedText>
                    </Pressable>
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  )
}

export default Dropdown

const styles = StyleSheet.create({
  container: {
    zIndex: 10
  },
  overlay: {
    position: 'absolute',
    top: 50,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 10
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 24,
    borderWidth: 1,
    gap: 4
  },
  buttonText: {
    fontSize: 14
  },
  dropdown: {
    position: 'absolute',
    borderRadius: 8,
    // paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  separator: {
    height: 1,
    marginHorizontal: 16
  },
  flatList: {
    width: WINDOW_WIDTH / 2
  }
})
