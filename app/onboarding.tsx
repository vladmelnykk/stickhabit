import ScalePressable from '@/components/ui/ScalePressable'
import ThemedButton from '@/components/ui/ThemedButton'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors } from '@/constants/Colors'
import { CONTAINER_PADDING, WINDOW_WIDTH } from '@/constants/global'
import { ONBOARDING_PAGES } from '@/constants/onboarding'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useStore } from '@/store/store'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const PAGINATION_WIDTH = 10
const PAGINATION_GAP = 8

const inputRange = Array.from(
  { length: ONBOARDING_PAGES.length * 2 - 1 },
  (_, i) => (i / 2) * WINDOW_WIDTH
)
const outputRange = Array.from({ length: ONBOARDING_PAGES.length * 2 - 1 }, (_, i) =>
  i % 2 === 0
    ? (PAGINATION_WIDTH + PAGINATION_GAP) * (i / 2)
    : (PAGINATION_WIDTH + PAGINATION_GAP) * Math.floor(i / 2)
)

const Page = () => {
  const insets = useSafeAreaInsets()
  const theme = useColorScheme()
  const { t } = useTranslation()
  const setOnBoardingCompleted = useStore(state => state.setOnBoardingCompleted)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const flatListRef = React.useRef<Animated.FlatList<(typeof ONBOARDING_PAGES)[0]>>(null)
  const offsetX = useSharedValue(0)
  const isLastPage = activeIndex === ONBOARDING_PAGES.length - 1

  const scrollHandler = useAnimatedScrollHandler(event => {
    offsetX.value = event.contentOffset.x
  })
  const animatedStyle = useAnimatedStyle(() => {
    const pageOffset = offsetX.value % WINDOW_WIDTH

    const translateX = interpolate(offsetX.value, inputRange, outputRange)
    const width = interpolate(
      pageOffset,
      [0, WINDOW_WIDTH / 2, WINDOW_WIDTH],
      [PAGINATION_WIDTH, PAGINATION_WIDTH * 2 + PAGINATION_GAP, PAGINATION_WIDTH]
    )

    return { width, transform: [{ translateX }] }
  })

  const handleNextPage = () => {
    if (isLastPage) {
      setOnBoardingCompleted(true)
    } else {
      setActiveIndex(prev => Math.min(prev + 1, ONBOARDING_PAGES.length - 1))
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true })
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.skipContainer}>
        <ScalePressable
          onPress={() => {
            setOnBoardingCompleted(true)
          }}
        >
          <ThemedText type="defaultSemiBold">{t('onboarding.skip')}</ThemedText>
        </ScalePressable>
      </View>
      <View style={styles.boardingContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={ONBOARDING_PAGES}
          style={styles.flatList}
          horizontal
          bounces={false}
          overScrollMode="never"
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          scrollEnabled={false}
          renderItem={({ item }) => {
            return (
              <View style={styles.itemContainer}>
                <View style={styles.imageContainer}>
                  <Image style={styles.image} source={item.image} resizeMode="contain" />
                </View>
                <View style={styles.textContainer}>
                  <ThemedText style={styles.textCenter} type="title">
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.textCenter}>{item.description}</ThemedText>
                </View>
              </View>
            )
          }}
        />
        <View style={styles.paginationContainer}>
          <View style={styles.indicatorContainer}>
            {ONBOARDING_PAGES.map((_, index) => (
              <View
                key={index}
                style={[styles.indicator, { backgroundColor: Colors[theme].accent }]}
              />
            ))}
            <Animated.View
              style={[
                styles.activeIndicator,
                { backgroundColor: Colors[theme].tint },
                animatedStyle
              ]}
            />
          </View>
        </View>
      </View>
      <View
        style={[
          styles.btnContainer,
          { paddingVertical: insets.bottom + 16, borderTopColor: Colors[theme].textSecondary }
        ]}
      >
        <ThemedButton
          style={styles.button}
          title={isLastPage ? t('onboarding.getStarted') : t('onboarding.next')}
          primary
          onPress={handleNextPage}
        />
      </View>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: { flex: 1 },
  boardingContainer: { flex: 1 },
  flatList: { flex: 1 },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  skipContainer: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16 },
  button: { flex: 1 },
  activeIndicator: {
    width: 28,
    height: 10,
    borderRadius: 100,
    position: 'absolute',
    left: 0
  },
  indicator: {
    width: PAGINATION_WIDTH,
    height: PAGINATION_WIDTH,
    borderRadius: PAGINATION_WIDTH
  },
  indicatorContainer: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: PAGINATION_GAP
  },
  paginationContainer: {
    alignItems: 'center'
  },
  itemContainer: {
    flex: 1,
    gap: 8,
    width: WINDOW_WIDTH,
    paddingHorizontal: CONTAINER_PADDING
  },
  imageContainer: {
    maxHeight: '80%',
    flexShrink: 1,
    flexGrow: 1,
    width: '100%'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  textContainer: {
    alignItems: 'center',
    gap: 8
  },
  textCenter: { textAlign: 'center' }
})
