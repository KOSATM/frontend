<template>
  <!-- 사이드바 (data-bs-* 속성 전부 제거) -->
  <div class="offcanvas offcanvas-end" id="sidebar" tabindex="-1">
    <div class="offcanvas-header border-bottom">
      <h5 class="offcanvas-title fw-semibold">Menu</h5>
      <!-- X 버튼도 JS에서 직접 닫기 -->
      <button type="button" class="btn-close text-reset" @click="closeSidebar" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body d-flex flex-column gap-2">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.route"
        class="d-flex align-items-center gap-2 px-3 py-2 rounded nav-item"
        :class="{ active: activeMenu === item.name }"
        @click="onSelect(item.name)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const router = useRouter()
const route = useRoute()

const menuItems = [
  { name: 'planner', label: 'Planner', icon: 'bi bi-map-fill', route: '/planner' },
  { name: 'supporter', label: 'Supporter', icon: 'bi bi-people', route: '/supporter' },
  { name: 'travelgram', label: 'Travelgram', icon: 'bi bi bi-instagram', route: '/travelgram' },
]

// 현재 라우트에 따라 활성 메뉴 결정 (메인 페이지에서는 null)
const activeMenu = computed(() => {
  if (route.path === '/') return null // 메인 페이지에서는 활성화 없음
  
  const currentItem = menuItems.find(item => route.path.startsWith(item.route))
  return currentItem ? currentItem.name : null
})

let offcanvasInstance = null

function dedupeBackdrops() {
  const backdrops = Array.from(document.querySelectorAll('.offcanvas-backdrop'))
  // Bootstrap이 내부적으로 backdrop을 재활용하기 때문에 마지막 것만 남기고 제거
  if (backdrops.length > 1) {
    backdrops.slice(0, -1).forEach(el => el.remove())
  }
}

function cleanupBody() {
  document.body.classList.remove('modal-open')
  document.body.style.removeProperty('overflow')
  document.body.style.removeProperty('padding-right')
}

onMounted(() => {
  const sidebarEl = document.getElementById('sidebar')

  // 혹시 남아있는 인스턴스가 있다면 정리
  const existing = bootstrap.Offcanvas.getInstance(sidebarEl)
  if (existing) existing.dispose()

  // 새 인스턴스 한 번만 생성
  offcanvasInstance = new bootstrap.Offcanvas(sidebarEl, {
    backdrop: true,
    keyboard: true,
    scroll: false
  })

  // 열릴 때 중복 백드롭 제거
  sidebarEl.addEventListener('shown.bs.offcanvas', () => {
    setTimeout(dedupeBackdrops, 50)
  })

  // 닫힌 뒤 잔여 백드롭/스크롤 상태 정리
  sidebarEl.addEventListener('hidden.bs.offcanvas', () => {
    setTimeout(() => {
      dedupeBackdrops()
      cleanupBody()
    }, 150)
  })

  // 배경 클릭 시 닫기 (data-bs-toggle 미사용)
  document.addEventListener('click', (e) => {
    const backdrop = document.querySelector('.offcanvas-backdrop')
    if (backdrop && e.target === backdrop && sidebarEl.classList.contains('show')) {
      closeSidebar()
    }
  })
})

function openSidebar() {
  dedupeBackdrops() // 혹시 남은 잔여 백드롭 제거
  offcanvasInstance?.show()
}

function closeSidebar() {
  offcanvasInstance?.hide()
}

function onSelect(name) {
  const target = menuItems.find(item => item.name === name)
  if (target) router.push(target.route)
  closeSidebar()
}
</script>

<style scoped>
.nav-item {
  color: #1b3b6f;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}
.nav-item:hover {
  background-color: rgba(255, 140, 0, 0.1);
}
.nav-item.active {
  background-color: #ff8c00;
  color: #fff !important;
}
.offcanvas-header h5 {
  color: #1b3b6f;
}
.offcanvas-backdrop {
  background-color: rgba(0, 0, 0, 0.35) !important;
  transition: opacity 0.25s ease !important;
}
</style>
