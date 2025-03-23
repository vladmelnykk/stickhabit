import React from 'react'
import { StyleSheet, View } from 'react-native'
import ColorPicker, { HueSlider, OpacitySlider, Panel1, Preview, Swatches } from 'reanimated-color-picker'

const Page = () => {
  return (
    <View style={{ flex: 1, gap: 8, alignItems: 'center', justifyContent: 'center' }}>
      <ColorPicker style={{ width: '70%' }} value='red' >
          <Preview />
          <Panel1 />
          <HueSlider />
          <OpacitySlider />
          <Swatches />
        </ColorPicker>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({})
