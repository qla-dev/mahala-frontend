import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import PostCard from "../components/PostCard";
import { colors, shadows } from "../constants/theme";

export default function ChannelDetailScreen({ channel, posts, votedPosts, onVote, onOpenPost, onOpenCreatePost, onReport, onHide }) {
  if (!channel) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={[styles.dot, { backgroundColor: channel.color }]} />
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>@{channel.name}</Text>
            <Text style={styles.heroCopy}>{channel.description}</Text>
          </View>
        </View>

        {posts.map((post) => (
          <PostCard key={post.id} post={post} votedValue={votedPosts[post.id] || 0} onVote={onVote} onOpen={onOpenPost} onReport={onReport} onHide={onHide} />
        ))}
      </ScrollView>

      <Pressable onPress={onOpenCreatePost} style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
  },
  content: {
    padding: 16,
    paddingBottom: 140
  },
  hero: {
    flexDirection: "row",
    gap: 14,
    borderRadius: 24,
    padding: 18,
    backgroundColor: colors.panel,
    marginBottom: 16
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginTop: 6
  },
  heroText: {
    flex: 1
  },
  heroTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 5
  },
  heroCopy: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600"
  },
  fab: {
    position: "absolute",
    bottom: 88,
    alignSelf: "center",
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.glow
  },
  fabText: {
    color: colors.whiteButtonText,
    fontSize: 40,
    fontWeight: "900",
    marginTop: -4
  }
});
