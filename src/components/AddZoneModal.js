import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/theme";

export default function AddZoneModal({ visible, onClose }) {
  const [located, setLocated] = useState(false);
  const [zoneName, setZoneName] = useState("");

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.wrap}>
        <View style={styles.card}>
          <Text style={styles.title}>Add zone</Text>
          {!located ? (
            <>
              <Text style={styles.copy}>Find your current position first, then send a new Mahala zone for approval.</Text>
              <Pressable onPress={() => setLocated(true)} style={styles.primary}>
                <Text style={styles.primaryText}>Find me</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.copy}>Location found. Name the new zone and send it for approval.</Text>
              <TextInput placeholder="Zone name" placeholderTextColor={colors.subdued} value={zoneName} onChangeText={setZoneName} style={styles.input} />
              <Pressable onPress={() => { setZoneName(""); setLocated(false); onClose(); }} style={styles.primary}>
                <Text style={styles.primaryText}>Send request</Text>
              </Pressable>
            </>
          )}
          <Pressable onPress={() => { setZoneName(""); setLocated(false); onClose(); }} style={styles.secondary}>
            <Text style={styles.secondaryText}>Close</Text>
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
    backgroundColor: colors.panel,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 10
  },
  copy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
    fontWeight: "600"
  },
  input: {
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.panelAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 14
  },
  primary: {
    backgroundColor: colors.accent,
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 16
  },
  primaryText: {
    color: colors.text,
    fontWeight: "900"
  },
  secondary: {
    alignItems: "center",
    paddingTop: 14
  },
  secondaryText: {
    color: colors.muted,
    fontWeight: "800"
  }
});
