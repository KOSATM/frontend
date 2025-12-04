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
    // URL 파라미터에서 토큰 받기
    const token = route.query.token
    const userId = route.query.userId
    const email = route.query.email

    console.log('🎉 OAuth callback received:', { token, userId, email })

    if (!token) {
      throw new Error('Token not found in URL')
    }

    // 토큰 저장
    localStorage.setItem('accessToken', token)
    localStorage.setItem('jwtToken', token) // axios에서 사용하는 키
    if (userId) {
      localStorage.setItem('userId', userId)
    }
    if (email) {
      localStorage.setItem('email', email)
    }

    // 사용자 정보 저장
    const user = {
      id: userId,
      email: email
    }
    localStorage.setItem('user', JSON.stringify(user))

    console.log('✅ Token saved successfully')

    // 프론트엔드 홈으로 리다이렉트
    setTimeout(() => {
      router.push('/')
    }, 500)
  } catch (error) {
    console.error('OAuth callback error:', error)
    setTimeout(() => {
      window.location.href = 'http://localhost:8080/login-error'
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
}

.spinner-border {
  color: white;
  margin-bottom: 20px;
}
</style>

