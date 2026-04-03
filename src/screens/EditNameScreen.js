import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/theme";

export default function EditNameScreen({ user, onSave }) {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Uredi ime</Text>
      <TextInput value={firstName} onChangeText={setFirstName} placeholder="Ime" placeholderTextColor={colors.subdued} style={styles.input} />
      <TextInput value={lastName} onChangeText={setLastName} placeholder="Prezime" placeholderTextColor={colors.subdued} style={styles.input} />
      <Pressable onPress={() => onSave({ firstName, lastName })} style={styles.primary}>
        <Text style={styles.primaryText}>Sacuvaj ime</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 18
  },
  input: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 14
  },
  primary: {
    marginTop: 6,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: colors.text
  },
  primaryText: {
    color: colors.whiteButtonText,
    fontWeight: "900"
  }
});
