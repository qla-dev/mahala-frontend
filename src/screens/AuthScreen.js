import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";
import { colors, shadows } from "../constants/theme";

const Stack = createNativeStackNavigator();

export default function AuthScreen({ onSubmit, onGuest }) {
  return (
    <Stack.Navigator
      initialRouteName="AuthLanding"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 260,
        gestureEnabled: true,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen name="AuthLanding">
        {(props) => <AuthLandingScreen {...props} onGuest={onGuest} />}
      </Stack.Screen>
      <Stack.Screen name="Login">
        {(props) => <AuthFormScreen {...props} mode="signin" onSubmit={onSubmit} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => <AuthFormScreen {...props} mode="signup" onSubmit={onSubmit} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function AuthLandingScreen({ navigation, onGuest }) {
  return (
    <View style={styles.screen}>
      <View style={styles.landingBody}>
        <BouncingGhostLogo />
        <Text style={styles.logoText}>MAHALA</Text>
        <Text style={styles.subtitle}>Lokalna anonimna zajednica, urbana i glasna.</Text>

        <Pressable onPress={() => navigation.navigate("Register")} style={[styles.primary, styles.primaryWelcome]}>
          <Text style={styles.primaryWelcomeText}>Kreiraj racun</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Login")} style={styles.secondary}>
          <Text style={styles.secondaryText}>Prijavi se</Text>
        </Pressable>
        <Pressable onPress={onGuest} style={styles.link}>
          <Text style={styles.linkText}>Nastavi kao gost</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Privacy Policy</Text>
        <Text style={styles.footerDot}>•</Text>
        <Text style={styles.footerText}>Terms & Conditions</Text>
        <Text style={styles.footerDot}>•</Text>
        <Text style={styles.footerText}>Cookies</Text>
      </View>
    </View>
  );
}

function AuthFormScreen({ navigation, mode, onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const isLogin = mode === "signin";

  const validate = () => {
    const nextErrors = {};
    const emailValue = email.trim();
    const usernameValue = username.trim();

    if (!isLogin && usernameValue.length < 3) {
      nextErrors.username = "Korisnicko ime mora imati najmanje 3 znaka.";
    }

    if (!emailValue) {
      nextErrors.email = "Email je obavezan.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      nextErrors.email = "Unesi ispravnu email adresu.";
    }

    if (!password) {
      nextErrors.password = "Lozinka je obavezna.";
    } else if (!isLogin && password.length < 8) {
      nextErrors.password = "Lozinka mora imati najmanje 8 znakova.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit({
      mode,
      email: email.trim(),
      password,
      username: username.trim()
    });
  };

  return (
    <View style={styles.screen}>
      <AuthHeader title={isLogin ? "Prijava" : "Registracija"} onBack={() => navigation.goBack()} />

      <View style={styles.formBody}>
        <View style={styles.formContent}>
          <Text style={styles.heading}>{isLogin ? "Dobrodosao nazad" : "Kreiraj svoj racun"}</Text>
          <Text style={styles.copy}>{isLogin ? "Vrati se u svoju Mahalu." : "Pridruzi se lokalnom signalu."}</Text>

          {!isLogin ? (
            <>
              <TextInput
                value={username}
                onChangeText={(value) => {
                  setUsername(value);
                  setErrors((prev) => ({ ...prev, username: null }));
                }}
                placeholder="Korisnicko ime"
                placeholderTextColor={colors.subdued}
                autoCapitalize="none"
                style={[styles.input, errors.username && styles.inputError]}
              />
              {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
            </>
          ) : null}

          <TextInput
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setErrors((prev) => ({ ...prev, email: null }));
            }}
            placeholder="Email"
            placeholderTextColor={colors.subdued}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, errors.email && styles.inputError]}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <TextInput
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setErrors((prev) => ({ ...prev, password: null }));
            }}
            placeholder="Lozinka"
            placeholderTextColor={colors.subdued}
            secureTextEntry
            style={[styles.input, errors.password && styles.inputError]}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <Pressable onPress={handleSubmit} style={styles.primary}>
            <Text style={styles.primaryText}>{isLogin ? "Prijavi se" : "Zavrsi registraciju"}</Text>
          </Pressable>

          <Pressable onPress={() => navigation.replace(isLogin ? "Register" : "Login")}>
            <Text style={styles.switchText}>{isLogin ? "Nemate racun? Registrujte se" : "Vec imate racun? Prijavite se"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function AuthHeader({ title, onBack }) {
  return (
    <View style={styles.authHeader}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={22} color={colors.text} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

function BouncingGhostLogo() {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: -10,
          duration: 760,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 760,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        })
      ])
    );

    loop.start();

    return () => loop.stop();
  }, [bounce]);

  return (
    <Animated.View style={[styles.logoMark, { transform: [{ translateY: bounce }] }]}>
      <Svg width={118} height={118} viewBox="0 0 128 128">
        <Path
          d="M28 104V48C28 25.9 44.1 10 64 10s36 15.9 36 38v56L86 91 74 104 64 92 54 104 42 91 28 104Z"
          fill={colors.accent}
        />
        <Circle cx="54" cy="53" r="5.8" fill="#050505" />
        <Circle cx="78" cy="53" r="5.8" fill="#050505" />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  landingBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 70
  },
  logoMark: {
    marginBottom: 18
  },
  logoText: {
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
    marginBottom: 48
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
  primaryWelcome: {
    marginBottom: 18
  },
  primaryText: {
    color: colors.whiteButtonText,
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  primaryWelcomeText: {
    color: colors.whiteButtonText,
    fontSize: 14,
    fontWeight: "800"
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
  footer: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8
  },
  footerText: {
    color: colors.subdued,
    fontSize: 10,
    fontWeight: "800"
  },
  footerDot: {
    color: colors.subdued,
    fontSize: 10,
    fontWeight: "900"
  },
  authHeader: {
    height: 62,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.panel
  },
  headerTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  headerSpacer: {
    width: 42,
    height: 42
  },
  formBody: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 54,
    paddingBottom: 32
  },
  formContent: {
    width: "100%"
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
    marginBottom: 10
  },
  inputError: {
    borderColor: colors.danger
  },
  errorText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 10,
    marginLeft: 6
  },
  switchText: {
    color: colors.muted,
    textAlign: "center",
    fontWeight: "700",
    marginTop: 10
  }
});
