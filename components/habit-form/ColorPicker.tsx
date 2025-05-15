import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import ColorPickerRN, { HueSlider, Panel1, Preview } from 'reanimated-color-picker'
import ThemedButton from '../ui/ThemedButton'
interface Props {
  onPickColor: (pickedColor: string | null) => void
}

const ColorPicker: React.FC<Props> = ({ onPickColor }) => {
  const pickedColor = useSharedValue<string | null>(null)

  return (
    <View style={styles.container}>
      <ThemedButton
        title="Pick"
        style={styles.button}
        onPress={() => {
          onPickColor(pickedColor.value)
        }}
      />
      <ColorPickerRN
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
      </ColorPickerRN>
    </View>
  )
}

export default React.memo(ColorPicker)

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  colorPicker: { width: '85%' },
  colorContainer: { flexDirection: 'row', gap: 4 },
  colorPanel: { flex: 1 },
  button: { width: '100%', marginBottom: 20 }
})
