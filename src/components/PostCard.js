import React, { useState } from "react";
import { Image, ImageBackground, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, layout, shadows } from "../constants/theme";

export default function PostCard({ post, votedValue, onOpen, onVote, onReport, onHide }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const isImagePost = Boolean(post.isImage && post.imageUri);

  const openMenu = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setMenuOpen(true);
  };

  if (isImagePost) {
    return (
      <>
        <Pressable
          delayLongPress={420}
          onLongPress={() => setPreviewOpen(true)}
          onPressOut={() => setPreviewOpen(false)}
          style={styles.imageCard}
        >
          <ImageBackground
            source={{ uri: post.imageUri }}
            style={styles.imageBackground}
            imageStyle={styles.imageBackgroundImage}
            blurRadius={18}
            resizeMode="cover"
          >
            <View style={styles.imageShade} />

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>@{post.author}</Text>
              <Text style={styles.metaText}>-</Text>
              <Text style={styles.metaText}>{post.location}</Text>
              <Text style={styles.metaText}>-</Text>
              <Text style={styles.metaText}>{post.timeAgo}</Text>
            </View>

            <View style={styles.imagePromptWrap}>
              <Text style={styles.imageMaskText}>Drzi za pregled slike</Text>
            </View>

            <View style={styles.footer}>
              <Pressable onPress={() => onOpen(post)} style={styles.pill}>
                <Text style={styles.pillText}>{post.commentCount} odgovora</Text>
              </Pressable>

              <Pressable onPress={openMenu} style={[styles.pill, styles.drot]}>
                <Text style={styles.drotText}>DROT</Text>
              </Pressable>
            </View>

            <VoteColumn post={post} votedValue={votedValue} onVote={onVote} image />
          </ImageBackground>
        </Pressable>

        <ModerationModal
          visible={menuOpen}
          post={post}
          onClose={() => setMenuOpen(false)}
          onReport={onReport}
          onHide={onHide}
        />

        <Modal animationType="fade" transparent visible={previewOpen} onRequestClose={() => setPreviewOpen(false)}>
          <Pressable
            style={styles.previewWrap}
            onPressOut={() => setPreviewOpen(false)}
            onTouchEnd={() => setPreviewOpen(false)}
          >
            <Image source={{ uri: post.imageUri }} style={styles.previewImage} resizeMode="contain" />
          </Pressable>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Pressable onPress={() => onOpen(post)} style={[styles.card, { backgroundColor: post.color }]}>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>@{post.author}</Text>
          <Text style={styles.metaText}>-</Text>
          <Text style={styles.metaText}>{post.location}</Text>
          <Text style={styles.metaText}>-</Text>
          <Text style={styles.metaText}>{post.timeAgo}</Text>
        </View>

        <Text style={styles.content}>{post.content}</Text>

        <View style={styles.footer}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{post.commentCount} odgovora</Text>
          </View>

          <Pressable onPress={openMenu} style={[styles.pill, styles.drot]}>
            <Text style={styles.drotText}>DROT</Text>
          </Pressable>
        </View>

        <VoteColumn post={post} votedValue={votedValue} onVote={onVote} />
      </Pressable>

      <ModerationModal
        visible={menuOpen}
        post={post}
        onClose={() => setMenuOpen(false)}
        onReport={onReport}
        onHide={onHide}
      />
    </>
  );
}

function VoteColumn({ post, votedValue, onVote, image = false }) {
  return (
    <View style={[styles.voteColumn, image && styles.imageVoteColumn]}>
      <Pressable onPress={() => onVote(post.id, 1)} style={styles.voteButton}>
        <Text style={[styles.voteArrow, votedValue === 1 && styles.voteArrowActive]}>+</Text>
      </Pressable>
      <Text style={styles.voteScore}>{post.score}</Text>
      <Pressable onPress={() => onVote(post.id, -1)} style={styles.voteButton}>
        <Text style={[styles.voteArrow, votedValue === -1 && styles.voteArrowActive]}>-</Text>
      </Pressable>
    </View>
  );
}

function ModerationModal({ visible, post, onClose, onReport, onHide }) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalWrap}>
        <View style={styles.menuCard}>
          <Text style={styles.menuTitle}>Sta nije uredu?</Text>
          <Pressable
            onPress={() => {
              onClose();
              onReport(post.id);
            }}
            style={[styles.menuButton, styles.menuDanger]}
          >
            <Text style={styles.menuButtonText}>Prijavi zloupotrebu</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              onClose();
              onHide(post.id);
            }}
            style={styles.menuButton}
          >
            <Text style={styles.menuButtonText}>Sakrij ovu objavu</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.menuGhost}>
            <Text style={styles.menuGhostText}>Zatvori</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
  imageCard: {
    height: 176,
    marginBottom: 12,
    borderRadius: layout.cardRadius,
    overflow: "hidden",
    backgroundColor: "#050505",
    ...shadows.card
  },
  imageBackground: {
    flex: 1,
    justifyContent: "space-between",
    padding: 18,
    paddingRight: 66
  },
  imageBackgroundImage: {
    borderRadius: layout.cardRadius
  },
  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)"
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 12,
    zIndex: 3
  },
  metaText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  imagePromptWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 68,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3
  },
  imageMaskText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.3,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.44)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    overflow: "hidden"
  },
  content: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    paddingRight: 54,
    zIndex: 3
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: "auto",
    zIndex: 3
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: layout.pillRadius,
    backgroundColor: "rgba(0,0,0,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  pillText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "800"
  },
  drot: {
    backgroundColor: "rgba(0,0,0,0.24)"
  },
  drotText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1
  },
  voteColumn: {
    position: "absolute",
    right: 10,
    top: 48,
    width: 42,
    borderRadius: 21,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    zIndex: 4
  },
  imageVoteColumn: {
    right: 12,
    top: 42,
    width: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.38)"
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
