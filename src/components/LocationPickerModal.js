import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

export default function LocationPickerModal({ visible, cities, currentLocation, onClose, onSelect }) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.wrap}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Pick your Mahala</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {cities.map((city) => {
              const active = city.name === currentLocation;
              return (
                <Pressable key={city.id} onPress={() => onSelect(city.name)} style={[styles.row, active && styles.rowActive]}>
                  <View>
                    <Text style={[styles.name, active && styles.nameActive]}>{city.name}</Text>
                    <Text style={styles.distance}>{city.distance}</Text>
                  </View>
                  <Text style={[styles.badge, active && styles.badgeActive]}>{active ? "LIVE" : "LOCAL"}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "flex-end"
  },
  sheet: {
    maxHeight: "78%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.panel,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: colors.panelAlt,
    marginBottom: 10
  },
  rowActive: {
    backgroundColor: colors.accent
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  nameActive: {
    color: colors.text
  },
  distance: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4
  },
  badge: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2
  },
  badgeActive: {
    color: colors.text
  },
  close: {
    alignItems: "center",
    paddingTop: 8
  },
  closeText: {
    color: colors.muted,
    fontWeight: "800"
  }
});
