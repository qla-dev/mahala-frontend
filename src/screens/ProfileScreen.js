import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

const ACTIVITY_ITEMS = [
  { label: "My Mahale", view: "MY_POSTS" },
  { label: "My Replies", view: "MY_REPLIES" },
  { label: "My Votes", view: "MY_VOTES" }
];

export default function ProfileScreen({ user, isGuest, isPremium, credits, furka, onOpenPurchase, onUpgrade, onOpenActivity, onOpenSettings, onLogout }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{isGuest ? "G" : user.firstName?.slice(0, 1)}</Text>
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.name}>{isGuest ? "Guest User" : `${user.firstName} ${user.lastName}`}</Text>
          <Text style={styles.handle}>@{isGuest ? "gost" : user.username}</Text>
          {!isGuest ? <Text style={styles.furka}>Moja Furka {furka}</Text> : null}
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.gridValue}>{credits.boosts}</Text>
          <Text style={styles.gridLabel}>Boosts</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridValue}>{credits.colors}</Text>
          <Text style={styles.gridLabel}>Colors</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridValue}>{isPremium ? "ON" : "OFF"}</Text>
          <Text style={styles.gridLabel}>Plus</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Activity</Text>
      {ACTIVITY_ITEMS.map((item) => (
        <Pressable key={item.view} onPress={() => onOpenActivity(item.view)} style={styles.menuRow}>
          <Text style={styles.menuText}>{item.label}</Text>
          <Text style={styles.menuArrow}>{">"}</Text>
        </Pressable>
      ))}

      <Text style={styles.sectionLabel}>Rewards</Text>
      <View style={styles.rewardRow}>
        <Pressable onPress={() => onOpenPurchase("boosts")} style={[styles.rewardCard, { backgroundColor: colors.accent }]}>
          <Text style={styles.rewardTitle}>Boosts</Text>
          <Text style={styles.rewardCopy}>Push your post higher.</Text>
        </Pressable>
        <Pressable onPress={() => onOpenPurchase("colors")} style={[styles.rewardCard, { backgroundColor: colors.success }]}>
          <Text style={styles.rewardTitle}>Colors</Text>
          <Text style={styles.rewardCopy}>Unlock louder cards.</Text>
        </Pressable>
      </View>

      {!isPremium ? (
        <Pressable onPress={onUpgrade} style={styles.upgrade}>
          <Text style={styles.upgradeTitle}>Mahala Plus</Text>
          <Text style={styles.upgradeCopy}>Premium channels, image freedom, stronger rewards.</Text>
        </Pressable>
      ) : null}

      <Pressable onPress={onOpenSettings} style={styles.settings}>
        <Text style={styles.settingsText}>Open settings</Text>
      </Pressable>

      <Pressable onPress={onLogout} style={styles.logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 120
  },
  hero: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    borderRadius: 24,
    padding: 18,
    backgroundColor: colors.panel,
    marginBottom: 20
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: colors.panelAlt,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900"
  },
  heroCopy: {
    flex: 1
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4
  },
  handle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6
  },
  furka: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900"
  },
  grid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20
  },
  gridItem: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: colors.panel,
    alignItems: "center"
  },
  gridValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4
  },
  gridLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800"
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 10
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: colors.panel,
    marginBottom: 10
  },
  menuText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  menuArrow: {
    color: colors.subdued,
    fontSize: 16,
    fontWeight: "900"
  },
  rewardRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20
  },
  rewardCard: {
    flex: 1,
    minHeight: 120,
    borderRadius: 22,
    padding: 18,
    justifyContent: "space-between"
  },
  rewardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  rewardCopy: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    opacity: 0.82
  },
  upgrade: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: colors.text,
    marginBottom: 14
  },
  upgradeTitle: {
    color: colors.whiteButtonText,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 6
  },
  upgradeCopy: {
    color: colors.whiteButtonText,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600"
  },
  settings: {
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: colors.panel,
    marginBottom: 12
  },
  settingsText: {
    color: colors.text,
    fontWeight: "800"
  },
  logout: {
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "rgba(239,68,68,0.12)"
  },
  logoutText: {
    color: colors.danger,
    fontWeight: "900"
  }
});
