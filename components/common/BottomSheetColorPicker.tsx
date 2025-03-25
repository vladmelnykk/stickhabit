import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import React, { forwardRef, useImperativeHandle } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import ColorPicker, { HueSlider, Panel1, Preview } from 'reanimated-color-picker'
import ThemedButton from '../ui/ThemedButton'
import CustomBackdrop from './CustomBackdrop'

interface Props {
  setColor: React.Dispatch<React.SetStateAction<string | null>>
}

const BottomSheetColorPicker = forwardRef<BottomSheet, Props>(function BottomSheetColorPicker(
  { setColor },
  ref
) {
  const theme = useColorScheme()

  const pickedColor = useSharedValue<string | null>(null)

  const bottomSheetRef = React.useRef<BottomSheet | null>(null)
  useImperativeHandle(ref, () => bottomSheetRef.current!, [bottomSheetRef])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      backgroundStyle={{ backgroundColor: Colors[theme].background }}
      handleIndicatorStyle={{ backgroundColor: Colors[theme].text }}
      index={-1}
      enablePanDownToClose
      animationConfigs={{ duration: 200 }}
      backdropComponent={CustomBackdrop}
    >
      <BottomSheetView style={styles.bottomSheetView}>
        <ThemedButton
          title="Pick"
          style={styles.button}
          onPress={() => {
            setColor(pickedColor.value)
            bottomSheetRef.current?.close()
          }}
        />
        <ColorPicker
          style={styles.colorPicker}
          onComplete={color => {
            pickedColor.value = color.hex
          }}
        >
          <Preview hideInitialColor style={{ borderEndEndRadius: 0, borderStartEndRadius: 0 }} />
          <View style={styles.colorContainer}>
            <Panel1 boundedThumb style={styles.colorPanel} />
            <HueSlider boundedThumb vertical thumbShape="rect" thumbInnerStyle={{ height: 8 }} />
          </View>
        </ColorPicker>
      </BottomSheetView>
    </BottomSheet>
  )
})

export default React.memo(BottomSheetColorPicker)

const styles = StyleSheet.create({
  bottomSheetView: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    alignItems: 'center'
  },
  colorPicker: { width: '85%' },
  colorContainer: { flexDirection: 'row', gap: 4 },
  colorPanel: { flex: 1 },
  button: { width: '100%', marginBottom: 20 }
})
