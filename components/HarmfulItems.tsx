import { HarmfulItem } from "@/constants/types";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
  useColorScheme,
} from "react-native";
import { ThemedText } from "./ThemedText";
import React, { useEffect } from "react";
import { AnimatedCard } from "./AnimatedCard";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
  SlideInRight,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ANIMATION_DELAY_BASE = 150; // Base delay between item animations

interface HarmfulItemsProps {
  harmfulItems: HarmfulItem[];
  loading: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function HarmfulItems({ harmfulItems, loading }: HarmfulItemsProps) {
  const colorScheme = useColorScheme() ?? "light";
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  // Pulse animation for the loading indicator
  useEffect(() => {
    if (loading) {
      scale.value = withSequence(
        withTiming(1.1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.9, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.9, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      );
    } else {
      scale.value = 1;
    }
  }, [loading]);

  // Fade in animation for the results
  useEffect(() => {
    if (harmfulItems.length > 0 && !loading) {
      opacity.value = withTiming(1, { duration: 500 });
    } else {
      opacity.value = 0;
    }
  }, [harmfulItems, loading]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const resultsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  if (loading) {
    return (
      <AnimatedView style={[styles.loadingContainer, animatedStyle]}>
        <ActivityIndicator
          size="large"
          color={
            colorScheme === "dark" ? Colors.dark.accent : Colors.light.accent
          }
        />
        <ThemedText style={styles.loadingText}>
          Analyzing ingredients...
        </ThemedText>
      </AnimatedView>
    );
  }

  if (!harmfulItems.length) {
    return null;
  }

  const isErrorMessage = harmfulItems[0].itemName === "Please try again.";

  return (
    <AnimatedView style={resultsAnimatedStyle}>
      {!isErrorMessage && (
        <Animated.View entering={FadeIn.duration(600)}>
          <AnimatedCard
            withGradient={true}
            gradientType="warning"
            gradientIntensity={0.9}
            style={styles.resultsSummaryCard}
          >
            <View style={styles.resultsSummaryContent}>
              <Ionicons
                name="warning"
                size={28}
                color="#FFFFFF"
                style={styles.warningIcon}
              />
              <View>
                <Text style={styles.resultsSummaryText}>
                  <Text style={styles.resultCount}>{harmfulItems.length}</Text>
                  <Text style={styles.resultsSummaryTextContent}>
                    {" harmful " +
                      (harmfulItems.length === 1
                        ? "ingredient"
                        : "ingredients")}{" "}
                    detected
                  </Text>
                </Text>
                <Text style={styles.resultsSummarySubtext}>
                  Tap each item to learn more
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </Animated.View>
      )}

      <View style={styles.itemsContainer}>
        {harmfulItems.map((item, index) => {
          // Calculate delay based on index for staggered animation
          const delay = ANIMATION_DELAY_BASE * index;

          return (
            <Animated.View
              key={item.itemName + index}
              entering={FadeInDown.duration(400).delay(delay)}
            >
              <AnimatedCard
                style={styles.itemCard}
                withShadow={true}
                withGradient={false}
              >
                <View style={styles.itemHeader}>
                  <ThemedText style={styles.itemName} type="subtitle">
                    {item.itemName}
                  </ThemedText>
                  <View style={styles.severityIndicator} />
                </View>
                <ThemedText style={styles.itemDescription}>
                  {item.description}
                </ThemedText>
              </AnimatedCard>
            </Animated.View>
          );
        })}
      </View>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.8,
  },
  resultsSummaryCard: {
    marginVertical: 16,
    padding: 0,
  },
  resultsSummaryContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  warningIcon: {
    marginRight: 12,
  },
  resultsSummaryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  resultCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  resultsSummaryTextContent: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  resultsSummarySubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  itemsContainer: {
    marginTop: 8,
  },
  itemCard: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontWeight: "700",
    fontSize: 18,
    color: Colors.light.accent,
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.warning,
  },
  itemDescription: {
    lineHeight: 22,
  },
});
