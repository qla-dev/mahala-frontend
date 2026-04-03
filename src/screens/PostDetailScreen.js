import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/theme";

export default function PostDetailScreen({ post, onVote, onReply }) {
  const [reply, setReply] = useState("");

  if (!post) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: post.color }]}>
        <Text style={styles.meta}>@{post.author} • {post.location} • {post.timeAgo}</Text>
        <Text style={styles.body}>{post.content}</Text>
        <View style={styles.voteRow}>
          <Pressable onPress={() => onVote(post.id, 1)} style={styles.voteButton}>
            <Text style={styles.voteText}>Upvote</Text>
          </Pressable>
          <Text style={styles.score}>{post.score}</Text>
          <Pressable onPress={() => onVote(post.id, -1)} style={styles.voteButton}>
            <Text style={styles.voteText}>Downvote</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Replies</Text>
      {(post.replies || []).map((item) => (
        <View key={item.id} style={styles.replyCard}>
          <Text style={styles.replyAuthor}>@{item.author}</Text>
          <Text style={styles.replyBody}>{item.content}</Text>
          <Text style={styles.replyMeta}>{item.timeAgo}</Text>
        </View>
      ))}

      <TextInput multiline placeholder="Drop a reply" placeholderTextColor={colors.subdued} value={reply} onChangeText={setReply} style={styles.input} />
      <Pressable onPress={() => { if (!reply.trim()) return; onReply(post.id, reply.trim()); setReply(""); }} style={styles.replyButton}>
        <Text style={styles.replyButtonText}>Reply</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 60
  },
  hero: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 18
  },
  meta: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 12,
    textTransform: "uppercase"
  },
  body: {
    color: colors.text,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "900",
    marginBottom: 18
  },
  voteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  voteButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.18)"
  },
  voteText: {
    color: colors.text,
    fontWeight: "800"
  },
  score: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.3,
    textTransform: "uppercase",
    marginBottom: 10
  },
  replyCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: colors.panel,
    marginBottom: 10
  },
  replyAuthor: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8
  },
  replyBody: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    marginBottom: 8
  },
  replyMeta: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700"
  },
  input: {
    minHeight: 110,
    borderRadius: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    padding: 16,
    textAlignVertical: "top",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 12
  },
  replyButton: {
    marginTop: 12,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: colors.text
  },
  replyButtonText: {
    color: colors.whiteButtonText,
    fontWeight: "900"
  }
});
