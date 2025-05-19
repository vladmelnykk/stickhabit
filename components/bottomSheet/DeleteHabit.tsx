import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Icon from '../ui/Icon'
import { ThemedText } from '../ui/ThemedText'
import BottomSheetHeader from './BottomSheetHeader'

const KEEP_COLOR = '#FF981F'
const CLEAR_COLOR = '#F85757'

interface DeleteHabitProps {
  onDeleteAndKeep: () => void
  onDeleteAndClear: () => void
}

const DeleteHabit: React.FC<DeleteHabitProps> = ({ onDeleteAndKeep, onDeleteAndClear }) => {
  const theme = useColorScheme()

  return (
    <View style={styles.container}>
      <BottomSheetHeader title="Delete this Habit?" titleStyle={styles.dangerText} />
      <Pressable
        onPress={onDeleteAndKeep}
        style={[
          styles.button,
          { backgroundColor: Colors[theme].secondary, borderColor: Colors[theme].accent }
        ]}
      >
        <Icon name="archive" color={KEEP_COLOR} />
        <ThemedText>Delete Habit & Keep History</ThemedText>
      </Pressable>
      <Pressable
        onPress={onDeleteAndClear}
        style={[
          styles.button,
          { backgroundColor: Colors[theme].secondary, borderColor: Colors[theme].accent }
        ]}
      >
        <Icon name="trash-2" color={CLEAR_COLOR} />
        <ThemedText>Delete Habit & Clear History</ThemedText>
      </Pressable>
    </View>
  )
}

export default DeleteHabit

const styles = StyleSheet.create({
  container: { alignItems: 'center', textAlign: 'center', gap: 20 },
  dangerText: {
    color: CLEAR_COLOR
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center'
  }
})
