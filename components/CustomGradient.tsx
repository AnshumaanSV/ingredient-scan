import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CustomGradientProps {
  colors: string[];
  style?: ViewStyle;
  pointerEvents?: "box-none" | "none" | "box-only" | "auto";
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
  children?: React.ReactNode;
}

export function CustomGradient({
  colors,
  style,
  pointerEvents,
  start,
  end,
  locations,
  children,
}: CustomGradientProps) {
  // Ensure we have at least 2 colors
  const gradientColors =
    colors.length >= 2 ? colors : [...colors, colors[0] || "#FFFFFF"];

  // Cast to any to bypass the type checking issues
  const props: any = {
    colors: gradientColors,
    style,
    pointerEvents,
    start,
    end,
  };

  // Only add locations if provided
  if (locations) {
    props.locations = locations;
  }

  return <LinearGradient {...props}>{children}</LinearGradient>;
}
