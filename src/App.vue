<template>
  <div id="app">
    <div class="layout-container">
      
      <AppHeader @toggle-chat="isChatOpen = !isChatOpen" @toggle-sidebar="isSidebarOpen = true" />
      
      <SideBar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

      <div class="app-body-row">
        
        <!-- Chat Sidebar (Drawer) - 드로어 형식 -->
        <aside 
          class="sidebar-area left" 
          :class="{ 'open': isChatOpen, 'closed': !isChatOpen }"
        >
          <ChatSidebar 
            ref="chatSidebarRef"
            @close="isChatOpen = false" 
          />
        </aside>

        <!-- Overlay - 드로어가 열려있을 때만 표시 -->
        <div 
          v-if="isChatOpen"
          class="sidebar-overlay" 
          :class="{ 'active': isChatOpen }" 
          @click="isChatOpen = false"
        ></div>

        <!-- Main Content -->
        <div class="main-content">
          <main class="page-container">
            <RouterView />
          </main>
        </div>

        <!-- Right Sidebar (Weather & Checklist) -->
        <aside v-if="showRightSidebar" class="sidebar-area right">
          <WeatherCard />
          <Checklist />
        </aside>
        
      </div>

      <AppFooter />

      <!-- Chat Input (Fixed at bottom) -->
      <ChatInput 
        v-model="currentMessage"
        :isLoading="isLoading"
        @send-message="sendChatMessage"
        ref="chatInputRef"
      />
      
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
import ChatInput from "./components/ChatInput.vue";
import Checklist from "./components/supporter/Checklist.vue";
import WeatherCard from "./components/supporter/WeatherCard.vue";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const route = useRoute();
const authStore = useAuthStore();
const chatStore = useChatStore();
const isSidebarOpen = ref(false);
const isChatOpen = ref(false); // ✅ 채팅 드로어 상태
const currentMessage = ref("");
const isLoading = ref(false);
const chatInputRef = ref(null);
const chatSidebarRef = ref(null);

authStore.initializeAuth();

watch(isSidebarOpen, (v) => {
  document.body.style.overflow = v ? "hidden" : "";
});

watch(isChatOpen, (v) => {
  document.body.style.overflow = v ? "hidden" : "";
});

// 사이드바 표시 조건
const showRightSidebar = computed(() => route.path.includes('supporter'));

// 채팅 메시지 전송
const sendChatMessage = async () => {
  if (chatSidebarRef.value) {
    // isLoading 상태를 App에서 관리
    isLoading.value = true;
    
    // ChatSidebar의 sendMessage 함수 호출
    await chatSidebarRef.value.sendMessage(currentMessage.value);
    
    // ChatSidebar에서 currentMessage를 관리하므로 App의 currentMessage는 비우기
    currentMessage.value = "";
    isLoading.value = false;
  }
};

// OAuth 로직
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    // ... (기존 로직 동일) ...
  }
});
</script>

<style scoped>
#app {
  width: 100%;
  min-height: 100vh;
}
</style>