import { ThemedText } from '@/components/ui/ThemedText'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const Page = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText>Page</ThemedText>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({})
