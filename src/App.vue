<template>
  <div id="app">
    <!-- 🔹 헤더 -->
    <AppHeader @toggle-sidebar="isSidebarOpen = true" />

    <!-- 🔹 사이드바 -->
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- 🔹 메인 컨텐츠 -->
    <main class="container-fms">
      <router-view /> <!-- ✅ 라우터 화면 표시 -->
    </main>

    <!-- 🔹 푸터 -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import Sidebar from './components/Sidebar.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const isSidebarOpen = ref(false)

// ✅ 사이드바 열릴 때 배경 스크롤 방지
watch(isSidebarOpen, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})
</script>
