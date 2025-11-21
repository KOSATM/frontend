<template>
  <div id="app">
    <AppHeader @toggle-sidebar="isSidebarOpen = true" />
    <SideBar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="app-layout">
      <!-- 좌측 채팅 -->
      <ChatSidebar />

      <!-- 중앙 메인 컨텐츠 -->
      <div class="main-content">
        <main :class="mainClass">
          <RouterView/>
        </main>
      </div>

      <!-- 우측 체크리스트 -->
      <div class="checklist-sidebar" :style="{ transform: `translate(calc(50% + ${checklistPosition.x}px), calc(50% + ${checklistPosition.y}px))` }">
        <div class="sidebar-header" @mousedown="handleMouseDown" style="cursor: grab;">
          <h6 class="mb-0">
            <i class="bi bi-journal-text me-2"></i>Today's Checklist
          </h6>
        </div>

        <div class="sidebar-progress mb-3">
          <div class="progress" style="height: 6px;">
            <div class="progress-bar" role="progressbar" :class="isChecklistComplete ? 'bg-success' : 'bg-warning'"
              :style="{ width: checklistProgressWidth }" :aria-valuenow="checklistPercent" aria-valuemin="0"
              aria-valuemax="100"></div>
          </div>
          <div class="progress-text small mt-2">{{ checklistPercent }}% Complete</div>
        </div>

        <ul class="list-unstyled checklist-sidebar-items">
          <li v-for="(item, idx) in sortedChecklistSidebar" :key="idx"
            class="checklist-item d-flex align-items-center p-2 mb-2 rounded" :class="{ 'checked-item': item.done }"
            @click="toggleChecklistItem(idx)" role="button">
            <div class="me-2">
              <div class="circle-check" :class="{ checked: item.done }"></div>
            </div>
            <div class="flex-fill">
              <span class="item-title small" :class="{ checkedTitle: item.done }">{{ item.title }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
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

// 우측 체크리스트 로직
const checklistItems = ref([
  { title: 'Camera battery fully charged?', done: false },
  { title: "Today's weather: Rainy / Bring umbrella 🌂", done: false },
  { title: 'Portable charger packed', done: false },
  { title: "Today's tip: OO Park - morning visit recommended", done: false },
  { title: 'Check transportation card balance', done: false },
  { title: 'Sunscreen & sunglasses', done: false },
]);

const toggleChecklistItem = (idx) => {
  checklistItems.value[idx].done = !checklistItems.value[idx].done;
};

const checklistCompletedCount = computed(() => 
  checklistItems.value.filter((c) => c.done).length
);

const checklistPercent = computed(() => 
  Math.round((checklistCompletedCount.value / checklistItems.value.length) * 100)
);

const isChecklistComplete = computed(() => 
  checklistCompletedCount.value === checklistItems.value.length
);

const checklistProgressWidth = computed(() => 
  isChecklistComplete.value ? '100%' : `${checklistPercent.value}%`
);

const sortedChecklistSidebar = computed(() => {
  const undone = checklistItems.value.filter(item => !item.done);
  const done = checklistItems.value.filter(item => item.done);
  return [...undone, ...done];
});

const checklistPosition = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });

const handleMouseDown = (e) => {
  isDragging.value = true;
  dragStart.value = {
    x: e.clientX - checklistPosition.value.x,
    y: e.clientY - checklistPosition.value.y,
  };
};

const handleMouseMove = (e) => {
  if (!isDragging.value) return;
  
  checklistPosition.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y,
  };
};

const handleMouseUp = () => {
  isDragging.value = false;
};

onMounted(() => {
  // 초기 위치를 오른쪽 공간 중앙에 설정
  const rightSpace = window.innerWidth - 340; // 체크리스트 너비 300px + 패딩 40px
  const viewportCenter = (window.innerHeight - 140) / 2; // 헤더+푸터 제외
  
  checklistPosition.value = {
    x: rightSpace / 2 - 150, // 체크리스트 중앙 정렬
    y: viewportCenter - 200, // 수직 중앙 정렬
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<style>
/* App Layout - 3 column layout */
.app-layout {
  display: flex;
  width: 100%;
  min-height: calc(100vh - 140px); /* 헤더+푸터 제외 */
  padding-top: 60px; /* 헤더 높이만큼 상단 패딩 */
  gap: 0;
}

/* 좌측 채팅 사이드바 */
.app-layout > :first-child {
  flex: 0 0 auto;
  min-width: 300px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
}

/* 중앙 메인 컨텐츠 영역 */
.main-content {
  flex: 1;
  background: #f8f9fa;
  overflow-y: auto;
  min-width: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

/* 우측 체크리스트 사이드바 */
.app-layout > :last-child {
  flex: 0 0 auto;
  width: 340px;
  background: transparent;
  border: none;
  overflow: visible;
  padding: 1.5rem 1rem;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

/* 메인 컨텐츠 */
main {
  width: 100%;
  min-height: auto;
  padding: 1.5rem;
  box-sizing: border-box;
}

/* 기존 container 클래스들 유지 */
main.container-fms {
  max-width: 1000px;
  margin: 0 auto;
}

main.container-split {
  max-width: none;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .app-layout > :last-child {
    flex: 0 0 250px;
  }
}

@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
    padding-top: 60px;
  }

  .app-layout > :first-child,
  .app-layout > :last-child {
    flex: 0 0 auto;
    min-width: 100%;
    border: none;
  }

  .main-content {
    min-height: auto;
  }

  main {
    min-height: auto;
    padding: 1rem;
  }
}

/* CHECKLIST SIDEBAR STYLES */
.checklist-sidebar {
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 300px;
  max-height: calc(100vh - 200px);
  overflow: hidden;
  position: fixed;
  bottom: 70%;
  right: 45%;
  transform: translate(50%, 50%);
  z-index: 999;
  transition: box-shadow 0.2s ease;
}

.checklist-sidebar:active {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.sidebar-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 12px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 16px;
  user-select: none;
  transition: background-color 0.2s ease;
}

.sidebar-header:hover {
  background-color: #f8f9fa;
}

.sidebar-header h6 {
  color: #1b3b6f;
  font-weight: 700;
  font-size: 0.95rem;
  margin: 0;
}

.sidebar-progress {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  margin-left: 16px;
  margin-right: 16px;
}

.progress-text {
  color: #6b7280;
  font-weight: 500;
}

.checklist-sidebar-items {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 0 16px 16px 16px;
}

.checklist-sidebar-items::-webkit-scrollbar {
  width: 6px;
}

.checklist-sidebar-items::-webkit-scrollbar-track {
  background: transparent;
}

.checklist-sidebar-items::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 3px;
}

/* CHECKLIST ITEM STYLES */
.checklist-item {
  background: #fff;
  border: 1px solid #ececec;
  cursor: pointer;
  transition: opacity .28s ease, transform .12s ease;
  display: flex;
  align-items: center;
  gap: 0px;
  padding: 10px;
}

.checklist-item.checked-item {
  opacity: .55;
  transform: scale(.995);
  border-color: #d1fae5;
  background: rgba(255, 255, 255, 0.95);
}

.item-title {
  font-size: 13px;
  color: #222;
}

.item-title.checkedTitle {
  color: #555;
  text-decoration: line-through;
}

.circle-check {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all .18s ease;
  flex-shrink: 0;
}

.circle-check.checked {
  background: #34d399;
  border-color: #34d399;
}

.circle-check.checked::after {
  content: "✓";
  color: #fff;
  font-weight: 700;
  font-size: 10px;
  line-height: 1;
}
</style>
