import Header from '@/components/common/Header'
import { ThemedText } from '@/components/ui/ThemedText'
import { CONTAINER_PADDING } from '@/constants/global'
import * as Application from 'expo-application'
import { router } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const Page = () => {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header
        title={t('settings.info.title')}
        leftIcon="arrow-left"
        onLeftPress={() => router.back()}
      />
      <ThemedText type="subtitle">{Application.applicationName}</ThemedText>
      <ThemedText>
        {t('settings.info.version')}: {Application.nativeApplicationVersion}
      </ThemedText>
      <ThemedText type="subtitle">{t('settings.info.contact')}</ThemedText>
      <ThemedText type="link" onPress={() => Linking.openURL('https://github.com/vladmelnykk')}>
        GitHub
      </ThemedText>
      <ThemedText type="link" onPress={() => Linking.openURL('mailto:vlad.melnyk28@gmail.com')}>
        Email
      </ThemedText>
      <ThemedText type="link" onPress={() => Linking.openURL('https://t.me/vladxd')}>
        Telegram
      </ThemedText>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 18,
    paddingHorizontal: CONTAINER_PADDING
  },
  section: {
    gap: 8
  }
})
