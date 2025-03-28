import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'

interface DateTimePickerIOSProps {
  // date: Date | null
  // onChange: React.ComponentProps<typeof DateTimePicker>['onChange']
  toggleDatePicker: () => void
  confirmDate: (date: Date | null) => void
}

const HEIGHT = 80

const DateTimePickerIOS: React.FC<DateTimePickerIOSProps> = ({
  // onChange,
  toggleDatePicker,
  confirmDate
}) => {
  const [date, setDate] = useState<Date | null>(new Date())

  const handleDateChangeIOS: React.ComponentProps<typeof DateTimePicker>['onChange'] = (
    { type },
    date
  ) => {
    if (type === 'set' && date) {
      setDate(date)
    }
  }

  return (
    <View>
      <View style={styles.pickerContainer}>
        <DateTimePicker
          onChange={handleDateChangeIOS}
          value={date || new Date()}
          mode="time"
          is24Hour
          display="spinner"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={toggleDatePicker} />
        <Button title="Confirm" onPress={() => confirmDate(date)} />
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
