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
          <Pressable onPress={onUpgrade} style={styles.plusButton}>
            <Text style={styles.plusButtonText}>PLUS</Text>
          </Pressable>
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
    gap: 14,
    marginBottom: 14
  },
  plusButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999
  },
  plusButtonText: {
    color: colors.whiteButtonText,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2
  },
  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.panel
  },
  tabActive: {
    backgroundColor: colors.accent
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
    bottom: 72,
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
