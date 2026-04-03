import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/theme";

export default function ChangePasswordScreen({ onSubmit }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Promijeni lozinku</Text>
      <TextInput secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} placeholder="Trenutna lozinka" placeholderTextColor={colors.subdued} style={styles.input} />
      <TextInput secureTextEntry value={nextPassword} onChangeText={setNextPassword} placeholder="Nova lozinka" placeholderTextColor={colors.subdued} style={styles.input} />
      <TextInput secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Potvrdi novu lozinku" placeholderTextColor={colors.subdued} style={styles.input} />
      <Pressable onPress={() => onSubmit({ currentPassword, nextPassword, confirmPassword })} style={styles.primary}>
        <Text style={styles.primaryText}>Azuriraj lozinku</Text>
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
