<template>
  <!-- 🔸 오른쪽 사이드바 (Offcanvas) -->
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="sidebarMenu"
    aria-labelledby="sidebarMenuLabel"
  >
    <div class="offcanvas-header border-bottom">
      <h5 class="offcanvas-title fw-semibold" id="sidebarMenuLabel">Menu</h5>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>

    <div class="offcanvas-body d-flex flex-column gap-2">
      <a
        v-for="item in menuItems"
        :key="item.name"
        href="#"
        class="d-flex align-items-center gap-2 px-3 py-2 rounded nav-item"
        :class="{ active: activeMenu === item.name }"
        @click.prevent="setActive(item.name)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as bootstrap from "bootstrap";

const menuItems = [
  { name: "planner", label: "Planner", icon: "bi bi-map-fill" },
  { name: "supporter", label: "Supporter", icon: "bi bi-people" },
  { name: "history", label: "History", icon: "bi bi-clock-history" }
];

const activeMenu = ref("planner");

function setActive(name) {
  activeMenu.value = name;
  const offcanvas = bootstrap.Offcanvas.getInstance(
    document.getElementById("sidebarMenu")
  );
  if (offcanvas) offcanvas.hide();
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
