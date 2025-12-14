<template>
  <button class="btn-outline">
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  // 기본 텍스트 및 테두리 색상
  mainColor: { type: String, default: '#1b3b6f' },
  // 호버 시 배경이 될 색상
  hoverColor: { type: String, default: '#ff8c00' },
  // 호버 시 텍스트 색상 (보통 흰색)
  hoverTextColor: { type: String, default: '#ffffff' }
});
</script>

<style scoped>
.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-radius: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  background-color: #fff;

  /* v-bind 연결 */
  color: v-bind(mainColor);
  border: 2px solid v-bind(mainColor);
}

.btn-outline:hover {
  background-color: v-bind(hoverColor);
  color: v-bind(hoverTextColor);
  border-color: v-bind(hoverColor);
}
</style>