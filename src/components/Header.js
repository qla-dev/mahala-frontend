import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/theme";

const TITLES = {
  FEED: "Mahala",
  SEARCH: "Kanali",
  MAP: "Mapa",
  NOTIFICATIONS: "Obavijesti",
  PROFILE: "Profil",
  CHANNEL_DETAIL: "Kanal",
  POST_DETAIL: "Mahala",
  PREMIUM_HUB: "Mahala Plus",
  SETTINGS: "Postavke",
  CHANGE_PASSWORD: "Promjena lozinke",
  EDIT_NAME: "Uredi ime",
  EDIT_EMAIL: "Uredi email",
  MY_POSTS: "Moje Mahale",
  MY_REPLIES: "Moji odgovori",
  MY_VOTES: "Moji glasovi"
};

export default function Header({ view, title, channelName, isPremium, onBack, onOpenSettings, onOpenLocationPicker, onOpenAddZone }) {
  const canGoBack = ["CHANNEL_DETAIL", "POST_DETAIL", "PREMIUM_HUB", "SETTINGS", "CHANGE_PASSWORD", "EDIT_NAME", "EDIT_EMAIL", "MY_POSTS", "MY_REPLIES", "MY_VOTES"].includes(view);
  const label = view === "FEED" ? title : view === "CHANNEL_DETAIL" ? `@${channelName || "channel"}` : TITLES[view] || "Mahala";

  return (
    <View style={styles.wrap}>
      <View style={styles.side}>
        {canGoBack ? (
          <Pressable onPress={onBack} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
        ) : (
          <Pressable onPress={onOpenSettings} style={styles.iconButton}>
            <Ionicons name="settings-sharp" size={18} color={colors.text} />
          </Pressable>
        )}
      </View>

      <Pressable disabled={view !== "FEED"} onPress={onOpenLocationPicker} style={styles.center}>
        <Text style={styles.title}>{label}</Text>
        {isPremium ? <Text style={styles.premium}>PLUS</Text> : null}
      </Pressable>

      <View style={[styles.side, styles.sideRight]}>
        <Pressable onPress={onOpenAddZone} style={styles.addButton}>
          <Text style={styles.addText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background
  },
  side: {
    width: 52
  },
  sideRight: {
    alignItems: "flex-end"
  },
  center: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  premium: {
    color: colors.warning,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.panel
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent
  },
  addText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginTop: -2
  }
});
