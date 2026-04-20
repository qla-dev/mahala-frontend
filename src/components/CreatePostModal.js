import React, { useEffect, useMemo, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CHANNELS } from "../constants/mockData";
import { colors, postColors } from "../constants/theme";

export default function CreatePostModal({ visible, defaultChannel, currentUser, isGuest, isPremium, onClose, onSubmit, onGuestBlocked }) {
  const insets = useSafeAreaInsets();
  const [content, setContent] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(defaultChannel);
  const [channelPickerOpen, setChannelPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(postColors[0]);
  const [imageUri, setImageUri] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const extraColors = useMemo(() => (isPremium ? ["#f97316", "#ec4899"] : []), [isPremium]);

  useEffect(() => {
    if (visible) {
      setSelectedChannel(defaultChannel);
      setChannelPickerOpen(false);
    }
  }, [defaultChannel, visible]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const canPublish = content.trim().length > 0 || imageUri != null;

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={[styles.wrap, { backgroundColor: selectedColor }]}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top + 10, 24) }]}>
          <Pressable onPress={onClose} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Zatvori</Text>
          </Pressable>
          <Pressable onPress={() => setChannelPickerOpen((prev) => !prev)} style={styles.channelTrigger}>
            <Text style={styles.channelLabel}>@{selectedChannel}</Text>
            <Text style={styles.channelChevron}>{channelPickerOpen ? "˄" : "˅"}</Text>
          </Pressable>
          <Pressable
            disabled={!canPublish}
            onPress={() => {
              onSubmit({
                content: content.trim(),
                color: selectedColor,
                channel: selectedChannel,
                image: imageUri,
                isAnonymous
              });
              setContent("");
              setSelectedChannel(defaultChannel);
              setChannelPickerOpen(false);
              setImageUri(null);
              setIsAnonymous(true);
            }}
            style={[styles.publish, !canPublish && styles.publishDisabled]}
          >
            <Text style={styles.publishText}>Objavi</Text>
          </Pressable>
        </View>

        {channelPickerOpen ? (
          <View style={[styles.channelDropdown, { top: Math.max(insets.top + 68, 88) }]}>
            {CHANNELS.map((channel) => {
              const active = channel.slug === selectedChannel;

              return (
                <Pressable
                  key={channel.id}
                  onPress={() => {
                    setSelectedChannel(channel.slug);
                    setChannelPickerOpen(false);
                  }}
                  style={[styles.channelOption, active && styles.channelOptionActive]}
                >
                  <Text style={[styles.channelOptionTitle, active && styles.channelOptionTitleActive]}>@{channel.name}</Text>
                  <Text style={[styles.channelOptionCopy, active && styles.channelOptionCopyActive]}>{channel.description}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <ScrollView contentContainerStyle={[styles.body, { paddingBottom: Math.max(insets.bottom + 24, 32) }]}>
          <TextInput
            multiline
            maxLength={250}
            placeholder="Sta se desava u tvojoj mahali?"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={content}
            onChangeText={setContent}
            style={styles.input}
          />
          <Text style={styles.counter}>{content.length}/250</Text>
          {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 22, 22) }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorRow}>
            {postColors.concat(extraColors).map((color) => (
              <Pressable key={color} onPress={() => setSelectedColor(color)} style={[styles.colorDot, { backgroundColor: color }, selectedColor === color && styles.colorDotActive]} />
            ))}
          </ScrollView>

          <View style={styles.actionRow}>
            <Pressable onPress={pickImage} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{imageUri ? "Promijeni sliku" : "Dodaj sliku"}</Text>
              <Ionicons name="camera" size={18} color={colors.text} />
            </Pressable>

            <View style={styles.switchWrap}>
              <Text style={styles.switchText}>{isAnonymous ? "Anonimno" : `@${currentUser.username}`}</Text>
              <View style={[styles.switchControl, !isAnonymous ? styles.switchControlActive : styles.switchControlInactive]}>
                <Switch
                  value={!isAnonymous}
                  onValueChange={(value) => {
                    if (isGuest && value) {
                      onGuestBlocked();
                      return;
                    }
                    setIsAnonymous(!value);
                  }}
                  thumbColor={colors.text}
                  trackColor={{ false: "rgba(255,255,255,0.22)", true: colors.accent }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12
  },
  headerButton: {
    paddingVertical: 10
  },
  headerButtonText: {
    color: colors.text,
    fontWeight: "800"
  },
  channelLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1
  },
  channelTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)"
  },
  channelChevron: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900"
  },
  publish: {
    backgroundColor: colors.text,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999
  },
  publishDisabled: {
    opacity: 0.45
  },
  publishText: {
    color: colors.whiteButtonText,
    fontWeight: "900"
  },
  body: {
    padding: 22,
    flexGrow: 1
  },
  channelDropdown: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 20,
    borderRadius: 24,
    backgroundColor: "rgba(10,10,14,0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 10
  },
  channelOption: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "transparent"
  },
  channelOptionActive: {
    backgroundColor: "rgba(139,92,246,0.22)"
  },
  channelOptionTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 4
  },
  channelOptionTitleActive: {
    color: "#c4b5fd"
  },
  channelOptionCopy: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600"
  },
  channelOptionCopyActive: {
    color: "rgba(255,255,255,0.88)"
  },
  input: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "800",
    minHeight: 240,
    textAlignVertical: "top"
  },
  counter: {
    color: "rgba(255,255,255,0.6)",
    alignSelf: "flex-end",
    fontSize: 12,
    fontWeight: "800"
  },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: 22,
    marginTop: 18
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 22,
    gap: 18
  },
  colorRow: {
    gap: 12,
    paddingHorizontal: 4
  },
  colorDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "transparent"
  },
  colorDotActive: {
    borderColor: colors.text
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  actionButton: {
    flex: 1,
    minHeight: 58,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center"
  },
  switchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingLeft: 14,
    paddingRight: 8,
    minHeight: 58,
    borderRadius: 18
  },
  switchControl: {
    minWidth: 58,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingHorizontal: 4
  },
  switchControlActive: {
    backgroundColor: "rgba(16,185,129,0.35)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.7)"
  },
  switchControlInactive: {
    backgroundColor: "rgba(239,68,68,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  switchText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800"
  }
});
