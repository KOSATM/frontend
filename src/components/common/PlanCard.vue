<template>
  <div class="plan-card" @click="goToReview">

    <!-- 본문 -->
    <div class="plan-info">
      <div class="d-flex align-items-center mb-1">
        <span class="badge me-2">✔ {{ planStatus }}</span>
        <h6 class="plan-title mb-0" :class="{ 'no-title': !hasTitle }" >{{ displayTitle }}</h6>
      </div>
      <p class="plan-meta mb-0">
        <i class="bi bi-calendar-event me-1"></i>{{ date }}<br />
        <i class="bi bi-currency-dollar me-1"></i>{{ budget }}
      </p>
    </div>

    <!-- 오른쪽 화살표 -->
    <i class="bi bi-chevron-right icon-chevron"></i>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  planId: [String, Number],
  planTitle: { type: String, default: '' }, // required 해제 또는 default 설정
  date: String,
  budget: String,
  image: String,
  planStatus: { type: String, default: 'Done' }
})

// 2. 이벤트를 정의합니다.
const emit = defineEmits(['cardClick'])
// ✅ 1. 실제 제목이 있는지 확인하는 computed 속성 추가
const hasTitle = computed(() => {
  return props.planTitle && props.planTitle.trim().length > 0;
})

// 2. 화면에 표시할 텍스트 결정
const displayTitle = computed(() => {
  return hasTitle.value 
    ? props.planTitle 
    : 'If you click this card, AI will generate title for your trip';
})

// 3. 클릭 시 부모에게 id와 title을 전달합니다.
const handleClick = () => {
  emit('cardClick', props.planId, props.planTitle)
}
</script>

<style scoped>
</style>