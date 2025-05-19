import Header from '@/components/common/Header'
import Icon from '@/components/ui/Icon'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors } from '@/constants/Colors'
import { CONTAINER_PADDING } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import Feather from '@expo/vector-icons/Feather'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface SettingsItem {
  title: string
  icon: React.ComponentProps<typeof Feather>['name']
  onPress: () => void
}

const settingsItems: SettingsItem[] = [
  {
    title: 'App Appearance',
    icon: 'settings',
    onPress: () => {
      router.push('/settings/appearance')
    }
  },
  {
    title: 'Data & Analytics',
    icon: 'database',
    onPress: () => {
      router.push('/settings/data-management')
    }
  },
  {
    title: 'Info',
    icon: 'info',
    onPress: () => {
      router.push('/settings/info')
    }
  }
]

const Page = () => {
  const insets = useSafeAreaInsets()
  const theme = useColorScheme()

  const SettingsItem = ({ title, onPress, icon }: SettingsItem) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.listItem, { opacity: pressed ? 0.5 : 1 }]}
        onPress={onPress}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Icon name={icon} color={Colors[theme].text} />
          <ThemedText type="subtitle">{title}</ThemedText>
        </View>
        <Icon name={'chevron-right'} color={Colors[theme].text} />
      </Pressable>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View entering={FadeInUp}>
        <Header title="Settings" showLogo />
      </Animated.View>
      <Animated.View
        style={[styles.box, { backgroundColor: Colors[theme].secondary }]}
        entering={FadeInDown}
      >
        {settingsItems.map((item, index) => (
          <SettingsItem key={index} onPress={item.onPress} title={item.title} icon={item.icon} />
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
