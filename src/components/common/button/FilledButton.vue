<template>
  <button class="btn-filled" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  disabled: { type: Boolean, default: false },
  // 색상 커스텀 (기본값은 기존 네이비/오렌지)
  bgColor: { type: String, default: '#1b3b6f' },
  textColor: { type: String, default: '#ffffff' },
  hoverColor: { type: String, default: '#ff8c00' }
});
</script>

<style scoped>
.btn-filled {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  border: none;

  /* Vue 3 v-bind 기능을 사용하여 CSS 변수로 주입 */
  background-color: v-bind(bgColor);
  color: v-bind(textColor);
}

.btn-filled:hover:not(:disabled) {
  /* 호버 색상도 변수로 처리 */
  background-color: v-bind(hoverColor);
}

.btn-filled:disabled {
  background-color: #b0bfd8; /* 비활성화 색상은 고정하거나 이것도 변수화 가능 */
  cursor: not-allowed;
  opacity: 0.7;
}
</style>