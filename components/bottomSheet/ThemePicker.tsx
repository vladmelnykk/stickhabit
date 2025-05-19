import { THEME_OPTIONS } from '@/constants/Theme'
import { useStore } from '@/store/store'
import { Theme } from '@/types/types'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import RadioButton from '../ui/RadioButton'
import BottomSheetHeader from './BottomSheetHeader'

const ThemePicker = () => {
  const selectedTheme = useStore(state => state.theme)
  const setTheme = useStore(state => state.setTheme)

  const onPress = (value: Theme) => {
    setTheme(value)
  }
  return (
    <View style={styles.container}>
      <BottomSheetHeader title="Choose Theme" />
      <View style={[styles.radioButtonGroup, {}]}>
        {THEME_OPTIONS.map(({ label, value }) => (
          <RadioButton
            onPress={onPress}
            key={value}
            checked={selectedTheme === value}
            label={label}
            value={value}
          />
        ))}
      </View>
    </View>
  )
}

export default ThemePicker

const styles = StyleSheet.create({
  container: { gap: 20 },
  radioButtonGroup: {
    gap: 12
  }
})
