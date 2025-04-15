import {
  Image,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  ToastAndroid,
  View,
  TouchableOpacity,
  useColorScheme,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState, useEffect } from "react";
import { HarmfulItem } from "@/constants/types";
import { HarmfulItems } from "@/components/HarmfulItems";
import { imagePicker, cameraCapture } from "@/core/image-picker";
import { detectHarmfulItems } from "@/core/detect-harmful-items";
import React from "react";
import { AnimatedButton } from "@/components/AnimatedButton";
import { AnimatedCard } from "@/components/AnimatedCard";
import { GradientBackground } from "@/components/GradientBackground";
import { Colors } from "@/constants/Colors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  FadeIn,
  FadeInDown,
  SlideInRight,
} from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [harmfulItems, setHarmfulItems] = useState<HarmfulItem[]>([]);

  // Animation values
  const imageScale = useSharedValue(1);
  const imageOpacity = useSharedValue(0);
  const categoryOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  // Entry animations for UI elements
  useEffect(() => {
    if (image) {
      imageOpacity.value = withTiming(1, { duration: 600 });
      imageScale.value = withSequence(
        withTiming(1.05, { duration: 300 }),
        withTiming(1, { duration: 300 }),
      );
      categoryOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    } else {
      imageOpacity.value = 0;
      categoryOpacity.value = 0;
      buttonOpacity.value = 0;
    }
  }, [image]);

  // Button animation when category is selected
  useEffect(() => {
    if (image && category) {
      buttonOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    } else {
      buttonOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [image, category]);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
      transform: [{ scale: imageScale.value }],
    };
  });

  const categoryAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: categoryOpacity.value,
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
    };
  });

  const pickImage = async () => {
    const image = await imagePicker();
    setImage(image);
  };

  const takePhoto = async () => {
    const image = await cameraCapture();
    setImage(image);
  };

  const reset = () => {
    setImage(null);
    setHarmfulItems([]);
    setLoading(false);
  };

  const checkResult = async () => {
    if (loading) {
      showNotification("Please wait!");
      return;
    }
    if (!image) {
      showNotification("Please select an image!");
      return;
    }
    if (!category) {
      showNotification("Please enter a category!");
      return;
    }

    showNotification("Processing your image...");
    setLoading(true);

    const detectedItems = await detectHarmfulItems(image, category);

    if (detectedItems) {
      setHarmfulItems(detectedItems);
    } else {
      showNotification("Cannot process image. Please try again later.");
    }

    setLoading(false);
  };

  const showNotification = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Notification", message);
    }
  };

  const selectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/coffee-girl.jpg")}
          style={styles.coverPicture}
        />
      }
      headerTitle="Ingredient Scan"
      withGradientOverlay={true}
    >
      <Animated.View entering={FadeIn.duration(800)}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Ingredient Scan</ThemedText>
          <ThemedText type="caption">Discover Safe Choices!</ThemedText>
        </ThemedView>
      </Animated.View>

      <ThemedView style={styles.stepContainer}>
        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <ThemedText type="subtitle">1. Select an image</ThemedText>

          <View style={styles.imageOptionsContainer}>
            <AnimatedCard
              style={styles.imageOptionCard}
              onPress={takePhoto}
              withGradient={true}
              gradientType="primary"
              gradientIntensity={0.9}
            >
              <View style={styles.imageOptionContent}>
                <Ionicons name="camera" size={40} color="#FFFFFF" />
                <Text style={styles.imageOptionText}>Take Photo</Text>
              </View>
            </AnimatedCard>

            <AnimatedCard
              style={styles.imageOptionCard}
              onPress={pickImage}
              withGradient={true}
              gradientType="accent"
              gradientIntensity={0.9}
            >
              <View style={styles.imageOptionContent}>
                <Ionicons name="images" size={40} color="#FFFFFF" />
                <Text style={styles.imageOptionText}>Pick Image</Text>
              </View>
            </AnimatedCard>
          </View>
        </Animated.View>

        {image && (
          <>
            <AnimatedView
              style={[styles.imagePreviewContainer, imageAnimatedStyle]}
            >
              <AnimatedCard withShadow={true}>
                <AnimatedImage source={{ uri: image }} style={styles.image} />
                <Pressable onPress={reset} style={styles.resetBtnSmall}>
                  <Ionicons name="close-circle" size={24} color="#fff" />
                </Pressable>
              </AnimatedCard>
            </AnimatedView>

            <AnimatedView
              style={[styles.categorySection, categoryAnimatedStyle]}
            >
              <ThemedText type="subtitle">2. Enter a category</ThemedText>

              <AnimatedCard style={styles.inputCard}>
                <TextInput
                  style={[
                    styles.categoryInput,
                    { color: Colors[colorScheme].text },
                  ]}
                  value={category}
                  onChangeText={setCategory}
                  placeholder="e.g., Food, Drink, Skin Care"
                  placeholderTextColor={Colors[colorScheme].textSecondary}
                />
              </AnimatedCard>

              <View style={styles.categoryChipsContainer}>
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    category === "Food" && styles.selectedChip,
                  ]}
                  onPress={() => selectCategory("Food")}
                >
                  <GradientBackground
                    type={category === "Food" ? "primary" : "background"}
                    intensity={category === "Food" ? 1 : 0.5}
                    style={styles.chipGradient}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === "Food" && styles.selectedChipText,
                      ]}
                    >
                      Food
                    </Text>
                  </GradientBackground>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    category === "Skin Care" && styles.selectedChip,
                  ]}
                  onPress={() => selectCategory("Skin Care")}
                >
                  <GradientBackground
                    type={category === "Skin Care" ? "primary" : "background"}
                    intensity={category === "Skin Care" ? 1 : 0.5}
                    style={styles.chipGradient}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === "Skin Care" && styles.selectedChipText,
                      ]}
                    >
                      Skin Care
                    </Text>
                  </GradientBackground>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    category === "Drink" && styles.selectedChip,
                  ]}
                  onPress={() => selectCategory("Drink")}
                >
                  <GradientBackground
                    type={category === "Drink" ? "primary" : "background"}
                    intensity={category === "Drink" ? 1 : 0.5}
                    style={styles.chipGradient}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === "Drink" && styles.selectedChipText,
                      ]}
                    >
                      Drink
                    </Text>
                  </GradientBackground>
                </TouchableOpacity>
              </View>
            </AnimatedView>
          </>
        )}

        {image && category && (
          <AnimatedView style={[styles.checkContainer, buttonAnimatedStyle]}>
            <AnimatedButton
              title="ANALYZE INGREDIENTS"
              onPress={checkResult}
              variant="primary"
              size="large"
              fullWidth={true}
              icon={<Ionicons name="search" size={20} color="#FFFFFF" />}
            />
          </AnimatedView>
        )}

        <HarmfulItems harmfulItems={harmfulItems} loading={loading} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
  },
  stepContainer: {
    gap: 16,
  },
  coverPicture: {
    height: "100%",
    width: "100%",
  },
  imageOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  imageOptionCard: {
    width: "48%",
    height: 130,
    borderRadius: 16,
  },
  imageOptionContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  imageOptionText: {
    color: "white",
    marginTop: 12,
    fontWeight: "600",
    fontSize: 16,
  },
  imagePreviewContainer: {
    position: "relative",
    marginVertical: 20,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },
  resetBtnSmall: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 4,
  },
  categorySection: {
    gap: 16,
    marginTop: 10,
  },
  inputCard: {
    padding: 0,
    overflow: "hidden",
  },
  categoryInput: {
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  categoryChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  categoryChip: {
    borderRadius: 20,
    overflow: "hidden",
  },
  chipGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  selectedChip: {
    borderWidth: 0,
  },
  categoryChipText: {
    color: "white",
    fontWeight: "500",
  },
  selectedChipText: {
    fontWeight: "bold",
  },
  checkContainer: {
    marginVertical: 24,
  },
});
