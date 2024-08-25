import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={require("@/assets/images/desk.jpg")}
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About Ingredient Scan</ThemedText>
      </ThemedView>
      <ThemedText>
        Wondering if that "healthy" snack is really as good for you as it
        claims? Or if that top-rated product lives up to the hype? Ingredient
        Scan has you covered!
      </ThemedText>
      <ThemedText>
        Just select the product category and upload a clear picture of the
        ingredient list from the packaging. Make sure to crop out everything but
        the ingredients for the best results.
      </ThemedText>
      {/* <ThemedText>
        Licenses: Illustrations designed by{" "}
        <ExternalLink href="https://freepik.com">
          <ThemedText type="link">FreePik</ThemedText>
        </ExternalLink>
      </ThemedText> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: "100%",
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
