<template>
  <header class="page-header">
    <div class="header-top">
      <i v-if="icon" :class="['bi', icon, 'me-2']" :style="{ color: iconColor }"></i>
      <h5 class="page-title">{{ title }}</h5>
    </div>
    <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  icon: { type: String, default: "" }, // Bootstrap Icon class name (e.g., 'bi-instagram')
  iconColor: { type: String, default: "#ff8c00" } // optional color prop
});
</script>

<style scoped>
.page-header {
  background: linear-gradient(90deg, #fffaf3 0%, #ffffff 100%);
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(27, 59, 111, 0.08);
  margin-bottom: 1.5rem;

.header-top {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1b3b6f;
  margin: 0;
}

.page-subtitle {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0.35rem 0 0 2rem;
}
}
</style>
