import Header from '@/components/common/Header'
import Icon from '@/components/ui/Icon'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors } from '@/constants/Colors'
import { CONTAINER_PADDING } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import { type IconName } from '@/types/global'
import { router } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface SettingsItem {
  label: string
  icon: IconName
  onPress: () => void
}

const Page = () => {
  const insets = useSafeAreaInsets()
  const theme = useColorScheme()
  const { t } = useTranslation()

  const settingsItems: SettingsItem[] = [
    {
      label: t('settings.appearance.title'),
      icon: 'eye',
      onPress: () => {
        router.navigate('/settings/appearance')
      }
    },
    {
      label: t('settings.dataManagement.title'),
      icon: 'database',
      onPress: () => {
        router.navigate('/settings/data-management')
      }
    },
    {
      label: t('settings.info.title'),
      icon: 'info',
      onPress: () => {
        router.navigate('/settings/info')
      }
    }
  ]

  const SettingsItem = ({ label, onPress, icon }: SettingsItem) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.listItem, { opacity: pressed ? 0.5 : 1 }]}
        onPress={onPress}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Icon name={icon} color={Colors[theme].text} />
          <ThemedText type="subtitle">{label}</ThemedText>
        </View>
        <Icon name={'chevron-right'} color={Colors[theme].text} />
      </Pressable>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View entering={FadeInUp}>
        <Header title={t('settings.title')} showLogo />
      </Animated.View>
      <Animated.View
        style={[styles.box, { backgroundColor: Colors[theme].secondary }]}
        entering={FadeInDown}
      >
        {settingsItems.map((item, index) => (
          <SettingsItem key={index} onPress={item.onPress} label={item.label} icon={item.icon} />
        ))}
      </Animated.View>
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
  listItem: {
    width: '100%',
    gap: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  box: {
    borderRadius: 8,
    gap: 8
  }
})
