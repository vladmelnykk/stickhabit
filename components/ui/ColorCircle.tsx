import React from 'react'
import { StyleSheet, View } from 'react-native'

const DEFAULT_SIZE = 50

const ColorCircle = ({ color, size = DEFAULT_SIZE }: { color: string; size?: number }) => {
  return <View style={[styles.container, { backgroundColor: color, width: size, height: size }]} />
}

export default ColorCircle

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    overflow: 'hidden'
  }
})
