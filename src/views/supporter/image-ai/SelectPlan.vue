<template>
  <div class="supporter-page">
  <PageHeader title="서포터" subtitle="실시간으로 여행을 도와드립니다." icon="bi-chat-dots" />
  <StepHeader title="이미지 기반 여행 AI" subtitle="AI 추천을 사용해보세요." step="4/4" @back="onStepBack" />

  <BaseSection icon="bi-list-check" title="AI 추천을 어떻게 사용하고 싶으신가요?" subtitle="Completion Rate">
    <template #actions>
      <router-link class="btn btn-sm btn-outline-primary" :to="{ name: 'CreateNewSearch' }">새로운 검색</router-link>
    </template>

    <div class="selected-place card p-3 mb-3 d-flex align-items-center">
      <img v-if="item?.imageUrl" :src="item.imageUrl" class="thumb me-3" />
      <div v-else class="thumb me-3 bg-secondary d-flex align-items-center justify-content-center text-white">
        <i class="bi bi-image"></i>
      </div>
      <div>
        <div class="fw-medium">{{ item?.placeName || 'Unknown Place' }}</div>
        <div class="small text-muted">{{ item?.location || '' }}</div>
      </div>
      <div class="ms-auto small text-muted">{{ item?.description || '' }}</div>
    </div>

    <ul class="list-unstyled">
      <li class="option p-3 mb-2 rounded d-flex align-items-center" :class="{ selected: selectedOption === 'add' }"
        @click="selectOption('add')" @keyup.enter.space.prevent="selectOption('add')" role="button" tabindex="0"
        :aria-pressed="selectedOption === 'add'">
        <div class="icon add me-3">＋</div>
        <div class="flex-fill">
          <div class="fw-medium">Add to Itinerary</div>
          <div class="small text-muted">Add this place to your travel schedule</div>
        </div>

        <div v-if="selectedOption === 'add'" class="select-check" aria-hidden="true">✓</div>
      </li>

      <li class="option p-3 mb-2 rounded d-flex align-items-center" :class="{ selected: selectedOption === 'replace' }"
        @click="selectOption('replace')" @keyup.enter.space.prevent="selectOption('replace')" role="button" tabindex="0"
        :aria-pressed="selectedOption === 'replace'">
        <div class="icon replace me-3">↺</div>
        <div class="flex-fill">
          <div class="fw-medium">Replace Existing</div>
          <div class="small text-muted">Replace an existing schedule item</div>
        </div>

        <div v-if="selectedOption === 'replace'" class="select-check" aria-hidden="true">✓</div>
      </li>

      <li class="option p-3 mb-2 rounded d-flex align-items-center" :class="{ selected: selectedOption === 'save' }"
        @click="selectOption('save')" @keyup.enter.space.prevent="selectOption('save')" role="button" tabindex="0"
        :aria-pressed="selectedOption === 'save'">
        <div class="icon save me-3">💾</div>
        <div class="flex-fill">
          <div class="fw-medium">Save Only</div>
          <div class="small text-muted">Save for later without adding to schedule</div>
        </div>

        <div v-if="selectedOption === 'save'" class="select-check" aria-hidden="true">✓</div>
      </li>

      <!-- Not Interested: now selectable; Confirm required to proceed -->
      <li class="option p-3 mb-2 rounded d-flex align-items-center" :class="{ selected: selectedOption === 'not_interested' }"
        @click="selectOption('not_interested')" @keyup.enter.space.prevent="selectOption('not_interested')" role="button" tabindex="0"
        :aria-pressed="selectedOption === 'not_interested'">
        <div class="icon no me-3">✕</div>
        <div class="flex-fill">
          <div class="fw-medium">관심 없음</div>
          <div class="small text-muted">아무것도 하지 않고 검색으로 돌아갑니다.</div>
        </div>

        <div v-if="selectedOption === 'not_interested'" class="select-check" aria-hidden="true">✓</div>
      </li>
    </ul>
  </BaseSection>

  <div class="d-flex mt-3">
    <router-link class="btn btn-link" :to="{ name: 'AiRecommend' }">뒤로가기</router-link>
    <button class="btn btn-primary ms-auto" :disabled="!selectedOption || isSaving" @click="confirm">
      {{ isSaving ? 'Saving...' : 'Confirm' }}
    </button>
  </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useImageSearchStore } from '@/store/imageSearchStore'
import imageSearchApi from '@/api/imageSearchApi'
import PageHeader from '@/components/common/header/PageHeader.vue'
import StepHeader from '@/components/common/header/StepHeader.vue'
import BaseSection from '@/components/common/BaseSection.vue'
import { useAuthStore } from '@/store/authStore'

const router = useRouter()
const imageSearchStore = useImageSearchStore()
const authStore = useAuthStore()

const onStepBack = () => {
  router.push({ name: 'AiRecommend' }).catch(() => { })
}

// 스토어에서 선택된 장소 가져오기 (computed로 변경하여 반응형으로 만들기)
const item = computed(() => {
  const selected = imageSearchStore.getSelectedPlace
  return selected || {
    id: 0,
    placeName: 'Unknown Place',
    description: '',
    location: '',
    imageUrl: ''
  }
})

// UI selection state
const selectedOption = ref(null)
const isSaving = ref(false)

const selectOption = (k) => {
  selectedOption.value = selectedOption.value === k ? null : k
}

// DB에 저장 (save, add, replace 선택 시) - 모든 후보지 저장
const saveToDatabase = async (action) => {
  try {
    isSaving.value = true
    
    const userId = authStore.userId;
    if (!userId) {
      throw new Error('유저가 로그인하지 않았습니다.')
    }
    
    // 모든 후보지 저장
    const allCandidates = imageSearchStore.getCandidates
    const selectedPlace = imageSearchStore.getSelectedPlace
    
    const dataToSave = {
      selectedPlace: selectedPlace,
      candidates: allCandidates, // 모든 후보지 3개
      uploadedImage: imageSearchStore.getUploadedImage,
      selectedType: imageSearchStore.getSelectedType,
      action: action // save, add, replace
    }
    
    console.log('DB에 저장할 데이터 (모든 후보지):', dataToSave)
    
    // imageSearchApi.savePlaceCandidates() 호출 - 모든 후보지 저장
    const response = await imageSearchApi.savePlaceCandidates(userId, dataToSave)
    
    console.log('저장 성공 - sessionId:', response)
    return true
    
  } catch (error) {
    console.error('DB 저장 오류:', error)
    alert('저장에 실패했습니다.')
    return false
  } finally {
    isSaving.value = false
  }
}

// Confirm: 선택에 따라 처리
const confirm = async () => {
  if (!selectedOption.value) return

  // Not Interested -> 저장하지 않고 돌아가기
  if (selectedOption.value === 'not_interested') {
    router.push({ name:'CreateNewSearch' }).catch(() => { })
    return
  }

  // save, add, replace -> DB에 저장
  const saved = await saveToDatabase(selectedOption.value)
  
  if (!saved) {
    return // 저장 실패 시 진행하지 않음
  }

  // 저장 성공 후 페이지 이동
  if (selectedOption.value === 'add' || selectedOption.value === 'replace') {
    // 편집 페이지로 이동
    router.push({
      name: 'planedit',
      state: { item: item.value, mode: selectedOption.value },
      query: { mode: selectedOption.value, itemId: item.value?.id ?? '', itemName: item.value?.placeName ?? '' }
    }).catch(() => {
      router.push({
        name: 'ChoicePlan',
        state: { item: item.value, mode: selectedOption.value },
        query: { mode: selectedOption.value, itemId: item.value?.id ?? '', itemName: item.value?.placeName ?? '' }
      }).catch(() => { })
    })
    return
  }

  // save only -> 히스토리 페이지로 이동
  if (selectedOption.value === 'save') {
    router.push({ name: 'History' }).catch(() => { })
  }
}

</script>

<style scoped>
.supporter-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem; /* App.vue 사이드바도 padding-top: 2rem 필요 */
}

.history-card {
  background: #FFD9A6;
  border-radius: 12px;
}

.selected-place {
  border-radius: 10px;
  background: #fff;
  border: 1px solid #f3e8ff;
}

.thumb {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
}

.option {
  background: #fff;
  border: 1px solid #f3e8ff;
  cursor: pointer;
  transition: box-shadow .12s, transform .08s;
  position: relative;
}

.option.selected {
  border-color: #1b3b6f;
  background: #f3f7ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(27, 59, 111, 0.06);
}

.option .icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7ff;
  color: #6b46ff;
  font-weight: 700;
  font-size: 18px;
}

.option:hover {
  box-shadow: 0 8px 20px rgba(167, 139, 255, 0.06);
  transform: translateY(-2px);
}

/* select check (right side) - reuse Recommend style */
.select-check {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: #1b3b6f;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: 0 6px 18px rgba(27, 59, 111, 0.12);
  border: 2px solid rgba(255, 255, 255, 0.6);
}

/* small tweak for Not Interested icon color */
.option .icon.no {
  background: #fff5f2;
  color: #d03b1f;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card {
  border-radius: 12px;
}
</style>