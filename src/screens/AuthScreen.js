import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, shadows } from "../constants/theme";

export default function AuthScreen({ onSubmit, onGuest }) {
  const [mode, setMode] = useState("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  if (mode === "welcome") {
    return (
      <View style={styles.center}>
        <Text style={styles.logo}>MAHALA</Text>
        <Text style={styles.subtitle}>Local anonymous community, dark and loud.</Text>
        <Pressable onPress={() => setMode("signup")} style={styles.primary}>
          <Text style={styles.primaryText}>Create account</Text>
        </Pressable>
        <Pressable onPress={() => setMode("signin")} style={styles.secondary}>
          <Text style={styles.secondaryText}>Sign in</Text>
        </Pressable>
        <Pressable onPress={onGuest} style={styles.link}>
          <Text style={styles.linkText}>Continue as guest</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.formWrap}>
      <Pressable onPress={() => setMode("welcome")}>
        <Text style={styles.back}>{"<"} Back</Text>
      </Pressable>
      <Text style={styles.heading}>{mode === "signin" ? "Welcome back" : "Create your account"}</Text>
      <Text style={styles.copy}>{mode === "signin" ? "Jump back into your Mahala." : "Join your neighborhood signal."}</Text>

      {mode === "signup" ? <TextInput value={username} onChangeText={setUsername} placeholder="Username" placeholderTextColor={colors.subdued} style={styles.input} /> : null}
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor={colors.subdued} autoCapitalize="none" style={styles.input} />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor={colors.subdued} secureTextEntry style={styles.input} />

      <Pressable onPress={() => onSubmit({ mode, email, password, username })} style={styles.primary}>
        <Text style={styles.primaryText}>{mode === "signin" ? "Sign in" : "Finish signup"}</Text>
      </Pressable>
      <Pressable onPress={() => setMode(mode === "signin" ? "signup" : "signin")}>
        <Text style={styles.switchText}>{mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background
  },
  logo: {
    color: colors.text,
    fontSize: 46,
    fontWeight: "900",
    letterSpacing: 3
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40
  },
  primary: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: colors.text,
    alignItems: "center",
    marginBottom: 12,
    ...shadows.glow
  },
  primaryText: {
    color: colors.whiteButtonText,
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  secondary: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: colors.panel,
    alignItems: "center"
  },
  secondaryText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  link: {
    marginTop: 18
  },
  linkText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.3,
    textTransform: "uppercase"
  },
  formWrap: {
    flex: 1,
    padding: 24,
    justifyContent: "center"
  },
  back: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 28
  },
  heading: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 8
  },
  copy: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 24
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
  switchText: {
    color: colors.muted,
    textAlign: "center",
    fontWeight: "700",
    marginTop: 10
  }
});
