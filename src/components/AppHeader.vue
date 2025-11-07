<template>
  <header class="app-header d-flex justify-content-between align-items-center py-3 px-3 shadow-sm">
    <!-- ✅ 로고 + 타이틀 -->
    <div
      class="d-flex align-items-center gap-2 header-logo"
      @click="goHome"
      role="button"
    >
      <img src="@/assets/logo.png" alt="FindMySeoul" width="38" height="38" />
      <h6 class="m-0 fw-semibold text-warning">{{ title }}</h6>
    </div>

    <!-- 햄버거 버튼 -->
    <button class="btn btn-light rounded-circle border-0 shadow-sm p-2" @click="$emit('menu-click')">
      <i class="bi bi-list fs-5"></i>
    </button>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    title: {
      type: String,
      default: 'Planner'
    }
  },
  methods: {
    goHome() {
      // ✅ Vue Router를 사용하여 LandingPage('/')로 이동
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.app-header {
  background: var(--card);
  color: var(--foreground);
  position: sticky;
  top: 0;
  z-index: 10;
}

button.btn-light {
  background-color: var(--muted);
}

button.btn-light:hover {
  filter: brightness(1.05);
}

.header-logo:hover {
  cursor: pointer;
  opacity: 0.9;
  transition: opacity 0.2s ease;
}
</style>
