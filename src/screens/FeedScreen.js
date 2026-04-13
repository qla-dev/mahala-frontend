import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import PostCard from "../components/PostCard";
import { colors, shadows } from "../constants/theme";

const TABS = ["Najnovije", "Popularno", "Blizu tebe"];

export default function FeedScreen({ posts, currentLocation, votedPosts, onVote, onOpenPost, onOpenCreatePost, onUpgrade, onReport, onHide, refreshControl }) {
  const [tab, setTab] = useState("Najnovije");

  const filteredPosts = useMemo(() => {
    if (tab === "Popularno") {
      return [...posts].sort((a, b) => b.score - a.score);
    }

    if (tab === "Blizu tebe") {
      return posts.filter((post) => post.location === currentLocation);
    }

    return posts;
  }, [posts, currentLocation, tab]);

  return (
    <View style={styles.wrap}>
      <ScrollView refreshControl={refreshControl} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.tabs}>
            {TABS.map((item) => (
              <Pressable key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.tabActive]}>
                <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {filteredPosts.map((post) => (
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 140
  },
  topRow: {
    marginBottom: 14
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    alignSelf: "flex-start"
  },
  tab: {
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center"
  },
  tabActive: {
    backgroundColor: "rgba(139,92,246,0.72)",
    borderColor: "rgba(255,255,255,0.24)"
  },
  tabText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  tabTextActive: {
    color: colors.text
  },
  fab: {
    position: "absolute",
    bottom: 26,
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
