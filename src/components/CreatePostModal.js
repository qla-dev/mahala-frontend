import React, { useMemo, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors, postColors } from "../constants/theme";

export default function CreatePostModal({ visible, defaultChannel, currentUser, isGuest, isPremium, onClose, onSubmit, onGuestBlocked }) {
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState(postColors[0]);
  const [imageUri, setImageUri] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const extraColors = useMemo(() => (isPremium ? ["#f97316", "#ec4899"] : []), [isPremium]);

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
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Close</Text>
          </Pressable>
          <Text style={styles.channelLabel}>@{defaultChannel}</Text>
          <Pressable
            disabled={!canPublish}
            onPress={() => {
              onSubmit({
                content: content.trim(),
                color: selectedColor,
                channel: defaultChannel,
                image: imageUri,
                isAnonymous
              });
              setContent("");
              setImageUri(null);
              setIsAnonymous(true);
            }}
            style={[styles.publish, !canPublish && styles.publishDisabled]}
          >
            <Text style={styles.publishText}>Publish</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          <TextInput
            multiline
            maxLength={250}
            placeholder="What is happening in your Mahala?"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={content}
            onChangeText={setContent}
            style={styles.input}
          />
          <Text style={styles.counter}>{content.length}/250</Text>
          {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}
        </ScrollView>

        <View style={styles.footer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorRow}>
            {postColors.concat(extraColors).map((color) => (
              <Pressable key={color} onPress={() => setSelectedColor(color)} style={[styles.colorDot, { backgroundColor: color }, selectedColor === color && styles.colorDotActive]} />
            ))}
          </ScrollView>

          <View style={styles.actionRow}>
            <Pressable onPress={pickImage} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{imageUri ? "Change image" : "Add image"}</Text>
            </Pressable>

            <View style={styles.switchWrap}>
              <Text style={styles.switchText}>{isAnonymous ? "Anonymous" : `@${currentUser.username}`}</Text>
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
    paddingTop: 18,
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
    gap: 12
  },
  actionButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center"
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900"
  },
  switchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 14,
    borderRadius: 18
  },
  switchText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800"
  }
});
