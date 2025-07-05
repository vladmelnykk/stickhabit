import { Colors } from '@/constants/Colors'
import { CONTAINER_PADDING } from '@/constants/global'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TabBar, TabView as TabViewRN } from 'react-native-tab-view'

const TabView = ({
  navigationState,
  renderScene,
  onIndexChange,
  style,
  handleTabPress,
  ...rest
}: React.ComponentProps<typeof TabViewRN> & { handleTabPress?: (routeKey: string) => void }) => {
  const theme = useColorScheme()

  return (
    <TabViewRN
      navigationState={navigationState}
      renderScene={renderScene}
      onIndexChange={onIndexChange}
      style={[styles.container, style]}
      renderTabBar={props => (
        <View style={styles.verticalOffset}>
          <TabBar
            {...props}
            style={[styles.tabBar, { backgroundColor: Colors[theme].secondary }]}
            indicatorStyle={[styles.indicator, { backgroundColor: Colors[theme].tint }]}
            activeColor={Colors[theme].text}
            inactiveColor={Colors[theme].text}
            android_ripple={{ foreground: true }}
            onTabPress={({ route }) => {
              handleTabPress?.(route.key)
            }}
          />
        </View>
      )}
      {...rest}
    />
  )
}

export default TabView

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBar: {
    overflow: 'hidden',
    elevation: 0,
    shadowColor: 'transparent',
    borderRadius: 8
  },
  verticalOffset: {
    paddingHorizontal: CONTAINER_PADDING
  },
  indicator: {
    height: '100%',
    borderRadius: 8
  }
})
