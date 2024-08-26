import { HarmfulItem } from "@/constants/types";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { ThemedText } from "./ThemedText";

interface HarmfulItemsProps {
  harmfulItems: HarmfulItem[];
  loading: boolean;
}

export function HarmfulItems({ harmfulItems, loading }: HarmfulItemsProps) {
  if (loading) {
    return <ActivityIndicator size="large" color="#f07e2e" />;
  }

  if (!harmfulItems.length) {
    return null;
  }

  return (
    <View>
      {harmfulItems[0].itemName !== "Please try again." && (
        <Text>
          <ThemedText type="subtitle">Found </ThemedText>
          <ThemedText style={styles.itemName} type="title">
            {harmfulItems.length}
          </ThemedText>
          <ThemedText type="subtitle"> harmful ingredients:</ThemedText>
        </Text>
      )}
      {harmfulItems.map((item) => {
        return (
          <Text key={item.itemName} style={styles.itemContainer}>
            <ThemedText style={styles.itemName} type="subtitle">
              {item.itemName}
            </ThemedText>
            <ThemedText type="default"> {item.description}</ThemedText>
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  itemName: {
    fontWeight: "600",
    color: "#f07e2e",
  },
});
