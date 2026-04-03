import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

export default function MyActivityScreen({ title, posts, onOpenPost }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>{title}</Text>
      {posts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nothing here yet.</Text>
        </View>
      ) : (
        posts.map((post) => (
          <Pressable key={post.id} onPress={() => onOpenPost(post)} style={[styles.card, { borderLeftColor: post.color }]}>
            <Text style={styles.cardMeta}>@{post.author} • {post.timeAgo}</Text>
            <Text style={styles.cardBody}>{post.content}</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 16
  },
  empty: {
    borderRadius: 24,
    padding: 22,
    backgroundColor: colors.panel,
    alignItems: "center"
  },
  emptyText: {
    color: colors.muted,
    fontWeight: "700"
  },
  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: colors.panel,
    marginBottom: 12,
    borderLeftWidth: 4
  },
  cardMeta: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 8
  },
  cardBody: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700"
  }
});
