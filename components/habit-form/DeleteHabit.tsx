import { Colors } from '@/constants/Colors'
import { FontFamily } from '@/constants/FontFamily'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Icon from '../ui/Icon'
import { ThemedText } from '../ui/ThemedText'

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
      <Text style={styles.dangerText}>Delete this Habit?</Text>
      <View style={[styles.line, { backgroundColor: Colors[theme].accent }]} />
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
    fontSize: 24,
    fontFamily: FontFamily.RobotoBold,
    color: CLEAR_COLOR
  },
  line: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    borderRadius: 8
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
