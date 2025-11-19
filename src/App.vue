<template>
  <div id="app">
    <AppHeader @toggle-sidebar="isSidebarOpen = true" />
    <SideBar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="app-layout">
      <!-- 좌측 채팅 -->
      <ChatSidebar />

      <!-- 우측 메인 컨텐츠 -->
      <div class="main-content">
        <main :class="mainClass">
          <RouterView/>
        </main>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import SideBar from "./components/Sidebar.vue";
import ChatSidebar from "./components/ChatSidebar.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const isSidebarOpen = ref(false);
watch(isSidebarOpen, (v) => {
  document.body.style.overflow = v ? "hidden" : "";
});

const route = useRoute();

// 라우트별로 main의 클래스를 다르게
const mainClass = computed(() => {
  const classes = ["container-fms"]; // 기본 600px짜리
  if (route.meta.layout === "wide") classes.push("container-wide");
  if (route.meta.split) classes.push("container-split");
  return classes;
});
</script>

<style>
/* App Layout */
.app-layout {
  display: flex;
  width: 100%;
  min-height: calc(100vh - 140px); /* 헤더+푸터 제외 */
  padding-top: 60px; /* 헤더 높이만큼 상단 패딩 */
}

/* 우측 메인 컨텐츠 영역 */
.main-content {
  flex: 1;
  background: #f8f9fa;
  overflow-y: auto;
}

/* 메인 컨텐츠 */
main {
  width: 100%;
  min-height: calc(100vh - 200px); /* 헤더+푸터+패딩 제외 */
  padding: 1.5rem;
  box-sizing: border-box;
}

/* 기존 container 클래스들 유지 */
main.container-fms {
  max-width: 1000px;
  /* margin: 0 0 0 540px; */
  margin: 0 auto;
}

main.container-split {
  max-width: none;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
    padding-top: 60px; /* 모바일에서도 동일한 헤더 높이 */
  }

  .main-content {
    min-height: auto;
  }

  main {
    min-height: auto;
    padding: 1rem;
  }
}
</style>
