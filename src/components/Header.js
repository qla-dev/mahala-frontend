import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

const TITLES = {
  FEED: "Mahala",
  SEARCH: "Channels",
  MAP: "Map",
  NOTIFICATIONS: "Alerts",
  PROFILE: "Profile",
  CHANNEL_DETAIL: "Channel",
  POST_DETAIL: "Mahala",
  PREMIUM_HUB: "Mahala Plus",
  SETTINGS: "Settings",
  CHANGE_PASSWORD: "Change Password",
  EDIT_NAME: "Edit Name",
  EDIT_EMAIL: "Edit Email",
  MY_POSTS: "My Mahale",
  MY_REPLIES: "My Replies",
  MY_VOTES: "My Votes"
};

export default function Header({ view, title, channelName, isPremium, onBack, onOpenSettings, onOpenLocationPicker, onOpenAddZone }) {
  const canGoBack = ["CHANNEL_DETAIL", "POST_DETAIL", "PREMIUM_HUB", "SETTINGS", "CHANGE_PASSWORD", "EDIT_NAME", "EDIT_EMAIL", "MY_POSTS", "MY_REPLIES", "MY_VOTES"].includes(view);
  const label = view === "FEED" ? title : view === "CHANNEL_DETAIL" ? `@${channelName || "channel"}` : TITLES[view] || "Mahala";

  return (
    <View style={styles.wrap}>
      <View style={styles.side}>
        {canGoBack ? (
          <Pressable onPress={onBack} style={styles.iconButton}>
            <Text style={styles.iconText}>{"<"}</Text>
          </Pressable>
        ) : (
          <Pressable onPress={onOpenSettings} style={styles.iconButton}>
            <Text style={styles.iconText}>[]</Text>
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
  iconText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
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
