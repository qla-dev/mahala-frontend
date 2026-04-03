import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

export default function NotificationsScreen({ items, onUpgrade }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable onPress={onUpgrade} style={styles.banner}>
        <Text style={styles.bannerTitle}>Mahala Plus</Text>
        <Text style={styles.bannerCopy}>Unlock premium channels, boosts, and color rewards.</Text>
      </Pressable>

      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={[styles.dot, { backgroundColor: item.accent }]} />
          <View style={styles.copyWrap}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 120
  },
  banner: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.text,
    marginBottom: 16
  },
  bannerTitle: {
    color: colors.whiteButtonText,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6
  },
  bannerCopy: {
    color: colors.whiteButtonText,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600"
  },
  card: {
    flexDirection: "row",
    gap: 14,
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.panel,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4
  },
  copyWrap: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 5
  },
  body: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600"
  }
});
