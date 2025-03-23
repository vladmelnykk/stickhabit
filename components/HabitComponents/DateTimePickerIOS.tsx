import DateTimePicker from '@react-native-community/datetimepicker'
import React from 'react'
import { Button, StyleSheet, View } from 'react-native'

interface DateTimePickerIOSProps {
  date: Date | null
  onChange: React.ComponentProps<typeof DateTimePicker>['onChange']
  toggleDatePicker: () => void
  confirmDate: () => void
}

const HEIGHT = 80

const DateTimePickerIOS: React.FC<DateTimePickerIOSProps> = ({
  date,
  onChange,
  toggleDatePicker,
  confirmDate
}) => {
  return (
    <View>
      <View style={styles.pickerContainer}>
        <DateTimePicker
          onChange={onChange}
          value={date || new Date()}
          mode="time"
          is24Hour
          display="spinner"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={toggleDatePicker} />
        <Button title="Confirm" onPress={confirmDate} />
      </View>
    </View>
  )
}

export default DateTimePickerIOS

const styles = StyleSheet.create({
  pickerContainer: {
    height: HEIGHT,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})
