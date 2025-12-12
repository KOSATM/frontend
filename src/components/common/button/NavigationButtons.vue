<!-- /src.components/common/button/NavigationButtons.vue -->
<template>
  <div class="navigation-buttons">
    <button class="btn-back" @click="$emit('back')">
      {{ backText }}
    </button>
    <button 
      class="btn-next" 
      @click="$emit('next')" 
      :disabled="isNextDisabled"
    >
      <slot name="next-content">{{ nextText }}</slot>
    </button>
  </div>
</template>

<script setup>
defineProps({
  backText: {
    type: String,
    default: 'Back'
  },
  nextText: {
    type: String,
    default: 'Next Step'
  },
  isNextDisabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['back', 'next']);
</script>

<style scoped>
.navigation-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
  width: 100%;
}

.btn-back,
.btn-next {
  flex: 1;
  height: 48px;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease; /* 색상 변경을 부드럽게 */
}

/* 🔙 Back 버튼 스타일 (Outline -> Filled) */
.btn-back {
  background-color: #fff;
  color: #1b3b6f; /* 네이비 텍스트 */
  border: 2px solid #1b3b6f; /* 네이비 테두리 */
}

.btn-back:hover {
  background-color: #ff8c00; /* 오렌지 배경 */
  color: #fff; /* 흰색 텍스트 */
  border-color: #ff8c00; /* 테두리도 오렌지로 변경 */
}

/* 🔜 Next 버튼 스타일 (Filled -> Changed Color) */
.btn-next {
  background-color: #1b3b6f; /* 네이비 배경 */
  color: #fff;
  border: none;
}

.btn-next:hover:not(:disabled) {
  background-color: #ff8c00; /* 오렌지 배경 */
}

/* 비활성화 상태 */
.btn-next:disabled {
  background-color: #b0bfd8;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>