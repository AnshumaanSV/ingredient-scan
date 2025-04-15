import React from "react";
import {
  StyleSheet,
  ViewStyle,
  Pressable,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { GradientBackground } from "./GradientBackground";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  withShadow?: boolean;
  withGradient?: boolean;
  gradientType?: "primary" | "accent" | "success" | "warning" | "card";
  gradientIntensity?: number;
  gradientAngle?: number;
  disabled?: boolean;
  withAnimation?: boolean;
}

export function AnimatedCard({
  children,
  style,
  onPress,
  withShadow = true,
  withGradient = false,
  gradientType = "card",
  gradientIntensity = 1,
  gradientAngle = 135,
  disabled = false,
  withAnimation = true,
}: AnimatedCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const isInteractive = !!onPress && !disabled;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    if (!isInteractive || !withAnimation) return;

    scale.value = withSpring(0.98, {
      damping: 10,
      stiffness: 200,
    });
    translateY.value = withSpring(2, {
      damping: 10,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    if (!isInteractive || !withAnimation) return;

    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 200,
    });
    translateY.value = withSpring(0, {
      damping: 10,
      stiffness: 200,
    });
  };

  const getShadowStyle = (): ViewStyle => {
    if (!withShadow) return {};

    return colorScheme === "light"
      ? {
          shadowColor: Colors.light.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 5,
        }
      : {
          shadowColor: Colors.dark.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 5,
        };
  };

  const Container = isInteractive ? AnimatedPressable : Animated.View;
  const containerProps = isInteractive
    ? {
        onPress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        disabled,
      }
    : {};

  const renderContent = () => {
    if (withGradient) {
      return (
        <GradientBackground
          type={gradientType}
          intensity={gradientIntensity}
          angle={gradientAngle}
          style={styles.contentContainer}
        >
          {children}
        </GradientBackground>
      );
    }

    return (
      <View
        style={[
          styles.contentContainer,
          { backgroundColor: Colors[colorScheme].card },
        ]}
      >
        {children}
      </View>
    );
  };

  return (
    <Container
      style={[
        styles.card,
        getShadowStyle(),
        withAnimation ? animatedStyle : undefined,
        style,
      ]}
      {...containerProps}
    >
      {renderContent()}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 8,
  },
  contentContainer: {
    padding: 16,
    borderRadius: 16,
  },
});
