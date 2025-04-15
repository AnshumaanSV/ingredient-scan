import React, { useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { useColorScheme } from "react-native";
import { Colors, Gradients } from "@/constants/Colors";
import { GradientBackground } from "./GradientBackground";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = "primary" | "secondary" | "accent" | "success" | "warning";

interface AnimatedButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  withShadow?: boolean;
}

export function AnimatedButton({
  onPress,
  title,
  variant = "primary",
  style,
  textStyle,
  disabled = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  size = "medium",
  withShadow = true,
}: AnimatedButtonProps) {
  const colorScheme = useColorScheme() ?? "light";
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Reset animation values when props change
  useEffect(() => {
    scale.value = 1;
    backgroundColor.value = 0;
    opacity.value = disabled ? 0.6 : 1;
  }, [disabled, variant]);

  const getGradientType = (): keyof typeof Gradients => {
    switch (variant) {
      case "primary":
        return "primary";
      case "secondary":
        return "background";
      case "accent":
        return "accent";
      case "success":
        return "success";
      case "warning":
        return "warning";
      default:
        return "primary";
    }
  };

  const getTextColor = (): string => {
    if (variant === "secondary") {
      return Colors[colorScheme].text;
    }
    return "#FFFFFF";
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    if (disabled) return;

    scale.value = withSpring(0.95, {
      damping: 10,
      stiffness: 200,
    });
    backgroundColor.value = withTiming(1, {
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  const handlePressOut = () => {
    if (disabled) return;

    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 200,
    });
    backgroundColor.value = withTiming(0, {
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case "small":
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
      case "large":
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 10,
        };
    }
  };

  const getTextSize = (): TextStyle => {
    switch (size) {
      case "small":
        return { fontSize: 14 };
      case "large":
        return { fontSize: 18 };
      default:
        return { fontSize: 16 };
    }
  };

  const getShadowStyle = (): ViewStyle => {
    if (!withShadow) return {};

    return colorScheme === "light"
      ? {
          shadowColor: Colors.light.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }
      : {
          shadowColor: Colors.dark.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          elevation: 5,
        };
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        getSizeStyles(),
        getShadowStyle(),
        fullWidth && styles.fullWidth,
        animatedStyle,
        style,
      ]}
    >
      <GradientBackground
        type={getGradientType()}
        style={{
          ...styles.gradient,
          ...getSizeStyles(),
        }}
      >
        {icon && iconPosition === "left" && icon}
        <Text
          style={[
            styles.text,
            getTextSize(),
            { color: getTextColor() },
            textStyle,
          ]}
        >
          {title}
        </Text>
        {icon && iconPosition === "right" && icon}
      </GradientBackground>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    overflow: "hidden",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  fullWidth: {
    alignSelf: "stretch",
  },
});
