import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import Icon from './Icon'

const Logo = () => {
  const theme = useColorScheme()
  return <Icon name="logo" color={Colors[theme].tint} size={40} />
}

export default Logo
