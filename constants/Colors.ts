/**
 * Enhanced color palette for the app with vibrant colors and gradients.
 * This modern palette provides a visually striking experience in both light and dark modes.
 */

// Primary colors
const primaryLight = "#4E54C8"; // Vibrant purple-blue
const primaryDark = "#8F94FB"; // Lighter purple for dark mode
const accentLight = "#FF6B6B"; // Coral red accent
const accentDark = "#FF8E8E"; // Lighter coral for dark mode

// Gradient definitions
export const Gradients = {
  primary: {
    light: ["#4E54C8", "#8F94FB"], // Purple-blue gradient
    dark: ["#6A6FD3", "#9FA3FF"], // Lighter version for dark mode
  },
  accent: {
    light: ["#FF6B6B", "#FF8E8E"], // Coral gradient
    dark: ["#FF8E8E", "#FFA5A5"], // Lighter version for dark mode
  },
  success: {
    light: ["#00B09B", "#96C93D"], // Green gradient
    dark: ["#00C9B1", "#A9DC44"], // Lighter version for dark mode
  },
  warning: {
    light: ["#F9D423", "#FF4E50"], // Yellow to red gradient
    dark: ["#FFE347", "#FF7173"], // Lighter version for dark mode
  },
  background: {
    light: ["#ffffff", "#f8f9fa"], // Subtle white gradient
    dark: ["#1A1B1E", "#2C2D31"], // Dark gradient
  },
  card: {
    light: ["#ffffff", "#f0f2f5"], // Card gradient light
    dark: ["#25262B", "#2C2D33"], // Card gradient dark
  },
};

export const Colors = {
  light: {
    text: "#2D3748", // Dark slate for better readability
    textSecondary: "#718096", // Secondary text color
    background: "#FFFFFF",
    backgroundSecondary: "#F7FAFC", // Secondary background
    tint: primaryLight,
    accent: accentLight,
    icon: "#4A5568",
    tabIconDefault: "#A0AEC0",
    tabIconSelected: primaryLight,
    border: "#E2E8F0",
    card: "#FFFFFF",
    shadow: "rgba(0, 0, 0, 0.1)",
    success: "#38A169", // Green
    warning: "#DD6B20", // Orange
    error: "#E53E3E", // Red
    info: "#3182CE", // Blue
  },
  dark: {
    text: "#F7FAFC", // Very light gray for better readability
    textSecondary: "#A0AEC0", // Secondary text color
    background: "#1A1B1E",
    backgroundSecondary: "#25262B", // Secondary background
    tint: primaryDark,
    accent: accentDark,
    icon: "#CBD5E0",
    tabIconDefault: "#718096",
    tabIconSelected: primaryDark,
    border: "#2D3748",
    card: "#25262B",
    shadow: "rgba(0, 0, 0, 0.3)",
    success: "#68D391", // Light green
    warning: "#F6AD55", // Light orange
    error: "#FC8181", // Light red
    info: "#63B3ED", // Light blue
  },
};
