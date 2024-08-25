import { HarmfulItem } from "@/constants/types";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

interface HarmfulItemsProps {
  harmfulItems: HarmfulItem[];
}

export function HarmfulItems({ harmfulItems }: HarmfulItemsProps) {
  return harmfulItems.length ? (
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
  ) : (
    <></>
  );
}

const styles = StyleSheet.create({
  harmfulListItem1: {
    backgroundColor: "#404040",
    marginTop: 10,
  },
});
