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
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(async () => {
  try {
    // URL 파라미터에서 Base64 인코딩된 userInfo 받기
    const encodedUserInfo = route.query.userInfo
    
    console.log('🎉 OAuth callback received, encoded:', encodedUserInfo)

    if (!encodedUserInfo) {
      console.log('❌ No userInfo in query params')
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
      return
    }

    // Base64 디코딩 (UTF-8 한글 처리)
    const binaryString = atob(encodedUserInfo)
    console.log('📦 Binary string decoded')
    
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    
    const userInfoJson = new TextDecoder('utf-8').decode(bytes)
    console.log('📄 Decoded JSON:', userInfoJson)
    
    // JSON 파싱
    const userInfo = JSON.parse(userInfoJson)
    console.log('✅ Parsed userInfo:', userInfo)

    // 토큰 저장
    localStorage.setItem('accessToken', userInfo.token)
    localStorage.setItem('jwtToken', userInfo.token)
    console.log('🔑 Token saved')
    
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
    console.log('👤 User saved:', user.name, '(' + user.email + ')')

    // 페이지 새로고침으로 리다이렉트
    console.log('🔄 Redirecting to home...')
    setTimeout(() => {
      window.location.href = '/'
    }, 500)
  } catch (error) {
    console.error('❌ OAuth callback error:', error)
    console.error('Error stack:', error.stack)
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
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
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