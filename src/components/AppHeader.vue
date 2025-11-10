<template>
  <nav ref="navbar" class="navbar navbar-fms fixed-top py-2" >
    <div class="container-fluid d-flex justify-content-between align-items-center px-2">
      <!-- 로고 -->
       <div class="navbar-brand d-flex align-items-center">
        <router-link to="/" class="logo-area">
        <img
          src="@/assets/img/logo-bg-rm.png"
          alt="Find My Seoul"
          class="logo-img"
        />
      </router-link>
      </div>

      <!-- 햄버거 버튼 -->
      <button
        class="btn text-white fs-3 border-0 me-2"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebar"
        aria-controls="sidebar"
      >
        <i class="bi bi-list"></i>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const navbar = ref(null)

const handleScroll = () => {
  if (window.scrollY > 20) navbar.value?.classList.add('scrolled')
  else navbar.value?.classList.remove('scrolled')
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
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