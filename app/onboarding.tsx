import ScalePressable from '@/components/ui/ScalePressable'
import ThemedButton from '@/components/ui/ThemedButton'
import { ThemedText } from '@/components/ui/ThemedText'
import { Colors } from '@/constants/Colors'
import { CONTAINER_PADDING, WINDOW_WIDTH } from '@/constants/global'
import { ONBOARDING_PAGES } from '@/constants/onbording'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useStore } from '@/store/store'
import React from 'react'
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
      <ScalePressable
        style={[styles.skipButton, { top: insets.top + 16 }]}
        onPress={() => {
          setOnBoardingCompleted(true)
        }}
      >
        <ThemedText type="defaultSemiBold">Skip</ThemedText>
      </ScalePressable>
      <View style={styles.boardingContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={ONBOARDING_PAGES}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
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
                <Image
                  style={{ width: WINDOW_WIDTH, height: 300 }}
                  source={{
                    uri: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D'
                  }}
                />
                <ThemedText type="title">{item.title}</ThemedText>
                <ThemedText style={{ textAlign: 'center' }}>{item.description}</ThemedText>
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
          title={isLastPage ? 'Get Started' : 'Next'}
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
  flatListContent: { justifyContent: 'center', alignItems: 'center' },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  skipButton: { position: 'absolute', right: 16, zIndex: 100 },
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
    width: WINDOW_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: CONTAINER_PADDING,
    gap: 16
  }
})
