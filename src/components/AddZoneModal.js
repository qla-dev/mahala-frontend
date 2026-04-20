import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import * as Haptics from "expo-haptics";
import ZoneLocationMapModal from "./ZoneLocationMapModal";
import { colors } from "../constants/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const SUCCESS_CIRCLE_LENGTH = 226;

export default function AddZoneModal({ visible, onClose }) {
  const [mode, setMode] = useState(null);
  const [located, setLocated] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const successProgress = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.82)).current;
  const closeTimer = useRef(null);

  useEffect(() => {
    if (!visible) {
      setMode(null);
      setLocated(false);
      setMapOpen(false);
      setSuccessOpen(false);
      setZoneName("");
      setChannelName("");
      setChannelDescription("");
      successProgress.setValue(0);
      successScale.setValue(0.82);
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    }
  }, [successProgress, successScale, visible]);

  const closeModal = () => {
    setMode(null);
    setLocated(false);
    setMapOpen(false);
    setSuccessOpen(false);
    setZoneName("");
    setChannelName("");
    setChannelDescription("");
    successProgress.setValue(0);
    successScale.setValue(0.82);
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    onClose();
  };

  const submitRequest = () => {
    setSuccessOpen(true);
    successProgress.setValue(0);
    successScale.setValue(0.82);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.parallel([
      Animated.timing(successProgress, {
        toValue: 1,
        duration: 760,
        useNativeDriver: false
      }),
      Animated.spring(successScale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true
      })
    ]).start();

    closeTimer.current = setTimeout(() => {
      closeModal();
    }, 1600);
  };

  return (
    <>
      <Modal animationType="fade" transparent visible={visible && !mapOpen} onRequestClose={closeModal}>
        <View style={styles.wrap}>
          <View style={styles.card}>
          {successOpen ? (
            <SuccessState progress={successProgress} scale={successScale} />
          ) : !mode ? (
            <>
              <Text style={styles.title}>Sta zelis dodati?</Text>
              <Text style={styles.copy}>Izaberi da li zelis predloziti novu zonu u Mahali ili otvoriti novi kanal za razgovor.</Text>
              <Pressable onPress={() => setMode("zone")} style={styles.choice}>
                <Text style={styles.choiceTitle}>Dodaj zonu</Text>
                <Text style={styles.choiceCopy}>Za novu mahalu, kvart ili mjesto oko tebe.</Text>
              </Pressable>
              <Pressable onPress={() => setMode("channel")} style={styles.choice}>
                <Text style={styles.choiceTitle}>Novi kanal</Text>
                <Text style={styles.choiceCopy}>Za novu temu razgovora u tvojoj trenutnoj mahali.</Text>
              </Pressable>
            </>
          ) : mode === "zone" ? (
            <>
              <Text style={styles.title}>Dodaj zonu</Text>
              {!located ? (
                <>
                  <Text style={styles.copy}>Otvori mapu, pritisni Lociraj me i Mahala ce pronaci poligon u kojem se nalazis.</Text>
                  <Pressable onPress={() => setMapOpen(true)} style={styles.primary}>
                    <Text style={styles.primaryText}>Lociraj me</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.copy}>Granica zone je nacrtana. Dodaj naziv zone i posalji je na odobrenje.</Text>
                  <TextInput placeholder="Naziv zone" placeholderTextColor={colors.subdued} value={zoneName} onChangeText={setZoneName} style={styles.input} />
                  <Pressable onPress={submitRequest} style={styles.primary}>
                    <Text style={styles.primaryText}>Posalji zahtjev</Text>
                  </Pressable>
                </>
              )}
            </>
          ) : (
            <>
              <Text style={styles.title}>Novi kanal</Text>
              <Text style={styles.copy}>Predlozi kanal za temu koju tvoja mahala treba imati. Nakon pregleda moze biti dodan u preporucene kanale.</Text>
              <TextInput placeholder="Naziv kanala" placeholderTextColor={colors.subdued} value={channelName} onChangeText={setChannelName} autoCapitalize="none" style={styles.input} />
              <TextInput
                placeholder="Kratak opis kanala"
                placeholderTextColor={colors.subdued}
                value={channelDescription}
                onChangeText={setChannelDescription}
                multiline
                style={[styles.input, styles.textArea]}
              />
              <Pressable onPress={submitRequest} style={styles.primary}>
                <Text style={styles.primaryText}>Posalji zahtjev</Text>
              </Pressable>
            </>
          )}
          {!successOpen ? (
            <Pressable onPress={mode ? () => setMode(null) : closeModal} style={styles.secondary}>
              <Text style={styles.secondaryText}>{mode ? "Nazad" : "Zatvori"}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
      <ZoneLocationMapModal
        visible={mapOpen}
        onClose={() => setMapOpen(false)}
        onLocated={(zoneDraft) => {
          setZoneName(zoneDraft.name || "");
          setLocated(false);
          setMapOpen(false);
          closeModal();
        }}
      />
    </>
  );
}

function SuccessState({ progress, scale }) {
  const circleOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [SUCCESS_CIRCLE_LENGTH, 0]
  });
  const checkOffset = progress.interpolate({
    inputRange: [0, 0.48, 1],
    outputRange: [54, 54, 0]
  });

  return (
    <View style={styles.successWrap}>
      <Animated.View style={[styles.successIcon, { transform: [{ scale }] }]}>
        <Svg width={92} height={92} viewBox="0 0 92 92">
          <AnimatedCircle
            cx="46"
            cy="46"
            r="36"
            stroke={colors.success}
            strokeWidth="7"
            fill="rgba(16,185,129,0.12)"
            strokeLinecap="round"
            strokeDasharray={`${SUCCESS_CIRCLE_LENGTH} ${SUCCESS_CIRCLE_LENGTH}`}
            strokeDashoffset={circleOffset}
            rotation="-90"
            origin="46, 46"
          />
          <AnimatedPath
            d="M30 47.5L41 58.5L64 34.5"
            stroke={colors.success}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="54 54"
            strokeDashoffset={checkOffset}
          />
        </Svg>
      </Animated.View>
      <Text style={styles.successTitle}>Zahtjev uspjesno poslan</Text>
      <Text style={styles.successCopy}>Hvala ti. Pregledat cemo prijedlog i javiti cim bude odobren.</Text>
    </View>
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
  choice: {
    borderRadius: 18,
    backgroundColor: colors.panelAlt,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12
  },
  choiceTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 5
  },
  choiceCopy: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700"
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
  textArea: {
    height: 96,
    paddingTop: 14,
    textAlignVertical: "top"
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
  },
  successWrap: {
    alignItems: "center",
    paddingVertical: 10
  },
  successIcon: {
    width: 92,
    height: 92,
    marginBottom: 18
  },
  successTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8
  },
  successCopy: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    textAlign: "center"
  }
});
