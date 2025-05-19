import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { ThemedText } from './ThemedText'

interface RadioButtonProps<T extends string> {
  checked: boolean
  label: string
  value: T
  onPress: (value: T) => void
}

function RadioButton<T extends string>({ checked, label, value, onPress }: RadioButtonProps<T>) {
  const theme = useColorScheme()

  return (
    <Pressable style={styles.container} onPress={() => onPress(value)}>
      <View style={[styles.radioButtonContainer, { backgroundColor: Colors[theme].tint }]}>
        <View
          style={[
            styles.radioButton,
            {
              backgroundColor: checked ? Colors[theme].tint : Colors[theme].background,
              borderColor: checked ? Colors[theme].background : Colors[theme].background
            }
          ]}
        />
      </View>
      <ThemedText>{label}</ThemedText>
    </Pressable>
  )
}

export default RadioButton

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioButtonContainer: {
    width: 20,
    height: 20,
    padding: 2,
    borderRadius: 100,
    justifyContent: 'center'
  },
  radioButton: {
    flex: 1,
    borderRadius: 100,
    borderWidth: 2
  }
})
