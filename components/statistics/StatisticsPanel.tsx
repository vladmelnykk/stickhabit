import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ThemedText } from '../ui/ThemedText'

interface StatisticsPanelProps {
  currentStreak: number
  habitsCompleted: number
  completionRate: number
  totalPerfectDays: number
  title?: string
  frequency?: string
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  currentStreak,
  habitsCompleted,
  completionRate,
  totalPerfectDays,
  title,
  frequency
}) => {
  const theme = useColorScheme()

  return (
    <View style={styles.colContainer}>
      {title && (
        <View
          style={[styles.infoPanel, { backgroundColor: Colors[theme].secondary, paddingLeft: 16 }]}
        >
          <ThemedText type="subtitle">{title}</ThemedText>
          <ThemedText
            type="default"
            lightColor={Colors['light'].textSecondary}
            darkColor={Colors['dark'].textSecondary}
          >
            {frequency}
          </ThemedText>
        </View>
      )}
      <View style={styles.rowContainer}>
        <View style={styles.colContainer}>
          <View style={[styles.infoPanel, { backgroundColor: Colors[theme].secondary }]}>
            <ThemedText type="subtitle">{currentStreak}</ThemedText>
            <ThemedText type="default">Current streak</ThemedText>
          </View>
          <View style={[styles.infoPanel, , { backgroundColor: Colors[theme].secondary }]}>
            <ThemedText type="subtitle">{habitsCompleted}</ThemedText>
            <ThemedText type="default">Habits completed</ThemedText>
          </View>
        </View>
        <View style={styles.colContainer}>
          <View style={[styles.infoPanel, , { backgroundColor: Colors[theme].secondary }]}>
            <ThemedText type="subtitle">{completionRate.toFixed(2)}%</ThemedText>
            <ThemedText type="default">Completion rate</ThemedText>
          </View>
          <View style={[styles.infoPanel, , { backgroundColor: Colors[theme].secondary }]}>
            <ThemedText type="subtitle">{totalPerfectDays}</ThemedText>
            <ThemedText type="default">Total perfect days</ThemedText>
          </View>
        </View>
      </View>
    </View>
  )
}

export default React.memo(StatisticsPanel)

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  colContainer: {
    flex: 1,
    gap: 12
  },
  infoPanel: {
    width: '100%',
    minHeight: 75,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    paddingLeft: 16
  }
})
