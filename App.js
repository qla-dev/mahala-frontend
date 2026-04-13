import React, { useEffect, useMemo, useState } from "react";
import { Alert, RefreshControl, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Header from "./src/components/Header";
import Navbar from "./src/components/Navbar";
import CreatePostModal from "./src/components/CreatePostModal";
import PurchaseModal from "./src/components/PurchaseModal";
import GuestGateModal from "./src/components/GuestGateModal";
import LocationPickerModal from "./src/components/LocationPickerModal";
import AddZoneModal from "./src/components/AddZoneModal";
import AuthScreen from "./src/screens/AuthScreen";
import FeedScreen from "./src/screens/FeedScreen";
import SearchScreen from "./src/screens/SearchScreen";
import MapScreen from "./src/screens/MapScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ChannelDetailScreen from "./src/screens/ChannelDetailScreen";
import PostDetailScreen from "./src/screens/PostDetailScreen";
import PremiumHubScreen from "./src/screens/PremiumHubScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import EditNameScreen from "./src/screens/EditNameScreen";
import EditEmailScreen from "./src/screens/EditEmailScreen";
import MyActivityScreen from "./src/screens/MyActivityScreen";
import { CHANNELS, CITIES, INITIAL_CREDITS, INITIAL_POSTS, INITIAL_USER, NOTIFICATIONS } from "./src/constants/mockData";
import { colors, layout } from "./src/constants/theme";
import { useAuth } from "./src/hooks/useAuth";

const VIEW = {
  AUTH: "AUTH",
  FEED: "FEED",
  SEARCH: "SEARCH",
  MAP: "MAP",
  NOTIFICATIONS: "NOTIFICATIONS",
  PROFILE: "PROFILE",
  CHANNEL_DETAIL: "CHANNEL_DETAIL",
  POST_DETAIL: "POST_DETAIL",
  PREMIUM_HUB: "PREMIUM_HUB",
  SETTINGS: "SETTINGS",
  CHANGE_PASSWORD: "CHANGE_PASSWORD",
  EDIT_NAME: "EDIT_NAME",
  EDIT_EMAIL: "EDIT_EMAIL",
  MY_POSTS: "MY_POSTS",
  MY_REPLIES: "MY_REPLIES",
  MY_VOTES: "MY_VOTES"
};

const HIDDEN_POSTS_KEY = "mahala.hiddenPosts";

export default function App() {
  const { authState, bootstrap, signIn, signUp, continueAsGuest, logout, updateUser } = useAuth(INITIAL_USER);
  const [currentView, setCurrentView] = useState(VIEW.AUTH);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [settingsReturnView, setSettingsReturnView] = useState(VIEW.PROFILE);
  const [location, setLocation] = useState(CITIES[0].name);
  const [furka, setFurka] = useState(420);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [hiddenPostIds, setHiddenPostIds] = useState([]);
  const [votedPosts, setVotedPosts] = useState({});
  const [creatingPost, setCreatingPost] = useState(false);
  const [activePurchase, setActivePurchase] = useState(null);
  const [guestMessage, setGuestMessage] = useState("");
  const [guestGateOpen, setGuestGateOpen] = useState(false);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [credits, setCredits] = useState(INITIAL_CREDITS);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [feedRefreshing, setFeedRefreshing] = useState(false);

  useEffect(() => {
    bootstrap();
  }, []);

  useEffect(() => {
    if (authState.ready && authState.loggedIn) {
      setCurrentView(VIEW.FEED);
    }
  }, [authState.ready, authState.loggedIn]);

  useEffect(() => {
    AsyncStorage.getItem(HIDDEN_POSTS_KEY).then((value) => {
      if (!value) {
        return;
      }

      try {
        setHiddenPostIds(JSON.parse(value));
      } catch (error) {
        setHiddenPostIds([]);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(HIDDEN_POSTS_KEY, JSON.stringify(hiddenPostIds));
  }, [hiddenPostIds]);

  const visiblePosts = useMemo(() => posts.filter((post) => !hiddenPostIds.includes(post.id)), [posts, hiddenPostIds]);
  const selectedPost = useMemo(() => visiblePosts.find((post) => post.id === selectedPostId) || null, [selectedPostId, visiblePosts]);
  const selectedChannelPosts = useMemo(() => {
    if (!selectedChannel) {
      return [];
    }

    return visiblePosts.filter((post) => post.channel === selectedChannel.slug);
  }, [selectedChannel, visiblePosts]);

  const openGuestGate = (message) => {
    setGuestMessage(message);
    setGuestGateOpen(true);
  };

  const handleAuthSuccess = async (payload) => {
    if (payload.mode === "signin") {
      await signIn(payload);
    } else {
      await signUp(payload);
    }

    setCurrentView(VIEW.FEED);
  };

  const handleGuestLogin = async () => {
    await continueAsGuest();
    setCurrentView(VIEW.FEED);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView(VIEW.AUTH);
  };

  const handleGoBack = () => {
    if (currentView === VIEW.CHANNEL_DETAIL) {
      setCurrentView(VIEW.SEARCH);
      return;
    }

    if (currentView === VIEW.POST_DETAIL) {
      setCurrentView(selectedChannel ? VIEW.CHANNEL_DETAIL : VIEW.FEED);
      return;
    }

    if (currentView === VIEW.SETTINGS) {
      setCurrentView(settingsReturnView || VIEW.PROFILE);
      return;
    }

    if ([VIEW.PREMIUM_HUB, VIEW.MY_POSTS, VIEW.MY_REPLIES, VIEW.MY_VOTES].includes(currentView)) {
      setCurrentView(VIEW.PROFILE);
      return;
    }

    if ([VIEW.CHANGE_PASSWORD, VIEW.EDIT_NAME, VIEW.EDIT_EMAIL].includes(currentView)) {
      setCurrentView(VIEW.SETTINGS);
    }
  };

  const handleRefresh = async () => {
    setFeedRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setFeedRefreshing(false);
  };

  const handleVote = async (postId, value) => {
    if (authState.isGuest) {
      openGuestGate("Glasanje je dostupno samo registrovanim Mahala clanovima.");
      return;
    }

    await Haptics.selectionAsync();

    const currentVote = votedPosts[postId] || 0;
    const nextVote = currentVote === value ? 0 : value;
    const delta = nextVote - currentVote;

    setVotedPosts((prev) => ({ ...prev, [postId]: nextVote }));
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              score: post.score + delta,
              myVote: nextVote
            }
          : post
      )
    );
  };

  const handleHidePost = (postId) => {
    setHiddenPostIds((prev) => (prev.includes(postId) ? prev : [...prev, postId]));
  };

  const handleOpenPost = (post) => {
    setSelectedPostId(post.id);
    setCurrentView(VIEW.POST_DETAIL);
  };

  const handleCreatePost = async (payload) => {
    const authorUsername = payload.isAnonymous || authState.isGuest ? payload.channel.replace("@", "") : authState.user.username;
    const newPost = {
      id: String(Date.now()),
      author: authorUsername,
      channel: payload.channel.replace("@", ""),
      content: payload.content,
      location,
      timeAgo: "now",
      score: 0,
      commentCount: 0,
      color: payload.color,
      isImage: payload.image != null,
      imageUri: payload.image,
      isAnonymous: payload.isAnonymous,
      myVote: 0,
      masked: { bearingDeg: 28, ringKm: 2.5 },
      replies: []
    };

    setPosts((prev) => [newPost, ...prev]);
    setCreatingPost(false);
    setFurka((prev) => prev + 10);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleReply = (postId, content) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentCount: post.commentCount + 1,
              replies: [
                ...(post.replies || []),
                {
                  id: String(Date.now()),
                  author: authState.isGuest ? "guest" : authState.user.username,
                  content,
                  timeAgo: "now",
                  votes: 0,
                  isAnonymous: true
                }
              ]
            }
          : post
      )
    );
  };

  const renderScreen = () => {
    switch (currentView) {
      case VIEW.FEED:
        return (
          <FeedScreen
            posts={visiblePosts}
            currentLocation={location}
            votedPosts={votedPosts}
            onVote={handleVote}
            onOpenPost={handleOpenPost}
            onOpenCreatePost={() => setCreatingPost(true)}
            onUpgrade={() => setCurrentView(VIEW.PREMIUM_HUB)}
            onReport={() => Alert.alert("Drot provjerava", "Prijava je poslana na moderatorski pregled.")}
            onHide={handleHidePost}
            refreshControl={<RefreshControl tintColor={colors.text} refreshing={feedRefreshing} onRefresh={handleRefresh} />}
          />
        );
      case VIEW.SEARCH:
        return (
          <SearchScreen
            channels={CHANNELS}
            location={location}
            isPremium={authState.isPremium}
            onUpgrade={() => setCurrentView(VIEW.PREMIUM_HUB)}
            onSelectChannel={(channel) => {
              setSelectedChannel(channel);
              setCurrentView(VIEW.CHANNEL_DETAIL);
            }}
          />
        );
      case VIEW.MAP:
        return <MapScreen posts={visiblePosts} city={CITIES.find((item) => item.name === location)} onOpenPost={handleOpenPost} />;
      case VIEW.NOTIFICATIONS:
        return <NotificationsScreen items={NOTIFICATIONS} onUpgrade={() => setCurrentView(VIEW.PREMIUM_HUB)} />;
      case VIEW.PROFILE:
        return (
          <ProfileScreen
            user={authState.user}
            isGuest={authState.isGuest}
            isPremium={authState.isPremium}
            credits={credits}
            furka={furka}
            onOpenPurchase={setActivePurchase}
            onUpgrade={() => setCurrentView(VIEW.PREMIUM_HUB)}
            onOpenActivity={(view) => {
              if (authState.isGuest) {
                openGuestGate("Ova sekcija je dostupna samo registrovanim clanovima.");
                return;
              }
              setCurrentView(view);
            }}
            onOpenSettings={() => {
              setSettingsReturnView(currentView);
              setCurrentView(VIEW.SETTINGS);
            }}
            onLogout={handleLogout}
          />
        );
      case VIEW.CHANNEL_DETAIL:
        return (
          <ChannelDetailScreen
            channel={selectedChannel}
            posts={selectedChannelPosts}
            votedPosts={votedPosts}
            onVote={handleVote}
            onOpenPost={handleOpenPost}
            onOpenCreatePost={() => setCreatingPost(true)}
            onReport={() => Alert.alert("Drot provjerava", "Prijava je poslana na moderatorski pregled.")}
            onHide={handleHidePost}
          />
        );
      case VIEW.POST_DETAIL:
        return <PostDetailScreen post={selectedPost} votedPosts={votedPosts} onVote={handleVote} onReply={handleReply} />;
      case VIEW.PREMIUM_HUB:
        return <PremiumHubScreen onPurchase={() => updateUser({ isPremium: true })} />;
      case VIEW.SETTINGS:
        return (
          <SettingsScreen
            user={authState.user}
            location={location}
            notificationsEnabled={notificationsEnabled}
            isGuest={authState.isGuest}
            onToggleNotifications={setNotificationsEnabled}
            onOpenLocationPicker={() => setLocationPickerOpen(true)}
            onOpenEditName={() => (authState.isGuest ? openGuestGate("Gost korisnici ne mogu uredjivati profilne podatke.") : setCurrentView(VIEW.EDIT_NAME))}
            onOpenEditEmail={() => (authState.isGuest ? openGuestGate("Gost korisnici ne mogu uredjivati profilne podatke.") : setCurrentView(VIEW.EDIT_EMAIL))}
            onOpenChangePassword={() => (authState.isGuest ? openGuestGate("Gost korisnici ne mogu mijenjati lozinku.") : setCurrentView(VIEW.CHANGE_PASSWORD))}
            onLogout={handleLogout}
          />
        );
      case VIEW.CHANGE_PASSWORD:
        return <ChangePasswordScreen onSubmit={() => Alert.alert("Lozinka azurirana", "Tvoja lozinka je uspjesno promijenjena.")} />;
      case VIEW.EDIT_NAME:
        return <EditNameScreen user={authState.user} onSave={(payload) => { updateUser(payload); setCurrentView(VIEW.SETTINGS); }} />;
      case VIEW.EDIT_EMAIL:
        return <EditEmailScreen user={authState.user} onSave={(payload) => { updateUser(payload); setCurrentView(VIEW.SETTINGS); }} />;
      case VIEW.MY_POSTS:
        return <MyActivityScreen title="Moje Mahale" posts={visiblePosts.filter((post) => post.author === authState.user.username)} onOpenPost={handleOpenPost} />;
      case VIEW.MY_REPLIES:
        return <MyActivityScreen title="Moji odgovori" posts={visiblePosts.filter((post) => (post.replies || []).some((reply) => reply.author === authState.user.username))} onOpenPost={handleOpenPost} />;
      case VIEW.MY_VOTES:
        return <MyActivityScreen title="Moji glasovi" posts={visiblePosts.filter((post) => (votedPosts[post.id] || 0) !== 0)} onOpenPost={handleOpenPost} />;
      default:
        return null;
    }
  };

  if (!authState.ready) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.boot}>
          <StatusBar style="light" />
          <Text style={styles.bootTitle}>MAHALA</Text>
          <Text style={styles.bootCopy}>Ucitavanje tvoje lokalne scene...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!authState.loggedIn) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.root}>
          <StatusBar style="light" />
          <AuthScreen onSubmit={handleAuthSuccess} onGuest={handleGuestLogin} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const hideNavbar = [VIEW.POST_DETAIL, VIEW.CHANGE_PASSWORD, VIEW.EDIT_NAME, VIEW.EDIT_EMAIL].includes(currentView);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root}>
        <StatusBar style="light" />
        <Header
          view={currentView}
          title={location}
          channelName={selectedChannel?.name}
          isPremium={authState.isPremium}
          onBack={handleGoBack}
          onOpenSettings={() => {
            setSettingsReturnView(currentView);
            setCurrentView(VIEW.SETTINGS);
          }}
          onOpenLocationPicker={() => setLocationPickerOpen(true)}
          onOpenAddZone={() => setZoneModalOpen(true)}
          onUpgrade={() => setCurrentView(VIEW.PREMIUM_HUB)}
        />

        <View style={styles.content}>{renderScreen()}</View>

        {!hideNavbar ? <Navbar currentView={currentView} onChange={setCurrentView} /> : null}

        <CreatePostModal
          visible={creatingPost}
          defaultChannel={selectedChannel?.slug || CHANNELS[0].slug}
          currentUser={authState.user}
          isGuest={authState.isGuest}
          isPremium={authState.isPremium}
          onClose={() => setCreatingPost(false)}
          onSubmit={handleCreatePost}
          onGuestBlocked={() => openGuestGate("Gost korisnici mogu objavljivati samo anonimno.")}
        />

        <PurchaseModal
          visible={activePurchase != null}
          type={activePurchase}
          onClose={() => setActivePurchase(null)}
          onConfirm={(type, amount) => {
            if (authState.isGuest) {
              openGuestGate("Kupovine su dostupne tek nakon kreiranja Mahala racuna.");
              return;
            }

            setCredits((prev) => ({ ...prev, [type]: prev[type] + amount }));
            setActivePurchase(null);
          }}
          onUpgrade={() => {
            setActivePurchase(null);
            setCurrentView(VIEW.PREMIUM_HUB);
          }}
        />

        <GuestGateModal visible={guestGateOpen} message={guestMessage} onClose={() => setGuestGateOpen(false)} onAction={handleLogout} />
        <LocationPickerModal
          visible={locationPickerOpen}
          cities={CITIES}
          currentLocation={location}
          onClose={() => setLocationPickerOpen(false)}
          onSelect={(cityName) => {
            setLocation(cityName);
            setLocationPickerOpen(false);
          }}
        />
        <AddZoneModal visible={zoneModalOpen} onClose={() => setZoneModalOpen(false)} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1
  },
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: layout.screenPadding
  },
  bootTitle: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 8
  },
  bootCopy: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600"
  }
});
