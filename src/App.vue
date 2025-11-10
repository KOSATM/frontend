<template>
  <div id="app">
    <!-- 🔹 헤더 -->
    <AppHeader @toggle-sidebar="isSidebarOpen = true" />

    <!-- 🔹 사이드바 -->
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- 🔹 메인 컨텐츠 -->
    <main class="container-fms">
      <LandingPage />
    </main>

    <!-- 🔹 푸터 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { createApp, ref, watch } from 'vue'
import App from './App.vue'
import router from './router'          // ✅ 이 줄 필수
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import Sidebar from './components/Sidebar.vue'
import LandingPage from './views/LandingPage.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const isSidebarOpen = ref(false)

// ✅ 사이드바 열릴 때 배경 스크롤 방지
watch(isSidebarOpen, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((el) => el.classList.remove("active"));
    item.classList.add("active");
  });
});

createApp(App)
  .use(router)                         // ✅ router 등록 필수
  .mount('#app')

</script>
