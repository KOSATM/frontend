<template>
  <div id="app">
    <AppHeader @toggle-sidebar="isSidebarOpen = true" />
    <SideBar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="app-layout">
      <!-- 좌측 채팅 1 -->
      <div class="sidebar-left">
        <ChatSidebar />
      </div>

      <!-- 중앙 메인 컨텐츠 -->
      <div class="main-content">
        <main :class="mainClass">
          <RouterView/>
        </main>
      </div>

      <!-- 우측 컨텐츠 - supporter 페이지에서만 표시 -->
      <div v-if="route.path.includes('supporter')" class="sidebar-right">
        <WeatherCard/>
        <div class="checklist-container">
          <Checklist/>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import SideBar from "./components/Sidebar.vue";
import ChatSidebar from "./components/ChatSidebar.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Checklist from "./components/supporter/Checklist.vue";
import WeatherCard from "./components/supporter/WeatherCard.vue";

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

// ✅ OAuth 콜백 처리
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userId = params.get("userId");
  const email = params.get("email");

  if (token) {
    console.log("🔐 OAuth 토큰 수신:", token);
    console.log("📊 수신한 데이터:", JSON.stringify({
      token,
      userId,
      email,
      timestamp: new Date().toISOString()
    }, null, 2));

    // 토큰 저장
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("email", email);
    const userData = {
      id: userId,
      email,
      name: email.split("@")[0],
    };
    localStorage.setItem("user", JSON.stringify(userData));

    console.log("✅ 저장된 데이터:", JSON.stringify(userData, null, 2));

    // 홈으로 리다이렉트
    setTimeout(() => {
      window.location.href = "http://localhost:80/";
    }, 500);
  }
});
</script>

<style>
/* App Layout - 3분할 구성 */
.app-layout {
  display: flex;
  width: 100%;
  min-height: calc(100vh - 140px); /* 헤더+푸터 제외 */
  padding-top: 60px; /* 헤더 높이만큼 상단 패딩 */
  gap: 0;
}

/* 좌측 채팅 사이드바 - 25% */
.sidebar-left {
  flex: 0 0 25%;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

/* 중앙 메인 컨텐츠 영역 - 50% */
.main-content {
  flex: 0 0 50%;
  background: #f8f9fa;
  overflow-y: auto;
}

/* 우측 채팅 사이드바 - 25% */
.sidebar-right {
  flex: 0 0 25%;
  background: #fff;
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;
  padding: 1.5rem 0.75rem;
}

/* Checklist 컨테이너 - 가운데 정렬 및 크기 조정 */
.checklist-container {
  max-width: 90%;
  margin: 1.5rem auto 0;
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
  max-width: 100%;
  margin: 0 auto;
}

main.container-split {
  max-width: none;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .sidebar-left, .sidebar-right {
    flex: 0 0 20%;
  }
  
  .main-content {
    flex: 0 0 60%;
  }
}

@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
    padding-top: 60px; /* 모바일에서도 동일한 헤더 높이 */
  }

  .sidebar-left, .sidebar-right {
    flex: 0 0 auto;
    display: none; /* 모바일에서는 사이드바 숨김 */
  }

  .main-content {
    flex: 1;
    min-height: auto;
  }

  main {
    min-height: auto;
    padding: 1rem;
  }
}
</style>
