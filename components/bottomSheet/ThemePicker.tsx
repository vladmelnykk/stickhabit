import { THEME_OPTIONS } from '@/constants/Theme'
import { useStore } from '@/store/store'
import { Theme } from '@/types/global'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import RadioButton from '../ui/RadioButton'

const ThemePicker = () => {
  const selectedTheme = useStore(state => state.theme)
  const setTheme = useStore(state => state.setTheme)
  const { t } = useTranslation()

  const onPress = (value: Theme) => {
    setTheme(value)
  }
  return (
    <View style={styles.radioButtonGroup}>
      {THEME_OPTIONS.map(({ label, value }) => (
        <RadioButton
          onPress={onPress}
          key={value}
          checked={selectedTheme === value}
          label={t(label)}
          value={value}
        />
      ))}
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
