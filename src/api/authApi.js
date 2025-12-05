import axios from './axios'

// 테스트 모드 여부
const ENABLE_MOCK = false

const OAUTH_REDIRECT_URI = 'http://localhost:8080/login/oauth2/code/google'
const GOOGLE_CLIENT_ID = process.env.VUE_APP_GOOGLE_CLIENT_ID || 'your_google_client_id'

console.log('📱 GOOGLE_CLIENT_ID loaded:', GOOGLE_CLIENT_ID)

// 모의 데이터
const MOCK_USER = {
  id: 'user_123',
  email: 'user@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  provider: 'google'
}

const MOCK_TOKEN = 'mock_access_token_' + Math.random().toString(36).substr(2, 9)

// Google OAuth 로그인 URL 생성
export const getGoogleOAuthUrl = () => {
  if (ENABLE_MOCK) {
    const mockCode = 'mock_auth_code_' + Math.random().toString(36).substr(2, 9)
    return `${OAUTH_REDIRECT_URI}?code=${mockCode}&state=mock_state`
  }
  
  // 백엔드의 OAuth 엔드포인트로 리다이렉트
  // window.location으로 이동하면 백엔드가 처리함
  const backendOAuthUrl = `http://localhost:8080/oauth2/authorization/google`
  
  console.log('📱 Using Backend OAuth URL:', backendOAuthUrl)
  
  return backendOAuthUrl
}

// OAuth 콜백 처리
export const handleOAuthCallback = async (code) => {
  if (ENABLE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          accessToken: MOCK_TOKEN,
          refreshToken: 'mock_refresh_token_' + Math.random().toString(36).substr(2, 9),
          user: MOCK_USER
        })
      }, 500)
    })
  }
  
  try {
    const response = await axios.post('/api/auth/oauth/callback', {
      code: code,
      provider: 'google'
    })
    return response.data
  } catch (error) {
    console.error('OAuth callback error:', error)
    throw error
  }
}

// 토큰으로 사용자 정보 조회
export const getUserInfo = async () => {
  if (ENABLE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_USER)
      }, 300)
    })
  }
  
  try {
    const response = await axios.get('/api/auth/user')
    return response.data
  } catch (error) {
    console.error('User info error:', error)
    throw error
  }
}

// 로그아웃
export const logout = async () => {
  if (ENABLE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }
  
  try {
    const response = await axios.post('/api/auth/logout')
    return response.data
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

// 토큰 갱신
export const refreshToken = async () => {
  if (ENABLE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          accessToken: 'mock_new_token_' + Math.random().toString(36).substr(2, 9)
        })
      }, 300)
    })
  }
  
  try {
    const response = await axios.post('/api/auth/refresh')
    return response.data
  } catch (error) {
    console.error('Token refresh error:', error)
    throw error
  }
}
