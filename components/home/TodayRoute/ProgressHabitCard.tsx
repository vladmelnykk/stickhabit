import { FontFamily } from '@/constants/FontFamily'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

interface HabitCardProps {
  color: string
  title: string
  progress: number
  goal: number
}

const ProgressHabitCard: React.FC<HabitCardProps> = ({ title, color, goal, progress }) => {
  const { t } = useTranslation()
  return (
    <View style={[styles.container, { backgroundColor: color || '#fff' }]}>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      <Text style={styles.progress}>
        {t('home.progress')} {progress} / {goal}
      </Text>
    </View>
  )
}

export default React.memo(ProgressHabitCard)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 4,
    borderRadius: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FontFamily.RobotoBold
  },
  progress: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FontFamily.RobotoRegular
  }
})
