import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import React from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
        <View style={[styles.infoPanel, { backgroundColor: Colors[theme].secondary }]}>
          <ThemedText type="subtitle">{currentStreak}</ThemedText>
          <ThemedText type="default">{t('statistics.currentStreak')}</ThemedText>
        </View>
        <View style={[styles.infoPanel, , { backgroundColor: Colors[theme].secondary }]}>
          <ThemedText type="subtitle">{habitsCompleted}</ThemedText>
          <ThemedText type="default">{t('statistics.habitsCompleted')}</ThemedText>
        </View>
      </View>
      <View style={styles.rowContainer}>
        <View style={[styles.infoPanel, , { backgroundColor: Colors[theme].secondary }]}>
          <ThemedText type="subtitle">{completionRate.toFixed(0)}%</ThemedText>
          <ThemedText type="default">{t('statistics.completionRate')}</ThemedText>
        </View>
        <View style={[styles.infoPanel, , { backgroundColor: Colors[theme].secondary }]}>
          <ThemedText type="subtitle">{totalPerfectDays}</ThemedText>
          <ThemedText type="default">{t('statistics.totalPerfectDays')}</ThemedText>
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
    flex: 1,
    justifyContent: 'center',
    minHeight: 75,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    paddingLeft: 16
  }
})
