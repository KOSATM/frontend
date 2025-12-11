import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)

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
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          user.value = JSON.parse(userStr)
          isAuthenticated.value = true
          console.log('✅ Auth initialized:', user.value)
        } catch (e) {
          console.error('❌ Failed to parse user:', e)
          isAuthenticated.value = false
        }
      }
    } catch (storageError) {
      console.error('❌ LocalStorage access denied during auth init:', storageError);
      // 스토리지 접근 불가 시 로그아웃 상태로 처리하거나 메모리상의 임시 처리가 필요함
      isAuthenticated.value = false;
    }
  }

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
    initializeAuth
  }
})