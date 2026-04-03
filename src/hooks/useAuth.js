import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "mahala.auth";

export function useAuth(initialUser) {
  const [authState, setAuthState] = useState({
    ready: false,
    loggedIn: false,
    isGuest: false,
    isPremium: false,
    token: null,
    user: initialUser
  });

  const bootstrap = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setAuthState((prev) => ({ ...prev, ready: true }));
        return;
      }

      const parsed = JSON.parse(raw);
      setAuthState({
        ready: true,
        loggedIn: true,
        isGuest: parsed.isGuest,
        isPremium: parsed.user?.isPremium || false,
        token: parsed.token,
        user: parsed.user
      });
    } catch (error) {
      setAuthState((prev) => ({ ...prev, ready: true }));
    }
  };

  const persist = async (payload) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const signIn = async ({ email }) => {
    const payload = {
      token: "mock-token",
      isGuest: false,
      user: {
        ...initialUser,
        email
      }
    };
    await persist(payload);
    setAuthState({
      ready: true,
      loggedIn: true,
      isGuest: false,
      isPremium: payload.user.isPremium,
      token: payload.token,
      user: payload.user
    });
  };

  const signUp = async ({ email, username }) => {
    const payload = {
      token: "mock-token",
      isGuest: false,
      user: {
        ...initialUser,
        email,
        username
      }
    };
    await persist(payload);
    setAuthState({
      ready: true,
      loggedIn: true,
      isGuest: false,
      isPremium: payload.user.isPremium,
      token: payload.token,
      user: payload.user
    });
  };

  const continueAsGuest = async () => {
    const payload = {
      token: "guest-token",
      isGuest: true,
      user: {
        ...initialUser,
        firstName: "Guest",
        lastName: "User",
        username: "gost",
        email: "guest@mahala.app"
      }
    };
    await persist(payload);
    setAuthState({
      ready: true,
      loggedIn: true,
      isGuest: true,
      isPremium: false,
      token: payload.token,
      user: payload.user
    });
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setAuthState({
      ready: true,
      loggedIn: false,
      isGuest: false,
      isPremium: false,
      token: null,
      user: initialUser
    });
  };

  const updateUser = async (partial) => {
    setAuthState((prev) => {
      const nextUser = { ...prev.user, ...partial };
      const nextState = {
        ...prev,
        user: nextUser,
        isPremium: nextUser.isPremium || false
      };
      persist({
        token: nextState.token,
        isGuest: nextState.isGuest,
        user: nextUser
      });
      return nextState;
    });
  };

  return { authState, bootstrap, signIn, signUp, continueAsGuest, logout, updateUser };
}
