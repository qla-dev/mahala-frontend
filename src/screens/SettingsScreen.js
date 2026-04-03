import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { colors } from "../constants/theme";

export default function SettingsScreen({ user, location, notificationsEnabled, onToggleNotifications, onOpenLocationPicker, onOpenEditName, onOpenEditEmail, onOpenChangePassword, onLogout }) {
  return (
    <View style={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Pressable onPress={onOpenEditName} style={styles.row}>
          <Text style={styles.rowLabel}>Name</Text>
          <Text style={styles.rowValue}>{user.firstName} {user.lastName}</Text>
        </Pressable>
        <Pressable onPress={onOpenEditEmail} style={styles.row}>
          <Text style={styles.rowLabel}>Email</Text>
          <Text style={styles.rowValue}>{user.email}</Text>
        </Pressable>
        <Pressable onPress={onOpenChangePassword} style={styles.row}>
          <Text style={styles.rowLabel}>Password</Text>
          <Text style={styles.rowValue}>Change</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Local</Text>
        <Pressable onPress={onOpenLocationPicker} style={styles.row}>
          <Text style={styles.rowLabel}>Current Mahala</Text>
          <Text style={styles.rowValue}>{location}</Text>
        </Pressable>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={onToggleNotifications} thumbColor={colors.text} trackColor={{ false: "rgba(255,255,255,0.18)", true: colors.accent }} />
        </View>
      </View>

      <Pressable onPress={onLogout} style={styles.logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    gap: 14
  },
  card: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: colors.panel
  },
  sectionTitle: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10
  },
  row: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)"
  },
  rowLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  rowValue: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  logout: {
    marginTop: 6,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: "rgba(239,68,68,0.14)"
  },
  logoutText: {
    color: colors.danger,
    fontWeight: "900"
  }
});
