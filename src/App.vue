<template>
  <div id="app">
    <div class="layout-container">
      
      <AppHeader @toggle-sidebar="isSidebarOpen = true" />
      
      <SideBar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

      <div class="app-body-row">
        
        <aside v-if="showLeftSidebar" class="sidebar-area left">
          <ChatSidebar />
        </aside>

        <div class="main-content">
          <main class="page-container">
            <RouterView />
          </main>
        </div>

        <aside v-if="showRightSidebar" class="sidebar-area right">
          <WeatherCard />
          <Checklist />
        </aside>
        
      </div>

      <AppFooter />
      
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import SideBar from "./components/Menubar.vue"; 
import ChatSidebar from "./components/ChatSidebar.vue";
import Checklist from "./components/supporter/Checklist.vue";
import WeatherCard from "./components/supporter/WeatherCard.vue";
import {useAuthStore} from "@/store/authStore"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const route = useRoute();
const authStore = useAuthStore();
const isSidebarOpen = ref(false);
authStore.initializeAuth();
watch(isSidebarOpen, (v) => {
  document.body.style.overflow = v ? "hidden" : "";
});

// 사이드바 표시 조건
const showLeftSidebar = computed(() => route.path.includes('planner'));
const showRightSidebar = computed(() => route.path.includes('supporter'));

// OAuth 로직 (그대로 유지)
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
     // ... (기존 로직 동일) ...
  }
});
</script>

<style scoped>
/* App.vue 내에서 직접 import 하거나 
  vite.config.js에서 전역으로 설정
*/
</style>