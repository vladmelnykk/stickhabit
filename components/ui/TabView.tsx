import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { StyleSheet } from 'react-native'
import { TabBar, TabView as TabViewRN } from 'react-native-tab-view'

// const MARGIN_HORIZONTAL = 20

const TabView = ({
  navigationState,
  renderScene,
  onIndexChange,
  style,
  ...rest
}: React.ComponentProps<typeof TabViewRN>) => {
  const theme = useColorScheme()

  return (
    <TabViewRN
      navigationState={navigationState}
      renderScene={renderScene}
      onIndexChange={onIndexChange}
      commonOptions={{ labelStyle: { fontFamily: FontFamily.RobotoSemiBold } }}
      style={[styles.container, style]}
      renderTabBar={props => (
        <TabBar
          {...props}
          style={[
            styles.tabBar,
            {
              backgroundColor: Colors[theme].secondary
            }
          ]}
          indicatorStyle={[
            styles.indicator,
            {
              backgroundColor: Colors[theme].tint
            }
          ]}
          activeColor={Colors[theme].text}
          inactiveColor={Colors[theme].text}
          android_ripple={{ foreground: true }}
        />
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
    // marginHorizontal: MARGIN_HORIZONTAL
  },
  indicator: {
    height: '100%',
    borderRadius: 8
  }
})
