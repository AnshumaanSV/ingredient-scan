import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { useColorScheme } from "react-native";
import { Gradients } from "@/constants/Colors";
import { CustomGradient } from "./CustomGradient";

type GradientType = keyof typeof Gradients;

interface GradientBackgroundProps {
  type?: GradientType;
  style?: ViewStyle;
  children?: React.ReactNode;
  intensity?: number; // 0 to 1, controls opacity
  angle?: number; // in degrees
}

export function GradientBackground({
  type = "primary",
  style,
  children,
  intensity = 1,
  angle = 135,
}: GradientBackgroundProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Gradients[type][colorScheme].map((color) => {
    // If intensity is less than 1, we'll make the gradient more transparent
    if (intensity < 1) {
      // Extract the hex color and convert to rgba with the specified intensity
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${intensity})`;
    }
    return color;
  });

  // Convert angle to start and end points
  const angleRad = (angle - 90) * (Math.PI / 180);
  const startX = 0.5 + 0.5 * Math.cos(angleRad);
  const startY = 0.5 + 0.5 * Math.sin(angleRad);
  const endX = 0.5 - 0.5 * Math.cos(angleRad);
  const endY = 0.5 - 0.5 * Math.sin(angleRad);

  return (
    <CustomGradient
      colors={colors}
      style={{
        ...styles.gradient,
        ...(style as any),
      }}
      start={{ x: startX, y: startY }}
      end={{ x: endX, y: endY }}
    >
      {children}
    </CustomGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    borderRadius: 8,
  },
});
