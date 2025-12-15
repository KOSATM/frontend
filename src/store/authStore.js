import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isInitialized = ref(false)

  // getters
  const isLoggedIn = computed(() => isAuthenticated.value)
  const userName = computed(() => user.value?.name)
  const userEmail = computed(() => user.value?.email)
  const userProfileImage = computed(() => user.value?.picture)
  const userId = computed(() => user.value?.id)

  // OAuth 로그인 직후 호출
  const setOAuthUser = (oauthData) => {
    user.value = oauthData
    isAuthenticated.value = true
    isInitialized.value = true
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  // 로그아웃
  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    isInitialized.value = true
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  // 새로고침 / 재접속 복구용
  const initializeAuth = () => {
    if (isInitialized.value) return

    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        user.value = JSON.parse(userStr)
        isAuthenticated.value = true
      }
    } catch (e) {
      console.error('❌ Auth init failed', e)
      isAuthenticated.value = false
    } finally {
      isInitialized.value = true
    }
  }

  return {
    user,
    isAuthenticated,
    isLoggedIn,
    userName,
    userEmail,
    userProfileImage,
    userId,
    setOAuthUser,
    logout,
    initializeAuth
  }
})
