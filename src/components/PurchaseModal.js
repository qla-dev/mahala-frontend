import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

const OFFERS = {
  boosts: [1, 3, 5],
  colors: [1, 2, 4]
};

export default function PurchaseModal({ visible, type, onClose, onConfirm, onUpgrade }) {
  const options = OFFERS[type] || [];

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.wrap}>
        <View style={styles.card}>
          <Text style={styles.title}>{type === "boosts" ? "Boost trgovina" : "Trgovina bojama"}</Text>
          {options.map((amount) => (
            <Pressable key={amount} onPress={() => onConfirm(type, amount)} style={styles.option}>
              <Text style={styles.optionText}>{amount} paket</Text>
            </Pressable>
          ))}
          <Pressable onPress={onUpgrade} style={[styles.option, styles.upgrade]}>
            <Text style={styles.optionText}>Otkljucaj Mahala Plus</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Zatvori</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.82)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  card: {
    width: "100%",
    borderRadius: 24,
    padding: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16
  },
  option: {
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: colors.panelAlt,
    alignItems: "center",
    marginBottom: 10
  },
  upgrade: {
    backgroundColor: colors.accent
  },
  optionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  close: {
    paddingVertical: 12,
    alignItems: "center"
  },
  closeText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  }
});
