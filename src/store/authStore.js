import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const isAuthenticated = ref(false);

  // Getters
  const isLoggedIn = computed(() => isAuthenticated.value);
  const userName = computed(() => user.value?.name);
  const userEmail = computed(() => user.value?.email);
  const userProfileImage = computed(() => user.value?.profileImage);
  const userId = computed(() => user.value?.id);

  // Actions
  const setOAuthUser = (oauthData) => {
    user.value = {
      id: oauthData.id,
      name: oauthData.name,
      email: oauthData.email,
      profileImage: oauthData.picture
    };
    isAuthenticated.value = true;
    localStorage.setItem('user', JSON.stringify(user.value));
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('user');
  };

  const loadStoredUser = () => {
    const stored = localStorage.getItem('user');
    if (stored) {
      user.value = JSON.parse(stored);
      isAuthenticated.value = true;
    }
  };

  const initializeAuth = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        user.value = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          profileImage: userData.picture
        };
        isAuthenticated.value = true;
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
  };

  return {
    // State
    user,
    isAuthenticated,

    // Getters
    isLoggedIn,
    userName,
    userEmail,
    userProfileImage,
    userId,

    // Actions
    setOAuthUser,
    logout,
    loadStoredUser,
    initializeAuth
  };
});
