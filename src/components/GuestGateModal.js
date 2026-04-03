import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

export default function GuestGateModal({ visible, message, onClose, onAction }) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.wrap}>
        <View style={styles.card}>
          <Text style={styles.kicker}>Samo za clanove</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable onPress={() => { onClose(); onAction(); }} style={styles.primary}>
            <Text style={styles.primaryText}>Idi na prijavu</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.secondary}>
            <Text style={styles.secondaryText}>Mozda kasnije</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.86)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  card: {
    width: "100%",
    backgroundColor: colors.panel,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border
  },
  kicker: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 10
  },
  message: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "700",
    marginBottom: 18
  },
  primary: {
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: colors.text,
    alignItems: "center",
    marginBottom: 10
  },
  primaryText: {
    color: colors.whiteButtonText,
    fontSize: 14,
    fontWeight: "900"
  },
  secondary: {
    paddingVertical: 14,
    alignItems: "center"
  },
  secondaryText: {
    color: colors.muted,
    fontWeight: "800"
  }
});
