<template>
<div class="supporter-page">
  <PageHeader title="서포터" subtitle="실시간으로 당신의 여행을 도와드립니다." icon="bi-chat-dots" />
  <StepHeader title="이미지 기반 여행 AI" subtitle="당신의 사진으로 여행 장소를 찾아보아요!" step="2/4"
    @back="router.push({ name: 'CreateNewSearch' })" />

  <BaseSection icon="bi-camera" title="이 사진에서 알고 싶은 정보는 무엇인가요?">
    <div class="preview-wrap mb-3" v-if="preview">
      <img :src="preview" alt="uploaded preview" class="preview-img" />
    </div>
    <ul class="list-unstyled mt-2">
      <!-- Landscape -->
      <li class="option-item p-3 mb-2 rounded d-flex align-items-center"
        :class="{ selected: selectedType === 'landscape' }" @click="setType('landscape')" role="button" tabindex="0"
        @keyup.enter.space.prevent="setType('landscape')" aria-pressed="false">
        <div class="option-icon gradient-1 me-3"><i class="bi bi-image-fill"></i></div>
        <div class="flex-fill">
          <div class="fw-medium">풍경 / 광장</div>
          <div class="small text-muted">공원, 절, 전망대, 거리</div>
        </div>
        <div class="check-mark" v-if="selectedType === 'landscape'">✓</div>
      </li>

      <!-- Food -->
      <li class="option-item p-3 mb-2 rounded d-flex align-items-center" :class="{ selected: selectedType === 'food' }"
        @click="setType('food')" role="button" tabindex="0" @keyup.enter.space.prevent="setType('food')"
        aria-pressed="false">
        <div class="option-icon gradient-2 me-3"><i class="bi bi-cup-straw"></i></div>
        <div class="flex-fill">
          <div class="fw-medium">음식 / 레스토랑</div>
          <div class="small text-muted">삼겹살, 길거리 음식, 카페</div>
        </div>
        <div class="check-mark" v-if="selectedType === 'food'">✓</div>
      </li>

      <!-- Activities (formerly People) -->
      <li class="option-item p-3 mb-2 rounded d-flex align-items-center"
        :class="{ selected: selectedType === 'activities' }" @click="setType('activities')" role="button" tabindex="0"
        @keyup.enter.space.prevent="setType('activities')" aria-pressed="false">
        <div class="option-icon gradient-3 me-3"><i class="bi bi-person-fill"></i></div>
        <div class="flex-fill">
          <div class="fw-medium">활동 / 경험</div>
          <div class="small text-muted">사진 명소, 문화 체험</div>
        </div>
        <div class="check-mark" v-if="selectedType === 'activities'">✓</div>
      </li>
    </ul>
  </BaseSection>

    <div class="d-flex gap-3 mt-5">
       <NavigationButtons
        back-text="뒤로 가기"
        next-text="다음으로 가기"
        :is-next-disabled="!selectedType"
        @back="goBack"
        @next="goNext"
      >
    </NavigationButtons>
    </div>

</div>

</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import StepHeader from '@/components/common/header/StepHeader.vue'
import BaseSection from '@/components/common/BaseSection.vue'
import PageHeader from '@/components/common/header/PageHeader.vue'
import NavigationButtons from '@/components/common/button/NavigationButtons.vue';


const goBack = async () => {
  router.push({
    name: 'AiRecommend',
    query: { preview: preview.value, type: selectedType.value }
  })
}
const router = useRouter()
const route = useRoute()

// New.vue에서 query parameter로 전달받은 이미지 데이터
const preview = ref(route.query?.preview || null)

// 선택 상태
const selectedType = ref(null)

// 선택 처리 (시각적 표시)
const setType = (type) => {
  selectedType.value = selectedType.value === type ? null : type
}

// Next 클릭 시 결과 페이지로 이동
const goNext = async () => {
  if (!selectedType.value) return
  
  // AiRecommend 페이지로 이동 (type 정보 전달)
  router.push({
    name: 'AiRecommend',
    query: { preview: preview.value, type: selectedType.value }
  })
}
</script>

<style scoped>

.supporter-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem; /* App.vue 사이드바도 padding-top: 2rem 필요 */
}

.preview-wrap {
  background: #F5F7FA;
  padding: 14px;
  border-radius: 14px;
}

.preview-img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
}

/* option item */
.option-item {
  background: #fff;
  border: 1px solid #f3e8ff;
  cursor: pointer;
  align-items: center;
  position: relative;
  transition: border-color .18s ease, box-shadow .18s ease, transform .08s ease;
  outline: none;
}

.option-item:focus {
  box-shadow: 0 0 0 4px rgba(27, 59, 111, 0.06);
}

/* 선택시 시각적 표시 */
.option-item.selected {
  border-color: #1b3b6f;
  background: #f3f7ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(27, 59, 111, 0.06);
}

/* 체크 마크 */
.check-mark {
  font-weight: 700;
  color: #1b3b6f;
  background: rgba(27, 59, 111, 0.08);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 14px;
}

/* option icon */
.option-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
}

/* 기존 gradient 유지 혹은 교체 가능 (원하면 단색으로 변경해 드립니다) */
.gradient-1 {
  background: linear-gradient(135deg, #6dd3ff, #7be6b8);
}

.gradient-2 {
  background: linear-gradient(135deg, #ffb86b, #ff9ad1);
}

.gradient-3 {
  background: linear-gradient(135deg, #a78bff, #ff9ad1);
}

.card {
  border-radius: 12px;
}
</style>