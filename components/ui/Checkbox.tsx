import React from 'react'
import { Appearance, Pressable, StyleSheet } from 'react-native'

import { Colors } from '@/constants/Colors'
import type { SyntheticEvent } from 'react'
import type { ColorValue, NativeSyntheticEvent, ViewProps } from 'react-native'
import Icon from './Icon'

type CheckboxEvent = {
  target: any
  value: boolean
}

type CheckboxProps = ViewProps & {
  iconSize?: number
  value?: boolean
  disabled?: boolean
  color?: ColorValue
  onChange?: (
    event: NativeSyntheticEvent<CheckboxEvent> | SyntheticEvent<HTMLInputElement, CheckboxEvent>
  ) => void
  onValueChange?: (value: boolean) => void
}

export default function Checkbox({
  color,
  disabled,
  onChange,
  onValueChange,
  style,
  value,
  iconSize,
  ...other
}: CheckboxProps) {
  const handleChange = () => {
    onValueChange?.(!value)
  }

  return (
    <Pressable
      {...other}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ disabled, checked: value }}
      style={[
        styles.root,
        style,
        value && styles.checked,
        !!color && { backgroundColor: value ? color : undefined, borderColor: color },
        disabled && styles.disabled,
        value && disabled && styles.checkedAndDisabled
      ]}
      onPress={handleChange}
    >
      {value && (
        <Icon
          name="check"
          size={iconSize || 17}
          color="#fff"
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </Pressable>
  )
}

const defaultEnabledColor =
  Appearance.getColorScheme() === 'dark' ? Colors.dark.tint : Colors.light.tint
const defaultGrayColor =
  Appearance.getColorScheme() === 'dark' ? Colors.dark.secondary : Colors.light.secondary
//  '#657786'
const disabledGrayColor = '#CCD6DD'
const disabledCheckedGrayColor = '#AAB8C2'

const styles = StyleSheet.create({
  root: {
    height: 20,
    width: 20,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: defaultGrayColor
  },
  checked: {
    backgroundColor: defaultEnabledColor,
    borderColor: defaultEnabledColor
  },
  disabled: {
    borderColor: disabledGrayColor,
    backgroundColor: 'transparent'
  },
  checkedAndDisabled: {
    backgroundColor: disabledCheckedGrayColor,
    borderColor: disabledCheckedGrayColor
  }
})
