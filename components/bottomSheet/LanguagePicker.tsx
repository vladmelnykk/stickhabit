import { Colors } from '@/constants/Colors'
import { LANGUAGES } from '@/constants/Language'
import { useColorScheme } from '@/hooks/useColorScheme'
import LocaleConfig from '@/locales/calendar'
import { useDatabase } from '@/providers/DatabaseProvider'
import { useStore } from '@/store/store'
import { Language } from '@/types/global'
import { rescheduleAllHabitNotifications } from '@/utils/notification'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from '../ui/Icon'
import { ThemedText } from '../ui/ThemedText'

const LanguagePicker = () => {
  const theme = useColorScheme()
  const { t, i18n } = useTranslation()
  const { db } = useDatabase()
  const currentLanguage = useStore(state => state.language)
  const setLanguage = useStore(state => state.setLanguage)

  const onPress = (value: Language) => {
    i18n.changeLanguage(value)
    setLanguage(value)
    LocaleConfig.defaultLocale = i18n.language // Update calendar locale
    rescheduleAllHabitNotifications(db, useStore.getState().habits) // Reschedule notifications after language change
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={[styles.box, { backgroundColor: Colors[theme].secondary }]}
        data={LANGUAGES}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPress(item.code)} style={styles.listItem}>
            <ThemedText type="subtitle">{t(item.label)}</ThemedText>
            {item.code === currentLanguage && <Icon name="check" color={Colors[theme].tint} />}
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

export default LanguagePicker

const styles = StyleSheet.create({
  container: { gap: 20 },
  box: { borderRadius: 8, gap: 8 },
  listItem: {
    width: '100%',
    gap: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
