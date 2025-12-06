<template>
  <div class="oauth-callback-container">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p>로그인 중입니다...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  try {
    // URL 파라미터에서 Base64 인코딩된 userInfo 받기
    const encodedUserInfo = route.query.userInfo
    
    console.log('🎉 OAuth callback received')

    if (!encodedUserInfo) {
      console.log('No userInfo, redirecting to home')
      setTimeout(() => {
        router.push('/')
      }, 500)
      return
    }

    try {
      // Base64 디코딩
      const userInfoJson = atob(encodedUserInfo)
      console.log('📦 Decoded userInfo:', userInfoJson)
      
      // JSON 파싱
      const userInfo = JSON.parse(userInfoJson)
      
      console.log('✅ Parsed userInfo:', userInfo)

      // 토큰 저장
      localStorage.setItem('accessToken', userInfo.token)
      localStorage.setItem('jwtToken', userInfo.token)
      
      // 전체 사용자 정보 저장
      const user = {
        id: userInfo.userId,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        givenName: userInfo.givenName,
        familyName: userInfo.familyName,
        locale: userInfo.locale,
        emailVerified: userInfo.emailVerified,
        oauthId: userInfo.oauthId,
        oauthProvider: userInfo.oauthProvider
      }
      localStorage.setItem('user', JSON.stringify(user))

      console.log('✅ All user data saved to localStorage:', user)

      // window.location.href로 강제 리다이렉트 (새로고침 포함)
      window.location.href = '/'
    } catch (parseError) {
      console.error('Failed to parse userInfo:', parseError)
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    }
  } catch (error) {
    console.error('OAuth callback error:', error)
    setTimeout(() => {
      window.location.href = '/'
    }, 2000)
  }
})
</script>

<style scoped>
.oauth-callback-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 18px;
  gap: 20px;
}

.spinner-border {
  color: white;
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

p {
  font-size: 16px;
  font-weight: 500;
}
</style>