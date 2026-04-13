import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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

export default function Header({ view, title, channelName, isPremium, onBack, onOpenSettings, onOpenLocationPicker, onOpenAddZone, onUpgrade }) {
  const canGoBack = ["CHANNEL_DETAIL", "POST_DETAIL", "PREMIUM_HUB", "SETTINGS", "CHANGE_PASSWORD", "EDIT_NAME", "EDIT_EMAIL", "MY_POSTS", "MY_REPLIES", "MY_VOTES"].includes(view);
  const label = view === "FEED" ? title : view === "CHANNEL_DETAIL" ? `@${channelName || "channel"}` : TITLES[view] || "Mahala";

  return (
    <View style={styles.wrap}>
      <View style={styles.side}>
        {canGoBack ? (
          <Pressable onPress={onBack} style={styles.iconButton}>
            <GlassLayer />
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
        ) : (
          <View style={styles.leftActions}>
            <Pressable onPress={onOpenSettings} style={styles.iconButton}>
              <GlassLayer />
              <Ionicons name="settings-sharp" size={18} color={colors.text} />
            </Pressable>
            <Pressable onPress={onUpgrade} style={styles.plusButton}>
              <GlassLayer light />
              <Ionicons name="sparkles" size={13} color={colors.whiteButtonText} />
              <Text style={styles.plusText}>PLUS</Text>
            </Pressable>
          </View>
        )}
      </View>

      <Pressable disabled={view !== "FEED"} onPress={onOpenLocationPicker} style={styles.center}>
        <GlassLayer />
        <Text style={styles.title}>{label}</Text>
        {isPremium ? <Text style={styles.premium}>PLUS</Text> : null}
      </Pressable>

      <View style={[styles.side, styles.sideRight]}>
        <Pressable onPress={onOpenAddZone} style={styles.addZoneButton}>
          <GlassLayer accent />
          <Ionicons name="add" size={22} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

function GlassLayer({ light = false, accent = false }) {
  return (
    <>
      <BlurView pointerEvents="none" intensity={light ? 34 : 24} tint={light ? "light" : "dark"} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[styles.glassOverlay, light && styles.glassOverlayLight, accent && styles.glassOverlayAccent]} />
    </>
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
    width: 104
  },
  sideRight: {
    alignItems: "flex-end"
  },
  center: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    overflow: "hidden",
    shadowColor: "#ffffff",
    shadowOpacity: 0.09,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5
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
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
    shadowColor: "#ffffff",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  plusButton: {
    height: 40,
    paddingHorizontal: 13,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.86)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
    overflow: "hidden",
    shadowColor: "#ffffff",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 6
  },
  plusText: {
    color: colors.whiteButtonText,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8
  },
  addZoneButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139,92,246,0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    overflow: "hidden",
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 7
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  glassOverlayLight: {
    backgroundColor: "rgba(255,255,255,0.32)"
  },
  glassOverlayAccent: {
    backgroundColor: "rgba(139,92,246,0.35)"
  }
});
