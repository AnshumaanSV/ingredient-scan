import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, useColorScheme, View, Dimensions } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  Extrapolation,
  withTiming,
  useSharedValue,
  withDelay,
  withSequence,
  withRepeat,
} from "react-native-reanimated";
import React, { useEffect } from "react";
import { CustomGradient } from "@/components/CustomGradient";
import { Colors, Gradients } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { BlurView } from "expo-blur";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HEADER_HEIGHT = 100;
const HEADER_IMAGE_HEIGHT = 280;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor?: { dark: string; light: string };
  headerTitle?: string;
  headerTitleComponent?: ReactElement;
  withBlurEffect?: boolean;
  withFloatingHeader?: boolean;
  withParallaxEffect?: boolean;
  withGradientOverlay?: boolean;
  gradientOverlayColors?: string[];
  gradientOverlayOpacity?: number;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  headerTitle,
  headerTitleComponent,
  withBlurEffect = true,
  withFloatingHeader = true,
  withParallaxEffect = true,
  withGradientOverlay = true,
  gradientOverlayColors,
  gradientOverlayOpacity = 0.6,
}: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  // Animation values
  const headerScale = useSharedValue(1);
  const headerOpacity = useSharedValue(1);
  const contentTranslateY = useSharedValue(50);
  const contentOpacity = useSharedValue(0);

  // Entry animations
  useEffect(() => {
    // Subtle pulse animation for the header
    headerScale.value = withSequence(
      withTiming(1.03, { duration: 800 }),
      withTiming(1, { duration: 800 }),
    );

    // Fade in content with a slight delay
    contentOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    contentTranslateY.value = withDelay(300, withTiming(0, { duration: 600 }));
  }, []);

  // Header parallax and opacity animations based on scroll
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollOffset.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.4],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      scrollOffset.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [1.2, 1, 1.05],
      Extrapolation.CLAMP,
    );

    return {
      transform: withParallaxEffect
        ? [{ translateY }, { scale: scale * headerScale.value }]
        : [{ scale: headerScale.value }],
      opacity: headerOpacity.value,
    };
  });

  // Gradient overlay animation
  const gradientAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, HEADER_HEIGHT],
      [gradientOverlayOpacity, gradientOverlayOpacity + 0.2],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
    };
  });

  // Content animation
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: contentTranslateY.value }],
      opacity: contentOpacity.value,
    };
  });

  // Get gradient colors based on theme
  const getGradientColors = () => {
    if (gradientOverlayColors && gradientOverlayColors.length >= 2) {
      // If custom colors are provided, use the first two at minimum
      return [
        gradientOverlayColors[0],
        gradientOverlayColors[1],
        ...(gradientOverlayColors.slice(2) || []),
      ];
    }

    // Default colors based on theme
    return colorScheme === "dark"
      ? ["rgba(26, 27, 30, 0)", "rgba(26, 27, 30, 0.8)", "rgba(26, 27, 30, 1)"]
      : [
          "rgba(255, 255, 255, 0)",
          "rgba(255, 255, 255, 0.8)",
          "rgba(255, 255, 255, 1)",
        ];
  };

  // Default header background color if not provided
  const defaultHeaderBgColor = {
    light: Colors.light.backgroundSecondary,
    dark: Colors.dark.backgroundSecondary,
  };

  const headerBgColor = headerBackgroundColor || defaultHeaderBgColor;

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Image with Parallax Effect */}
        <View style={styles.headerContainer}>
          <Animated.View
            style={[
              styles.header,
              { backgroundColor: headerBgColor[colorScheme] },
              headerAnimatedStyle,
            ]}
          >
            {headerImage}

            {/* Gradient Overlay */}
            {withGradientOverlay && (
              <Animated.View
                style={[styles.gradientContainer, gradientAnimatedStyle]}
              >
                <CustomGradient
                  colors={getGradientColors()}
                  style={styles.gradient}
                  pointerEvents="none"
                />
              </Animated.View>
            )}
          </Animated.View>
        </View>

        {/* Content */}
        <Animated.View style={[styles.contentWrapper, contentAnimatedStyle]}>
          <ThemedView style={styles.content}>{children}</ThemedView>
        </Animated.View>
      </Animated.ScrollView>

      {/* Optional Floating Header with Blur Effect */}
      {withFloatingHeader && (
        <Animated.View
          style={[
            styles.floatingHeaderContainer,
            {
              opacity: interpolate(
                scrollOffset.value,
                [0, 60, 120],
                [0, 0.5, 1],
                Extrapolation.CLAMP,
              ),
              transform: [
                {
                  translateY: interpolate(
                    scrollOffset.value,
                    [0, 120],
                    [-20, 0],
                    Extrapolation.CLAMP,
                  ),
                },
              ],
            },
          ]}
        >
          {withBlurEffect ? (
            <BlurView intensity={80} tint={colorScheme} style={styles.blurView}>
              {headerTitleComponent || (
                <Animated.Text
                  style={[
                    styles.headerTitle,
                    { color: Colors[colorScheme].text },
                  ]}
                >
                  {headerTitle || "Ingredient Scan"}
                </Animated.Text>
              )}
            </BlurView>
          ) : (
            <View
              style={[
                styles.nonBlurHeader,
                { backgroundColor: Colors[colorScheme].background },
              ]}
            >
              {headerTitleComponent || (
                <Animated.Text
                  style={[
                    styles.headerTitle,
                    { color: Colors[colorScheme].text },
                  ]}
                >
                  {headerTitle || "Ingredient Scan"}
                </Animated.Text>
              )}
            </View>
          )}
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    height: HEADER_IMAGE_HEIGHT,
    zIndex: 1,
  },
  header: {
    height: HEADER_IMAGE_HEIGHT,
    overflow: "hidden",
  },
  gradientContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  gradient: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    marginTop: -40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    zIndex: 2,
  },
  content: {
    flex: 1,
    padding: 32,
    paddingTop: 40,
    gap: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  floatingHeaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
  },
  blurView: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  nonBlurHeader: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
});
