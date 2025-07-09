import iconConfig from '@/assets/fonts/selection.json'
import { IconName } from '@/types/global'
import { createIconSetFromIcoMoon } from '@expo/vector-icons'
import React from 'react'
import { StyleProp, TextStyle } from 'react-native'

interface IconProps {
  name: IconName
  size?: number
  color?: string
  style?: StyleProp<TextStyle>
}

const CustomIcon = createIconSetFromIcoMoon(iconConfig, 'feather', 'feather.ttf')

const Icon = ({ color, size = 24, name, style }: IconProps) => {
  return <CustomIcon name={name} size={size} color={color} style={style} />
}

export default Icon
