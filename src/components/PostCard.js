import React, { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, layout, shadows } from "../constants/theme";

export default function PostCard({ post, votedValue, onOpen, onVote, onReport, onHide }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <Pressable onPress={() => onOpen(post)} style={[styles.card, { backgroundColor: post.color }]}>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>@{post.author}</Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>{post.location}</Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>{post.timeAgo}</Text>
        </View>

        {post.isImage && post.imageUri ? (
          <Pressable onLongPress={() => setPreviewOpen(true)} delayLongPress={180} style={styles.imageWrap}>
            <Image source={{ uri: post.imageUri }} style={styles.image} />
            <View style={styles.imageMask}>
              <Text style={styles.imageMaskText}>Hold to preview</Text>
            </View>
          </Pressable>
        ) : null}

        <Text style={styles.content}>{post.content}</Text>

        <View style={styles.footer}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{post.commentCount} replies</Text>
          </View>

          <Pressable
            onPress={async () => {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              setMenuOpen(true);
            }}
            style={[styles.pill, styles.drot]}
          >
            <Text style={styles.drotText}>DROT</Text>
          </Pressable>
        </View>

        <View style={styles.voteColumn}>
          <Pressable onPress={() => onVote(post.id, 1)} style={styles.voteButton}>
            <Text style={[styles.voteArrow, votedValue === 1 && styles.voteArrowActive]}>+</Text>
          </Pressable>
          <Text style={styles.voteScore}>{post.score}</Text>
          <Pressable onPress={() => onVote(post.id, -1)} style={styles.voteButton}>
            <Text style={[styles.voteArrow, votedValue === -1 && styles.voteArrowActive]}>-</Text>
          </Pressable>
        </View>
      </Pressable>

      <Modal animationType="fade" transparent visible={menuOpen} onRequestClose={() => setMenuOpen(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>What feels wrong?</Text>
            <Pressable onPress={() => { setMenuOpen(false); onReport(post.id); }} style={[styles.menuButton, styles.menuDanger]}>
              <Text style={styles.menuButtonText}>Report abuse</Text>
            </Pressable>
            <Pressable onPress={() => { setMenuOpen(false); onHide(post.id); }} style={styles.menuButton}>
              <Text style={styles.menuButtonText}>Hide this post</Text>
            </Pressable>
            <Pressable onPress={() => setMenuOpen(false)} style={styles.menuGhost}>
              <Text style={styles.menuGhostText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent visible={previewOpen} onRequestClose={() => setPreviewOpen(false)}>
        <Pressable style={styles.previewWrap} onPress={() => setPreviewOpen(false)}>
          <Image source={{ uri: post.imageUri }} style={styles.previewImage} resizeMode="contain" />
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 170,
    borderRadius: layout.cardRadius,
    padding: 18,
    marginBottom: 12,
    overflow: "hidden",
    ...shadows.card
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 12
  },
  metaText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  imageWrap: {
    height: 180,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 14
  },
  image: {
    width: "100%",
    height: "100%"
  },
  imageMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center"
  },
  imageMaskText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.3
  },
  content: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    paddingRight: 60
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 18
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: layout.pillRadius,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  pillText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "800"
  },
  drot: {
    backgroundColor: "rgba(0,0,0,0.22)"
  },
  drotText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1
  },
  voteColumn: {
    position: "absolute",
    right: 14,
    top: "30%",
    width: 42,
    borderRadius: 21,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  voteButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  voteArrow: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 24,
    fontWeight: "900"
  },
  voteArrowActive: {
    color: colors.text
  },
  voteScore: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  modalWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.82)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  menuCard: {
    width: "100%",
    backgroundColor: colors.panel,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20
  },
  menuTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 16
  },
  menuButton: {
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: colors.panelAlt,
    marginBottom: 10,
    alignItems: "center"
  },
  menuDanger: {
    backgroundColor: "rgba(239,68,68,0.16)"
  },
  menuButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  menuGhost: {
    alignItems: "center",
    paddingVertical: 10
  },
  menuGhostText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  previewWrap: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center"
  },
  previewImage: {
    width: "100%",
    height: "100%"
  }
});
