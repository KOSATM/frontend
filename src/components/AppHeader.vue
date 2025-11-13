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
      <div class="d-flex align-items-center gap-2">
        <!-- OAuth 프로필 이미지 -->
        <button
          class="btn profile-btn border-0 p-0"
          type="button"
          @click="goToTravelgram"
          title="Go to Travelgram"
        >
          <img
            :src="profileImage"
            alt="Profile"
            class="profile-img"
          />
        </button>

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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const navbar = ref(null)
const router = useRouter()

// OAuth 프로필 이미지 (기본값: 사용자 아이콘)
const profileImage = ref('https://via.placeholder.com/40?text=U')

// Travelgram 페이지로 이동
const goToTravelgram = () => {
  router.push('/travelgram')
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
  background-color: #ff8c00; /* 기본: 진한 오렌지 */
  color: #fff !important;    /* 글씨 흰색 */
  text-decoration: none;
  font-weight: 500;
  transition: all 0.25s ease;
  border-radius: 8px;

  &:hover {
    background-color: #ff9e33; /* 약간 밝은 오렌지 */
  }
}

.nav-item.active {
  background-color: #f8f9fa; /* ✅ Bootstrap light tone */
  color: #ff8c00 !important; /* ✅ 글자 주황색 반전 */
  box-shadow: inset 0 0 0 1px #ff8c00; /* 선택된 느낌 강조선 */
}

.offcanvas-header h5 {
  color: #1b3b6f;
}
</style>