import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/theme";

export default function EditEmailScreen({ user, onSave }) {
  const [email, setEmail] = useState(user.email || "");

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Uredi email</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email adresa" autoCapitalize="none" placeholderTextColor={colors.subdued} style={styles.input} />
      <Pressable onPress={() => onSave({ email })} style={styles.primary}>
        <Text style={styles.primaryText}>Sacuvaj email</Text>
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
