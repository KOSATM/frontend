import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  //초기화 상태 추적
  const isLoading = ref(true)

  // Getters
  const isLoggedIn = computed(() => isAuthenticated.value)
  const userName = computed(() => user.value?.name)
  const userEmail = computed(() => user.value?.email)
  const userProfileImage = computed(() => user.value?.picture)
  const userId = computed(() => user.value?.id)

  // Actions
  const setOAuthUser = (oauthData) => {
    user.value = oauthData
    isAuthenticated.value = true
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  const initializeAuth = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        user.value = JSON.parse(userStr);
        isAuthenticated.value = true;
      }
    } catch (e) {
      console.error('❌ Auth 초기화 실패:', e);
    } finally {
      isLoading.value = false; //초기화 완료
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,

    // Getters
    isLoggedIn,
    userName,
    userEmail,
    userProfileImage,
    userId,

    // Actions
    setOAuthUser,
    logout,
    initializeAuth
  }
})