import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

const FEATURES = ["Premium channels", "Image posting freedom", "Reward unlocks", "More color packs"];

export default function PremiumHubScreen({ onPurchase }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Mahala Plus</Text>
        <Text style={styles.title}>Go louder in your local scene.</Text>
        <Text style={styles.copy}>Unlock premium channels, deeper identity perks, and stronger post tools without changing the core Mahala feel.</Text>
      </View>

      {FEATURES.map((feature) => (
        <View key={feature} style={styles.feature}>
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}

      <Pressable onPress={onPurchase} style={styles.primary}>
        <Text style={styles.primaryText}>Activate Mahala Plus</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40
  },
  hero: {
    borderRadius: 26,
    padding: 22,
    backgroundColor: colors.text,
    marginBottom: 20
  },
  kicker: {
    color: colors.accentDeep,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10
  },
  title: {
    color: colors.whiteButtonText,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900",
    marginBottom: 10
  },
  copy: {
    color: colors.whiteButtonText,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600"
  },
  feature: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: colors.panel,
    marginBottom: 12
  },
  featureText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  primary: {
    marginTop: 10,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: colors.accent
  },
  primaryText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  }
});
