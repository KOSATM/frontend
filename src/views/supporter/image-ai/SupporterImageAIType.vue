<template>

  <StepHeader title="Image-based Travel AI" subtitle="Find destinations from your photos" step="2/4"
    @back="router.push({ name: 'SupporterImageAINew' })" />

  <BaseSection icon="bi-camera" title="What type of photo is this?">
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
          <div class="fw-medium">Landscape / Places</div>
          <div class="small text-muted">Parks, temples, towers, streets</div>
        </div>
        <div class="check-mark" v-if="selectedType === 'landscape'">✓</div>
      </li>

      <!-- Food -->
      <li class="option-item p-3 mb-2 rounded d-flex align-items-center" :class="{ selected: selectedType === 'food' }"
        @click="setType('food')" role="button" tabindex="0" @keyup.enter.space.prevent="setType('food')"
        aria-pressed="false">
        <div class="option-icon gradient-2 me-3"><i class="bi bi-cup-straw"></i></div>
        <div class="flex-fill">
          <div class="fw-medium">Food / Restaurants</div>
          <div class="small text-muted">Korean BBQ, street food, cafes</div>
        </div>
        <div class="check-mark" v-if="selectedType === 'food'">✓</div>
      </li>

      <!-- Activities (formerly People) -->
      <li class="option-item p-3 mb-2 rounded d-flex align-items-center"
        :class="{ selected: selectedType === 'activities' }" @click="setType('activities')" role="button" tabindex="0"
        @keyup.enter.space.prevent="setType('activities')" aria-pressed="false">
        <div class="option-icon gradient-3 me-3"><i class="bi bi-person-fill"></i></div>
        <div class="flex-fill">
          <div class="fw-medium">Activities / Experiences</div>
          <div class="small text-muted">Photo spots, cultural experiences</div>
        </div>
        <div class="check-mark" v-if="selectedType === 'activities'">✓</div>
      </li>
    </ul>
  </BaseSection>

    <div class="d-flex mt-2">
      <router-link class="btn btn-link" :to="{ name: 'SupporterImageAINew' }">Back</router-link>
      <button class="btn btn-primary ms-auto" :disabled="!selectedType" @click="goNext">
        Next
      </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import StepHeader from '@/components/common/StepHeader.vue'
import BaseSection from '@/components/common/BaseSection.vue'

const router = useRouter()
const route = useRoute()

// accept preview from route.state.preview or route.query.preview
const preview = ref(route?.state?.preview || route?.query?.preview || '/sample/default.jpg')

// 선택 상태
const selectedType = ref(null)

// 선택 처리 (시각적 표시)
const setType = (type) => {
  selectedType.value = selectedType.value === type ? null : type
}

// Next 클릭 시 결과 페이지로 이동 (preview + type 전달)
const goNext = () => {
  if (!selectedType.value) return
  router.push({
    name: 'SupporterImageAIResults',
    state: { preview: preview.value, type: selectedType.value }
  })
}
</script>

<style scoped>
.preview-wrap {
  background: #F5F7FA;
  padding: 14px;
  border-radius: 14px;
}

.preview-img {
  width: 100%;
  height: 160px;
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