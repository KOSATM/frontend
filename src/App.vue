<template>
  <div id="app">
    <AppHeader @toggle-sidebar="isSidebarOpen = true" />
    <SideBar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- 여기만 바뀜 -->
    <main :class="mainClass">
      <!-- 기본 뷰 -->
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>

      <!-- split 라우트일 때만 좌/우 뷰도 함께 -->
      <template v-if="route.meta.split">
        <RouterView name="left" />
        <RouterView name="right" />
      </template>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import SideBar from "./components/Sidebar.vue";
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
