import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity } from 'react-native'
import Icon from '../ui/Icon'
import { ThemedText } from '../ui/ThemedText'
import { ThemedView } from '../ui/ThemedView'

interface HeaderProps {
  title: string
  leftIcon?: React.ComponentProps<typeof Icon>['name']
  rightIcon?: React.ComponentProps<typeof Icon>['name']
  onLeftPress?: () => void
  onRightPress?: () => void
  leftIconStyle?: StyleProp<TextStyle>
  rightIconStyle?: StyleProp<TextStyle>
  renderLeftIcon?: () => React.ReactNode
}

const ICON_CONTAINER_SIZE = 40
const HEADER_HEIGHT = 50
const ICON_SIZE = 28


const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  leftIconStyle,
  rightIconStyle,
  renderLeftIcon
}) => {
  const theme = useColorScheme()


  return (
      <ThemedView style={styles.container}>
        {/* TODO: add ability to render left icon */}

        {/* Left icon */}
        {renderLeftIcon ? renderLeftIcon() : <TouchableOpacity style={styles.leftIconContainer} onPress={onLeftPress}>
          {leftIcon && (
            <Icon
              name={leftIcon}
              color={Colors[theme].text}
              size={ICON_SIZE}
              style={leftIconStyle}
            />
          )}
        </TouchableOpacity>}

        {/* Title */}
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>

        {/* Right icon */}
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={onRightPress}
          disabled={!rightIcon}
        >
          {rightIcon && (
            <Icon
              name={rightIcon}
              color={Colors[theme].text}
              size={ICON_SIZE}
              style={rightIconStyle}
            />
          )}
        </TouchableOpacity>
      </ThemedView>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative'
  },
  title: {
    position: 'absolute',
    left: ICON_CONTAINER_SIZE,
    right: ICON_CONTAINER_SIZE,
    textAlign: 'center'
  },
  leftIconContainer: {
    width: ICON_CONTAINER_SIZE
  },
  rightIconContainer: {
    width: ICON_CONTAINER_SIZE
  }
})
