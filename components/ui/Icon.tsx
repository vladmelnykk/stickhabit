import Feather from '@expo/vector-icons/Feather'
import React from 'react'
import { StyleProp, TextStyle } from 'react-native'

interface IconProps {
  name: React.ComponentProps<typeof Feather>['name']
  size?: number
  color?: string
  style?: StyleProp<TextStyle>
}

// TODO: create own icon library
const Icon = ({ color, size = 24, name, style }: IconProps) => {
  return <Feather name={name} size={size} color={color} style={style} />
}

export default Icon
