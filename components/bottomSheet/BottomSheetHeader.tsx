import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native'
import { ThemedText } from '../ui/ThemedText'

interface Props {
  title: string
  titleStyle?: StyleProp<TextStyle>
}

const BottomSheetHeader: React.FC<Props> = ({ title, titleStyle }) => {
  const theme = useColorScheme()

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={titleStyle}>
        {title}
      </ThemedText>
      <View style={[styles.line, { backgroundColor: Colors[theme].accent }]} />
    </View>
  )
}

export default BottomSheetHeader

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 20
  },
  line: {
    width: '100%',
    height: 1,
    borderRadius: 8
  }
})
