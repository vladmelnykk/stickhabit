import BottomSheet from '@/components/bottomSheet/BottomSheet'
import ThemePicker from '@/components/bottomSheet/ThemePicker'
import Header from '@/components/common/Header'
import Icon from '@/components/ui/Icon'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors } from '@/constants/Colors'
import { CONTAINER_PADDING } from '@/constants/global'
import { THEME_OPTIONS } from '@/constants/Theme'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useStore } from '@/store/store'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface AppearanceItem {
  title: string
  value: string
  onPress: () => void
}

const Page = () => {
  const insets = useSafeAreaInsets()
  const theme = useColorScheme()

  const selectedTheme = useStore(state => state.theme)

  const bottomSheetRef = React.useRef<BottomSheetMethods>(null)
  const appearanceItems: AppearanceItem[] = [
    {
      title: 'Theme',
      value: THEME_OPTIONS.find(({ value }) => value === selectedTheme)?.label || 'System',
      onPress: () => {
        bottomSheetRef.current?.expand()
      }
    },
    // TODO: add language support
    {
      title: 'Language',
      value: 'English',
      onPress: () => {}
    }
  ]

  const AppearanceItem = ({ title, value, onPress }: AppearanceItem) => (
    <Pressable
      onPress={onPress}
      key={title}
      style={({ pressed }) => [styles.itemContainer, { opacity: pressed ? 0.5 : 1 }]}
    >
      <ThemedText type="subtitle">{title}</ThemedText>
      <View style={styles.valueContainer}>
        <ThemedText type="default">{value}</ThemedText>
        <Icon name="chevron-right" color={Colors[theme].text} />
      </View>
    </Pressable>
  )

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: Colors[theme].background }
      ]}
    >
      <Header title="App Appearance" leftIcon="arrow-left" onLeftPress={() => router.back()} />
      <View>
        {appearanceItems.map(item => (
          <AppearanceItem key={item.title} {...item} />
        ))}
      </View>

      <BottomSheet ref={bottomSheetRef}>
        <ThemePicker />
      </BottomSheet>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    paddingHorizontal: CONTAINER_PADDING
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    gap: 8
  }
})
