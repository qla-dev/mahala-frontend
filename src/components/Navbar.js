import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, shadows } from "../constants/theme";

const ITEMS = [
  { label: "Feed", value: "FEED" },
  { label: "Search", value: "SEARCH" },
  { label: "Map", value: "MAP" },
  { label: "Alerts", value: "NOTIFICATIONS" },
  { label: "Profile", value: "PROFILE" }
];

export default function Navbar({ currentView, onChange }) {
  return (
    <View style={styles.wrap}>
      {ITEMS.map((item) => {
        const active = item.value === currentView;
        return (
          <Pressable key={item.value} onPress={() => onChange(item.value)} style={[styles.item, active && styles.itemActive]}>
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 10,
    borderRadius: 22,
    backgroundColor: "rgba(16,16,22,0.95)",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 12
  },
  itemActive: {
    backgroundColor: colors.accent
  },
  label: {
    color: colors.subdued,
    fontSize: 12,
    fontWeight: "800"
  },
  labelActive: {
    color: colors.text
  }
});
