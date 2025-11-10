<template>
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="sidebar"
    aria-labelledby="sidebarLabel"
  >
    <div class="offcanvas-header border-bottom">
      <h5 class="offcanvas-title fw-semibold" id="sidebarLabel">Menu</h5>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>

    <div class="offcanvas-body d-flex flex-column gap-2">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.route"
        class="d-flex align-items-center gap-2 px-3 py-2 rounded nav-item"
        :class="{ active: activeMenu === item.name }"
        @click="setActive(item.name)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as bootstrap from 'bootstrap' // ✅ 여기에 import

const router = useRouter()

const menuItems = [
  { name: 'planner', label: 'Planner', icon: 'bi bi-map-fill', route: '/planner' },
  { name: 'supporter', label: 'Supporter', icon: 'bi bi-people', route: '/supporter' },
  { name: 'history', label: 'History', icon: 'bi bi-clock-history', route: '/history' },
]

const activeMenu = ref('planner')

// ✅ 최초 1회만 Offcanvas 인스턴스 보장
onMounted(() => {
  const sidebarEl = document.getElementById('sidebar')
  if (!bootstrap.Offcanvas.getInstance(sidebarEl)) {
    new bootstrap.Offcanvas(sidebarEl)
  }
})

function setActive(name) {
  activeMenu.value = name;
  const target = menuItems.find((item) => item.name === name);

  // ✅ useRouter()로 얻은 router 사용
  if (target && router) router.push(target.route);

  nextTick(() => {
    const sidebarEl = document.getElementById('sidebarMenu');
    const offcanvas = bootstrap.Offcanvas.getInstance(sidebarEl);
    if (offcanvas) offcanvas.hide();
  });
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
</style>
