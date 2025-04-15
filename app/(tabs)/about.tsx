import React from "react";
import { StyleSheet, Image, View, Linking } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={require("@/assets/images/desk.jpg")}
          style={styles.headerImage}
        />
      }
      headerTitle="About"
      withGradientOverlay={true}
    >
      <Animated.View entering={FadeIn.duration(800)}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">About Ingredient Scan</ThemedText>
        </ThemedView>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(600).delay(200)}>
        <AnimatedCard style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="information-circle" size={32} color="#4E54C8" />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={styles.cardTitle} type="subtitle">
                What We Do
              </ThemedText>
              <ThemedText style={styles.cardText}>
                Wondering if that "healthy" snack is really as good for you as
                it claims? Or if that top-rated product lives up to the hype?
                Ingredient Scan has you covered!
              </ThemedText>
            </View>
          </View>
        </AnimatedCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(600).delay(300)}>
        <AnimatedCard
          style={styles.card}
          withGradient={true}
          gradientType="primary"
          gradientIntensity={0.2}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="camera" size={32} color="#4E54C8" />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={styles.cardTitle} type="subtitle">
                How It Works
              </ThemedText>
              <ThemedText style={styles.cardText}>
                Just select the product category and upload a clear picture of
                the ingredient list from the packaging. Make sure to crop out
                everything but the ingredients for the best results.
              </ThemedText>
            </View>
          </View>
        </AnimatedCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(600).delay(400)}>
        <AnimatedCard
          style={styles.card}
          withGradient={true}
          gradientType="accent"
          gradientIntensity={0.2}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={32} color="#FF6B6B" />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={styles.cardTitle} type="subtitle">
                Privacy First
              </ThemedText>
              <ThemedText style={styles.cardText}>
                We value your privacy. Your images are processed securely and
                are not stored on our servers longer than necessary for
                analysis. We do not share your data with third parties.
              </ThemedText>
            </View>
          </View>
        </AnimatedCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(600).delay(500)}>
        <AnimatedCard
          style={{
            ...styles.card,
            ...styles.lastCard,
          }}
          onPress={() => openLink("https://freepik.com")}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="heart" size={32} color="#4E54C8" />
            </View>
            <View style={styles.textContainer}>
              <ThemedText style={styles.cardTitle} type="subtitle">
                Credits
              </ThemedText>
              <ThemedText style={styles.cardText}>
                Illustrations designed by FreePik. Tap to visit their website.
              </ThemedText>
            </View>
          </View>
        </AnimatedCard>
      </Animated.View>
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
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  lastCard: {
    marginBottom: 32,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    marginRight: 16,
    paddingTop: 4,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardText: {
    lineHeight: 22,
  },
});
