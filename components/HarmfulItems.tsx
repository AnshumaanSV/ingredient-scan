import { HarmfulItem } from "@/constants/types";
import { View, StyleSheet, ActivityIndicator } from "react-native";
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
    return (
      <ThemedText type="subtitle">
        Unable to process. Please try again later
      </ThemedText>
    );
  }

  return (
    <View>
      {harmfulItems[0].itemName !== "Please try again." && (
        <ThemedText type="subtitle">Harmful Ingredients:</ThemedText>
      )}
      {harmfulItems.map((item, index) => {
        return (
          <ThemedText
            style={index % 2 === 0 ? styles.harmfulListItem1 : {}}
            type="default"
            key={item.itemName}
          >
            {item.itemName}: {item.description}
          </ThemedText>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  harmfulListItem1: {
    backgroundColor: "#404040",
    marginTop: 10,
  },
});
