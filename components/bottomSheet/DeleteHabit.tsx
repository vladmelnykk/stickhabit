import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'
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
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onDeleteAndKeep}
        style={[
          styles.button,
          { backgroundColor: Colors[theme].secondary, borderColor: Colors[theme].accent }
        ]}
      >
        <Icon name="archive" color={KEEP_COLOR} />
        <ThemedText>{t('habit.edit.archive')}</ThemedText>
      </Pressable>
      <Pressable
        onPress={onDeleteAndClear}
        style={[
          styles.button,
          { backgroundColor: Colors[theme].secondary, borderColor: Colors[theme].accent }
        ]}
      >
        <Icon name="trash-2" color={CLEAR_COLOR} />
        <ThemedText>{t('habit.edit.delete')}</ThemedText>
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
