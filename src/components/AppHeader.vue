<template>
  <nav ref="navbar" class="navbar navbar-fms fixed-top" >
    <div class="container-fluid d-flex justify-content-between align-items-center px-3">
      <!-- 좌측: 로고 -->
      <router-link to="/" class="navbar-brand d-flex align-items-center text-decoration-none">
        <img
          src="@/assets/img/logo-bg-rm.png"
          alt="Find My Seoul"
          class="logo-img"
        />
      </router-link>

      <!-- 우측: 프로필 이미지 + 햄버거 버튼 -->
      <div class="d-flex align-items-center gap-3">
        <!-- 로그인 상태 표시 -->
        <div v-if="isLoggedIn" class="login-info d-flex align-items-center gap-2">
          <span class="user-info">{{ userInfo }}</span>
          <button
            @click="handleLogout"
            class="logout-btn"
            title="Logout"
          >
            로그아웃
          </button>
        </div>

        <!-- OAuth 로그인 / 프로필 이미지 버튼 -->
        <a
          v-if="!isLoggedIn"
          href="http://localhost:8080/oauth2/authorization/google"
          class="btn profile-btn border-0 p-0"
          title="Login with Google OAuth"
        >
          <img
            src="@/assets/img/profile-logo.png"
            alt="Profile"
            class="profile-img"
          />
        </a>

        <!-- 로그인 후 프로필 이미지 -->
        <img
          v-else
          src="@/assets/img/profile-logo.png"
          alt="Profile"
          class="profile-img-logged-in"
        />

        <!-- 햄버거 버튼 -->
        <button
          class="btn text-white fs-4 border-0 p-2"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebar"
          aria-controls="sidebar"
        >
          <i class="bi bi-list"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'

const navbar = ref(null)
const router = useRouter()

// 로그인 상태 확인
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('jwtToken')
})

// 사용자 정보 표시 (이름)
const userInfo = computed(() => {
  const userStr = localStorage.getItem('user')
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      return user.name || user.email || 'User'
    } catch (e) {
      console.error('Failed to parse user:', e)
      return 'User'
    }
  }
  return 'User'
})

// 로그아웃 함수
const handleLogout = () => {
  localStorage.removeItem('jwtToken')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  console.log('✅ 로그아웃 완료')
  window.location.href = '/'
}

const handleScroll = () => {
  if (window.scrollY > 20) navbar.value?.classList.add('scrolled')
  else navbar.value?.classList.remove('scrolled')
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.navbar-fms {
  height: 60px;
  display: flex;
  align-items: center;
}

.navbar-brand {
  margin: 0;
  display: flex;
  align-items: center;
  height: 100%;
}

.logo-img {
  height: 40px;
  object-fit: contain;
}

.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.profile-img:hover {
  transform: scale(1.1);
}

.profile-btn {
  background: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
  border-radius: 50%;
}

.profile-btn:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.btn {
  background: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 44px;
}

.btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.nav-item {
  background-color: #ff8c00;
  color: #fff !important;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.25s ease;
  border-radius: 8px;

  &:hover {
    background-color: #ff9e33;
  }
}

.nav-item.active {
  background-color: #f8f9fa;
  color: #ff8c00 !important;
  box-shadow: inset 0 0 0 1px #ff8c00;
}

.offcanvas-header h5 {
  color: #1b3b6f;
}

/* 로그인 정보 */
.login-info {
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info {
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  color: #ff8c00;
}

/* 로그아웃 버튼 */
.logout-btn {
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 4px;
  border: 1px solid white;
  color: white;
  background-color: #ff8c00;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
  height: auto;
  width: auto;
  font-weight: 600;
}

.logout-btn:hover {
  background-color: #ff9e33;
  border-color: white;
}

.profile-img-logged-in {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}
</style>