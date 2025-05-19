import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import BottomSheetRN, { BottomSheetView } from '@gorhom/bottom-sheet'
import React, { forwardRef, useImperativeHandle } from 'react'
import { StyleSheet } from 'react-native'
import CustomBackdrop from './CustomBackdrop'

interface Props {
  children?: React.ReactNode
}

const BottomSheet = forwardRef<BottomSheetRN, Props>(function BottomSheet({ children }, ref) {
  const theme = useColorScheme()
  const bottomSheetRef = React.useRef<BottomSheetRN | null>(null)
  useImperativeHandle(ref, () => bottomSheetRef.current!, [bottomSheetRef])

  return (
    <BottomSheetRN
      ref={bottomSheetRef}
      backgroundStyle={{ backgroundColor: Colors[theme].background }}
      handleIndicatorStyle={{ backgroundColor: Colors[theme].text }}
      index={-1}
      enablePanDownToClose
      animationConfigs={{ duration: 200 }}
      backdropComponent={CustomBackdrop}
    >
      <BottomSheetView style={styles.bottomSheetView}>{children}</BottomSheetView>
    </BottomSheetRN>
  )
})

export default BottomSheet

const styles = StyleSheet.create({
  bottomSheetView: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    paddingTop: 20
  }
})
