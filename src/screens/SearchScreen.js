import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/theme";

export default function SearchScreen({ channels, location, onSelectChannel }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <TextInput placeholder={`Pretrazi kanale u ${location}`} placeholderTextColor={colors.subdued} style={styles.search} />

      <Text style={styles.contextLabel}>Kanali</Text>
      <Text style={styles.contextCopy}>Mahala u kojoj si trenutno: {location}</Text>

      <Text style={styles.sectionLabel}>Preporuceni kanali</Text>
      {channels.map((channel) => (
        <Pressable key={channel.id} onPress={() => onSelectChannel(channel)} style={styles.channelCard}>
          <View style={[styles.channelBadge, { backgroundColor: channel.color }]} />
          <View style={styles.channelContent}>
            <View style={styles.channelTitleRow}>
              <Text style={styles.channelTitle}>@{channel.name}</Text>
              {channel.premium ? <Text style={styles.locked}>PREMIUM</Text> : null}
            </View>
            <Text style={styles.channelCopy}>{channel.description}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 120
  },
  search: {
    height: 56,
    backgroundColor: colors.panel,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 18
  },
  contextLabel: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 4
  },
  contextCopy: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 22
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 10
  },
  channelCard: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12
  },
  channelBadge: {
    width: 42,
    height: 42,
    borderRadius: 16
  },
  channelContent: {
    flex: 1
  },
  channelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5
  },
  channelTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  locked: {
    color: colors.warning,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2
  },
  channelCopy: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600"
  }
});
