import React from 'react'
import { StyleSheet, View } from 'react-native'
import ColorPicker, { Swatches } from 'reanimated-color-picker'

const Page = () => {
  return (
    <View style={{ flex: 1, gap: 8, alignItems: 'center', justifyContent: 'center' }}>
      <ColorPicker style={{ width: '70%' }} value="red">
        {/* <Preview /> */}
        {/* <Panel1 /> */}
        {/* <HueSlider /> */}
        {/* <OpacitySlider /> */}
        <Swatches
          swatchStyle={{ width: 50, height: 50, borderRadius: 50 }}
          colors={['#ff0000', '#00ff00', '#0000ff']}
        />
      </ColorPicker>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({})
