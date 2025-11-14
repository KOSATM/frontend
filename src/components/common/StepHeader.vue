<template>
  <div class="step-header mb-3">
    <!-- 🔙 상단 영역 -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div class="d-flex align-items-center">
        <i class="bi bi-arrow-left-short back-icon" @click="$emit('back')"></i>
        <div>
          <h6 class="step-title mb-0">{{ title }}</h6>
          <small class="step-subtitle text-muted">{{ subtitle }}</small>
        </div>
      </div>
      <span class="step-step text-muted">Step {{ step }}</span>
    </div>

    <!-- 🟦 진행 바 -->
    <div v-if="progressPercent" class="progress" style="height: 8px;">
      <div
        class="progress-bar bg-primary"
        role="progressbar"
        :style="{ width: progressPercent + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Create Travel Review' },
  subtitle: { type: String, default: '' },
  step: { type: [String, Number], default: '1/6' },
})

// 🔢 진행률 자동 계산 (예: '3/6' → 50%)
const progressPercent = computed(() => {
  const [current, total] = String(props.step).split('/').map(Number)
  if (!current || !total) return 0
  return Math.min(100, Math.round((current / total) * 100))
})
</script>

<style scoped>
.step-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 0.75rem;
}

.back-icon {
  font-size: 1.6rem;
  cursor: pointer;
  color: #ff8c00;
  margin-right: 0.5rem;
  transition: transform 0.2s;
}

.back-icon:hover {
  transform: translateX(-2px);
}

.step-title {
  font-weight: 700;
  color: #1b3b6f;
}

.step-step {
  font-size: 0.9rem;
  color: #6c757d;
}

.progress {
  background-color: #f1f3f5;
  border-radius: 1rem;
}

.progress-bar {
  border-radius: 1rem;
  background-color: #ff8c00 !important;
  transition: width 0.4s ease;
}
</style>
