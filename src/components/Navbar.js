import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../constants/theme";

const ITEMS = [
  { label: "Feed", value: "FEED", icon: "home" },
  { label: "Pretraga", value: "SEARCH", icon: "search" },
  { label: "Mapa", value: "MAP", icon: "map" },
  { label: "Alerti", value: "NOTIFICATIONS", icon: "notifications" },
  { label: "Profil", value: "PROFILE", icon: "person" }
];

export default function Navbar({ currentView, onChange }) {
  return (
    <View style={styles.wrap}>
      {ITEMS.map((item) => {
        const active = item.value === currentView;
        return (
          <Pressable key={item.value} onPress={() => onChange(item.value)} style={[styles.item, active && styles.itemActive]}>
            <Ionicons name={item.icon} size={20} color={active ? colors.text : colors.subdued} style={styles.icon} />
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
    paddingVertical: 10
  },
  icon: {
    marginBottom: 4
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
