import {
  Image,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  ToastAndroid,
  View,
  ActivityIndicator,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { imageToText } from "@/api/ocr";
import { fetchHarmfulItems } from "@/api/classification";
import { HarmfulItem } from "@/constants/types";
import { HarmfulItems } from "@/components/HarmfulItems";

export default function HomeScreen() {
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [harmfulItems, setHarmfulItems] = useState<HarmfulItem[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
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

    const imageText = await imageToText(image);
    if (!imageText) {
      setLoading(false);
      return ToastAndroid.show(
        "Cannot process image. Please try again later.",
        ToastAndroid.SHORT
      );
    }

    const harmfulItems = await fetchHarmfulItems(category, imageText);
    if (!harmfulItems) {
      setLoading(false);
      return ToastAndroid.show(
        "Cannot process image. Please try again later.",
        ToastAndroid.SHORT
      );
    }

    setHarmfulItems(harmfulItems);
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
        <ThemedText type="subtitle">1. Enter a category</ThemedText>
        <TextInput
          style={styles.categoryInput}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g., Food, Drink, Skin Care"
          placeholderTextColor="grey"
        ></TextInput>
        <ThemedView
          style={category ? styles.stepContainer : styles.lightStepContainer}
        >
          <ThemedText type="subtitle">2. Upload ingredients</ThemedText>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Pressable onPress={pickImage} style={styles.imageBtn}>
              <Text style={styles.imageBtnText}>PICK AN IMAGE</Text>
            </Pressable>
            <Pressable onPress={reset} style={styles.resetBtn}>
              <Text style={styles.resetBtnText}>RESET</Text>
            </Pressable>
          </View>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </ThemedView>
        {category && image && (
          <ThemedView style={styles.checkContainer}>
            <Pressable
              onPress={checkResult}
              style={image ? styles.resultBtn : styles.disabledResultBtn}
            >
              <Text style={styles.resultBtnText}>CHECK RESULTS</Text>
            </Pressable>
          </ThemedView>
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#f07e2e" />
        ) : (
          <HarmfulItems harmfulItems={harmfulItems} />
        )}
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
    gap: 8,
    marginTop: "10%",
  },
  lightStepContainer: {
    gap: 8,
    marginTop: "10%",
    opacity: 0.2,
  },
  coverPicture: {
    height: "100%",
    width: "100%",
  },
  categoryInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    color: "white",
    paddingLeft: 10,
  },
  imagePicker: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageBtn: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f07e2e",
    width: "75%",
  },
  imageBtnText: {
    color: "white",
    margin: "auto",
  },
  resetBtn: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#cccdcf",
    width: "20%",
  },
  resetBtnText: {
    color: "black",
    margin: "auto",
  },
  disabledResultBtn: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    backgroundColor: "white",
    color: "black",
    opacity: 0.5,
    position: "absolute",
    bottom: 0,
  },
  resultBtn: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    backgroundColor: "white",
    color: "black",
    position: "static",
    bottom: 0,
  },
  resultBtnText: {
    color: "black",
    margin: "auto",
  },
  image: {
    width: "100%",
    height: 100,
    opacity: 0.5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  checkContainer: {
    marginBottom: 40,
  },
});
