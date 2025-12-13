<template>
  <div class="navigation-buttons">
    <OutlineButton 
      class="flex-item" 
      @click="$emit('back')"
      :main-color="themeColor"
      :hover-color="activeColor"
    >
      {{ backText }}
    </OutlineButton>

    <FilledButton 
      class="flex-item" 
      @click="$emit('next')" 
      :disabled="isNextDisabled"
      :bg-color="themeColor"
      :hover-color="activeColor"
    >
      <slot name="next-content">{{ nextText }}</slot>
    </FilledButton>
  </div>
</template>

<script setup>
import OutlineButton from './OutlineButton.vue';
import FilledButton from './FilledButton.vue';

defineProps({
  backText: { type: String, default: 'Back' },
  nextText: { type: String, default: 'Next Step' },
  isNextDisabled: { type: Boolean, default: false },
  
  // 테마 색상 (기본값: 네이비)
  themeColor: { type: String, default: '#1b3b6f' },
  // 활성화/호버 색상 (기본값: 오렌지)
  activeColor: { type: String, default: '#ff8c00' }
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
.flex-item {
  flex: 1;
}
</style>