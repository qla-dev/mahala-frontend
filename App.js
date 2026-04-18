import "react-native-gesture-handler";
import "react-native-reanimated";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultTheme, getFocusedRouteNameFromRoute, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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

const RootStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ROUTE = {
  AUTH: "AUTH",
  APP: "APP",
  TABS: "TABS",
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

const TAB_ITEMS = {
  [ROUTE.FEED]: { label: "Feed", icon: "home" },
  [ROUTE.SEARCH]: { label: "Pretraga", icon: "search" },
  [ROUTE.MAP]: { label: "Mapa", icon: "map" },
  [ROUTE.NOTIFICATIONS]: { label: "Alerti", icon: "notifications" },
  [ROUTE.PROFILE]: { label: "Profil", icon: "person" }
};

const TITLES = {
  [ROUTE.SEARCH]: "Kanali",
  [ROUTE.MAP]: "Mapa",
  [ROUTE.NOTIFICATIONS]: "Obavijesti",
  [ROUTE.PROFILE]: "Profil",
  [ROUTE.CHANNEL_DETAIL]: "Kanal",
  [ROUTE.POST_DETAIL]: "Mahala",
  [ROUTE.PREMIUM_HUB]: "Mahala Plus",
  [ROUTE.SETTINGS]: "Postavke",
  [ROUTE.CHANGE_PASSWORD]: "Promjena lozinke",
  [ROUTE.EDIT_NAME]: "Uredi ime",
  [ROUTE.EDIT_EMAIL]: "Uredi email",
  [ROUTE.MY_POSTS]: "Moje Mahale",
  [ROUTE.MY_REPLIES]: "Moji odgovori",
  [ROUTE.MY_VOTES]: "Moji glasovi"
};

const HIDDEN_POSTS_KEY = "mahala.hiddenPosts";

export default function App() {
  const { authState, bootstrap, signIn, signUp, continueAsGuest, logout, updateUser } = useAuth(INITIAL_USER);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
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

  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: colors.background,
        card: colors.background,
        border: colors.border,
        primary: colors.text,
        text: colors.text
      }
    }),
    []
  );

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
  };

  const handleGuestLogin = async () => {
    await continueAsGuest();
  };

  const handleLogout = async () => {
    setSelectedChannel(null);
    setSelectedPostId(null);
    await logout();
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

  const getNavigatorForRoute = (navigation, routeName) => {
    const routeNames = navigation?.getState?.()?.routeNames || [];
    if (routeNames.includes(routeName)) {
      return navigation;
    }

    return navigation?.getParent?.() || navigation;
  };

  const openPost = (navigation, post) => {
    const targetNavigation = getNavigatorForRoute(navigation, ROUTE.POST_DETAIL);
    setSelectedPostId(post.id);
    targetNavigation?.navigate(ROUTE.POST_DETAIL, { postId: post.id });
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

  const getChannelPosts = (channel) => {
    if (!channel) {
      return [];
    }

    return visiblePosts.filter((post) => post.channel === channel.slug);
  };

  const openAppScreen = (navigation, screenName, params) => {
    getNavigatorForRoute(navigation, screenName)?.navigate(screenName, params);
  };

  const renderHeaderButton = ({ icon, label, onPress }) => (
    <Pressable onPress={onPress} style={styles.headerButton} hitSlop={10}>
      <Ionicons name={icon} size={label ? 14 : 21} color={colors.text} />
      {label ? <Text style={styles.headerButtonText}>{label}</Text> : null}
    </Pressable>
  );

  const renderMainTabs = () => (
    <Tab.Navigator
      initialRouteName={ROUTE.FEED}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.subdued,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarIcon: ({ color, size }) => <Ionicons name={TAB_ITEMS[route.name]?.icon || "ellipse"} size={size} color={color} />
      })}
    >
      <Tab.Screen
        name={ROUTE.FEED}
        options={{ title: TAB_ITEMS[ROUTE.FEED].label }}
        listeners={{ tabPress: () => Haptics.selectionAsync() }}
      >
        {({ navigation }) => (
          <FeedScreen
            posts={visiblePosts}
            currentLocation={location}
            votedPosts={votedPosts}
            onVote={handleVote}
            onOpenPost={(post) => openPost(navigation, post)}
            onOpenCreatePost={() => setCreatingPost(true)}
            onUpgrade={() => openAppScreen(navigation, ROUTE.PREMIUM_HUB)}
            onReport={() => Alert.alert("Drot provjerava", "Prijava je poslana na moderatorski pregled.")}
            onHide={handleHidePost}
            refreshControl={<RefreshControl tintColor={colors.text} refreshing={feedRefreshing} onRefresh={handleRefresh} />}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name={ROUTE.SEARCH}
        options={{ title: TAB_ITEMS[ROUTE.SEARCH].label }}
        listeners={{ tabPress: () => Haptics.selectionAsync() }}
      >
        {({ navigation }) => (
          <SearchScreen
            channels={CHANNELS}
            location={location}
            isPremium={authState.isPremium}
            onUpgrade={() => openAppScreen(navigation, ROUTE.PREMIUM_HUB)}
            onSelectChannel={(channel) => {
              setSelectedChannel(channel);
              openAppScreen(navigation, ROUTE.CHANNEL_DETAIL, { channelId: channel.id });
            }}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name={ROUTE.MAP}
        options={{ title: TAB_ITEMS[ROUTE.MAP].label }}
        listeners={{ tabPress: () => Haptics.selectionAsync() }}
      >
        {({ navigation }) => (
          <MapScreen
            posts={visiblePosts}
            city={CITIES.find((item) => item.name === location)}
            onOpenPost={(post) => openPost(navigation, post)}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name={ROUTE.NOTIFICATIONS}
        options={{ title: TAB_ITEMS[ROUTE.NOTIFICATIONS].label }}
        listeners={{ tabPress: () => Haptics.selectionAsync() }}
      >
        {({ navigation }) => <NotificationsScreen items={NOTIFICATIONS} onUpgrade={() => openAppScreen(navigation, ROUTE.PREMIUM_HUB)} />}
      </Tab.Screen>

      <Tab.Screen
        name={ROUTE.PROFILE}
        options={{ title: TAB_ITEMS[ROUTE.PROFILE].label }}
        listeners={{ tabPress: () => Haptics.selectionAsync() }}
      >
        {({ navigation }) => (
          <ProfileScreen
            user={authState.user}
            isGuest={authState.isGuest}
            isPremium={authState.isPremium}
            credits={credits}
            furka={furka}
            onOpenPurchase={setActivePurchase}
            onUpgrade={() => openAppScreen(navigation, ROUTE.PREMIUM_HUB)}
            onOpenActivity={(view) => {
              if (authState.isGuest) {
                openGuestGate("Ova sekcija je dostupna samo registrovanim clanovima.");
                return;
              }
              openAppScreen(navigation, view);
            }}
            onOpenSettings={() => openAppScreen(navigation, ROUTE.SETTINGS)}
            onLogout={handleLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );

  const getTabsTitle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) || ROUTE.FEED;
    return routeName === ROUTE.FEED ? location : TITLES[routeName] || TAB_ITEMS[routeName]?.label || "Mahala";
  };

  const tabsOptions = ({ navigation, route }) => ({
    title: getTabsTitle(route),
    headerLeft: () => renderHeaderButton({ icon: "settings-sharp", onPress: () => navigation.navigate(ROUTE.SETTINGS) }),
    headerRight: () => (
      <View style={styles.headerActions}>
        {renderHeaderButton({ icon: "location", onPress: () => setLocationPickerOpen(true) })}
        {renderHeaderButton({ icon: "sparkles", label: "PLUS", onPress: () => navigation.navigate(ROUTE.PREMIUM_HUB) })}
        {renderHeaderButton({ icon: "add", onPress: () => setZoneModalOpen(true) })}
      </View>
    )
  });

  const renderAppNavigator = () => (
    <>
      <AppStack.Navigator
        screenOptions={{
          animation: "slide_from_right",
          contentStyle: { backgroundColor: colors.background },
          gestureEnabled: true,
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleAlign: "center",
          headerTitleStyle: styles.nativeHeaderTitle
        }}
      >
        <AppStack.Screen name={ROUTE.TABS} options={tabsOptions}>
          {() => renderMainTabs()}
        </AppStack.Screen>

        <AppStack.Screen
          name={ROUTE.CHANNEL_DETAIL}
          options={({ route }) => {
            const channel = selectedChannel || CHANNELS.find((item) => item.id === route.params?.channelId);
            return { title: channel ? `@${channel.name}` : TITLES[ROUTE.CHANNEL_DETAIL] };
          }}
        >
          {({ navigation, route }) => {
            const channel = selectedChannel || CHANNELS.find((item) => item.id === route.params?.channelId);
            return (
              <ChannelDetailScreen
                channel={channel}
                posts={getChannelPosts(channel)}
                votedPosts={votedPosts}
                onVote={handleVote}
                onOpenPost={(post) => openPost(navigation, post)}
                onOpenCreatePost={() => setCreatingPost(true)}
                onReport={() => Alert.alert("Drot provjerava", "Prijava je poslana na moderatorski pregled.")}
                onHide={handleHidePost}
              />
            );
          }}
        </AppStack.Screen>

        <AppStack.Screen name={ROUTE.POST_DETAIL} options={{ title: TITLES[ROUTE.POST_DETAIL] }}>
          {({ route }) => {
            const post = visiblePosts.find((item) => item.id === route.params?.postId) || selectedPost;
            return <PostDetailScreen post={post} votedPosts={votedPosts} onVote={handleVote} onReply={handleReply} />;
          }}
        </AppStack.Screen>

        <AppStack.Screen name={ROUTE.PREMIUM_HUB} options={{ title: TITLES[ROUTE.PREMIUM_HUB] }}>
          {() => <PremiumHubScreen onPurchase={() => updateUser({ isPremium: true })} />}
        </AppStack.Screen>

        <AppStack.Screen name={ROUTE.SETTINGS} options={{ title: TITLES[ROUTE.SETTINGS] }}>
          {({ navigation }) => (
            <SettingsScreen
              user={authState.user}
              location={location}
              notificationsEnabled={notificationsEnabled}
              isGuest={authState.isGuest}
              onToggleNotifications={setNotificationsEnabled}
              onOpenLocationPicker={() => setLocationPickerOpen(true)}
              onOpenEditName={() =>
                authState.isGuest ? openGuestGate("Gost korisnici ne mogu uredjivati profilne podatke.") : navigation.navigate(ROUTE.EDIT_NAME)
              }
              onOpenEditEmail={() =>
                authState.isGuest ? openGuestGate("Gost korisnici ne mogu uredjivati profilne podatke.") : navigation.navigate(ROUTE.EDIT_EMAIL)
              }
              onOpenChangePassword={() =>
                authState.isGuest ? openGuestGate("Gost korisnici ne mogu mijenjati lozinku.") : navigation.navigate(ROUTE.CHANGE_PASSWORD)
              }
              onLogout={handleLogout}
            />
          )}
        </AppStack.Screen>

        <AppStack.Screen name={ROUTE.CHANGE_PASSWORD} options={{ title: TITLES[ROUTE.CHANGE_PASSWORD] }}>
          {() => <ChangePasswordScreen onSubmit={() => Alert.alert("Lozinka azurirana", "Tvoja lozinka je uspjesno promijenjena.")} />}
        </AppStack.Screen>

        <AppStack.Screen name={ROUTE.EDIT_NAME} options={{ title: TITLES[ROUTE.EDIT_NAME] }}>
          {({ navigation }) => (
            <EditNameScreen
              user={authState.user}
              onSave={(payload) => {
                updateUser(payload);
                navigation.goBack();
              }}
            />
          )}
        </AppStack.Screen>

        <AppStack.Screen name={ROUTE.EDIT_EMAIL} options={{ title: TITLES[ROUTE.EDIT_EMAIL] }}>
          {({ navigation }) => (
            <EditEmailScreen
              user={authState.user}
              onSave={(payload) => {
                updateUser(payload);
                navigation.goBack();
              }}
            />
          )}
        </AppStack.Screen>

        <AppStack.Screen name={ROUTE.MY_POSTS} options={{ title: TITLES[ROUTE.MY_POSTS] }}>
          {({ navigation }) => (
            <MyActivityScreen
              title={TITLES[ROUTE.MY_POSTS]}
              posts={visiblePosts.filter((post) => post.author === authState.user.username)}
              onOpenPost={(post) => openPost(navigation, post)}
            />
          )}
        </AppStack.Screen>

        <AppStack.Screen name={ROUTE.MY_REPLIES} options={{ title: TITLES[ROUTE.MY_REPLIES] }}>
          {({ navigation }) => (
            <MyActivityScreen
              title={TITLES[ROUTE.MY_REPLIES]}
              posts={visiblePosts.filter((post) => (post.replies || []).some((reply) => reply.author === authState.user.username))}
              onOpenPost={(post) => openPost(navigation, post)}
            />
          )}
        </AppStack.Screen>

        <AppStack.Screen name={ROUTE.MY_VOTES} options={{ title: TITLES[ROUTE.MY_VOTES] }}>
          {({ navigation }) => (
            <MyActivityScreen
              title={TITLES[ROUTE.MY_VOTES]}
              posts={visiblePosts.filter((post) => (votedPosts[post.id] || 0) !== 0)}
              onOpenPost={(post) => openPost(navigation, post)}
            />
          )}
        </AppStack.Screen>
      </AppStack.Navigator>

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
          updateUser({ isPremium: true });
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
    </>
  );

  if (!authState.ready) {
    return (
      <GestureHandlerRootView style={styles.gestureRoot}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.boot}>
            <StatusBar style="light" />
            <Text style={styles.bootTitle}>MAHALA</Text>
            <Text style={styles.bootCopy}>Ucitavanje tvoje lokalne scene...</Text>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer theme={navTheme}>
          <RootStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
            {!authState.loggedIn ? (
              <RootStack.Screen name={ROUTE.AUTH}>
                {() => (
                  <SafeAreaView style={styles.root}>
                    <AuthScreen onSubmit={handleAuthSuccess} onGuest={handleGuestLogin} />
                  </SafeAreaView>
                )}
              </RootStack.Screen>
            ) : (
              <RootStack.Screen name={ROUTE.APP}>{() => renderAppNavigator()}</RootStack.Screen>
            )}
          </RootStack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1
  },
  root: {
    flex: 1,
    backgroundColor: colors.background
  },
  nativeHeaderTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  headerButton: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5
  },
  headerButtonText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8
  },
  tabBar: {
    height: 72,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: colors.background,
    borderTopColor: colors.border
  },
  tabItem: {
    paddingVertical: 4
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "800"
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
