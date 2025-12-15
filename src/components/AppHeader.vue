<template>
  <nav ref="navbar" class="navbar navbar-fms fixed-top">
    <div class="container-fluid d-flex justify-content-between align-items-center px-3">
      <router-link to="/" class="navbar-brand d-flex align-items-center text-decoration-none">
        <img src="@/assets/img/logo-bg-rm.png" alt="Find My Seoul" class="logo-img" />
      </router-link>

      <div class="d-flex align-items-center gap-3">

        <transition name="login-fade">
          <div v-if="isLoggedIn" class="login-info d-flex align-items-center gap-2">
            <span class="user-info">{{ userName || 'User' }}</span>

            <button @click="onLogoutClick" class="logout-btn" title="Logout">
              로그아웃
            </button>
          </div>
        </transition>

        <a v-if="!isLoggedIn" href="http://localhost:8080/oauth2/authorization/google"
          class="btn profile-btn border-0 p-0" title="Login with Google OAuth">
          <img src="@/assets/img/profile-logo.png" alt="Profile" class="profile-img" />
        </a>

        <img v-else :src="userProfileImage || defaultProfileImg" alt="Profile" class="profile-img-logged-in" />

        <button class="btn text-white fs-4 border-0 p-2" type="button" data-bs-toggle="offcanvas"
          data-bs-target="#sidebar" aria-controls="sidebar">
          <i class="bi bi-list"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import { storeToRefs } from 'pinia'

// ✅ 기본 이미지 import (템플릿에서 쓰기 위해)
import defaultProfileImg from '@/assets/img/profile-logo.png'

const router = useRouter()
const navbar = ref(null)

const authStore = useAuthStore()

// isLoggedIn, userName, userProfileImage가 실시간으로 바뀝니다.
const { isLoggedIn, userName, userProfileImage } = storeToRefs(authStore)

const onLogoutClick = () => {
  // Store의 로그아웃 액션 실행 (데이터 비우기)
  authStore.logout();

  console.log('✅ 로그아웃 완료')

  // 메인으로 이동
  router.push('/logout');
  // 또는 window.location.href = '/' (새로고침이 필요하다면 이것 사용)
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
  background-color: #ffffff;
  /* ✅ 기본 흰색 */
  transition: background 0.4s ease, box-shadow 0.4s ease;
  backdrop-filter: blur(8px);
  padding: 0 1.25rem;
  height: 64px;
  /* ⬆ 기존 42px → 64px로 변경 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* ✅ 좌우 끝 정렬 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-weight: 600;
  /* ✅ 글자 두께 강화 */

  .navbar-brand {
    display: flex;
    align-items: center;
    /* ✅ 로고 세로 중앙정렬 */
    justify-content: center;
    height: 100%;

    img {
      height: 50px;
      object-fit: contain;
      filter: none;
      /* 기본: 컬러 유지 */
      transition: filter 0.4s ease;
    }
  }

  .btn i {
    color: #ff8c00;
    font-size: 2rem;
    transition: color 0.4s ease;
  }

  /* 🟠 스크롤 시 상태 (여기를 수정하세요) */
  &.scrolled {
    background-color: #ff8c00;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    /* 기존: 로고 색상 반전 */
    .navbar-brand img {
      filter: brightness(0) invert(1);
    }

    /* 기존: 햄버거 버튼 색상 변경 */
    .btn i {
      color: #ffffff;
    }

    /* ✅ 추가됨: 유저 이름(user-info)을 흰색으로 변경 */
    .user-info {
      color: #ffffff;
    }

    /* (선택사항) 로그아웃 버튼도 배경에 맞게 스타일 변경이 필요하다면 추가 */
    .logout-btn {
      background-color: #ffffff;
      color: #ff8c00;
    }
  }
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
  font-size: 1.25rem;
  white-space: nowrap;
  color: #ff8c00;
}

/* 로그아웃 버튼 */
.logout-btn {
  font-size: 1.15rem;
  padding: 0 10px;
  /* padding: 6px 10px; */
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

/* 로그인 영역 등장 애니메이션 */
.login-fade-enter-active,
.login-fade-leave-active {
  transition: all 0.25s ease;
}

.login-fade-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.login-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.login-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.login-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>