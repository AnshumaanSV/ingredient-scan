import {
  Image,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  ToastAndroid,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { HarmfulItem } from "@/constants/types";
import { HarmfulItems } from "@/components/HarmfulItems";
import { imagePicker, cameraCapture } from "@/core/image-picker";
import { detectHarmfulItems } from "@/core/detect-harmful-items";
import React from "react";

export default function HomeScreen() {
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [harmfulItems, setHarmfulItems] = useState<HarmfulItem[]>([]);

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
      return ToastAndroid.show("Please wait!", ToastAndroid.SHORT);
    }
    if (!image) {
      return ToastAndroid.show("Please select an image!", ToastAndroid.SHORT);
    }
    if (!category) {
      return ToastAndroid.show("Please enter a category!", ToastAndroid.SHORT);
    }

    ToastAndroid.show("Processing!", ToastAndroid.SHORT);
    setLoading(true);

    const detectedItems = await detectHarmfulItems(image, category);

    if (detectedItems) {
      setHarmfulItems(detectedItems);
    } else {
      ToastAndroid.show(
        "Cannot process image. Please try again later.",
        ToastAndroid.SHORT,
      );
    }

    setLoading(false);
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
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Ingredient Scan</ThemedText>
        <ThemedText type="caption">Discover Safe Choices!</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">1. Select an image</ThemedText>

        <View style={styles.imageOptionsContainer}>
          <Pressable onPress={takePhoto} style={styles.imageOptionBox}>
            <Ionicons name="camera" size={40} color="#4285F4" />
            <Text style={styles.imageOptionText}>Take Photo</Text>
          </Pressable>

          <Pressable onPress={pickImage} style={styles.imageOptionBox}>
            <Ionicons name="images" size={40} color="#f07e2e" />
            <Text style={styles.imageOptionText}>Pick Image</Text>
          </Pressable>
        </View>

        {image && (
          <>
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <Pressable onPress={reset} style={styles.resetBtnSmall}>
                <Ionicons name="close-circle" size={24} color="#fff" />
              </Pressable>
            </View>

            <ThemedView style={styles.categorySection}>
              <ThemedText type="subtitle">2. Enter a category</ThemedText>
              <TextInput
                style={styles.categoryInput}
                value={category}
                onChangeText={setCategory}
                placeholder="e.g., Food, Drink, Skin Care"
                placeholderTextColor="grey"
              />

              <View style={styles.categoryChipsContainer}>
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    category === "Food" && styles.selectedChip,
                  ]}
                  onPress={() => selectCategory("Food")}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === "Food" && styles.selectedChipText,
                    ]}
                  >
                    Food
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    category === "Skin Care" && styles.selectedChip,
                  ]}
                  onPress={() => selectCategory("Skin Care")}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === "Skin Care" && styles.selectedChipText,
                    ]}
                  >
                    Skin Care
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    category === "Drink" && styles.selectedChip,
                  ]}
                  onPress={() => selectCategory("Drink")}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === "Drink" && styles.selectedChipText,
                    ]}
                  >
                    Drink
                  </Text>
                </TouchableOpacity>
              </View>
            </ThemedView>
          </>
        )}

        {image && category && (
          <ThemedView style={styles.checkContainer}>
            <Pressable onPress={checkResult} style={styles.resultBtn}>
              <Text style={styles.resultBtnText}>CHECK RESULTS</Text>
            </Pressable>
          </ThemedView>
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
  },
  stepContainer: {
    gap: 16,
    marginTop: "10%",
  },
  coverPicture: {
    height: "100%",
    width: "100%",
  },
  imageOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  imageOptionBox: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  imageOptionText: {
    color: "white",
    marginTop: 10,
    fontWeight: "500",
  },
  imagePreviewContainer: {
    position: "relative",
    marginVertical: 15,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  resetBtnSmall: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  categorySection: {
    gap: 12,
    marginTop: 10,
  },
  categoryInput: {
    height: 45,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    color: "white",
    paddingLeft: 10,
  },
  categoryChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 5,
  },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  selectedChip: {
    backgroundColor: "#4285F4",
    borderColor: "#4285F4",
  },
  categoryChipText: {
    color: "white",
  },
  selectedChipText: {
    fontWeight: "bold",
  },
  resultBtn: {
    height: 50,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  resultBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  checkContainer: {
    marginVertical: 20,
  },
});
