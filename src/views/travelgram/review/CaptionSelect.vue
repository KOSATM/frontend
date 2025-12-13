<template>
  <div class="review-caption-select">
    <PageHeader title="트래벌그램" subtitle="당신의 지난 여행 기록들" icon="bi-instagram" />
    <StepHeader title="여행 후기 작성" :subtitle="reviewStore.planTitle" step="3/6" @back="goBack" />

    <section class="caption-section">
      <h6 class="section-title">
        <i class="bi bi-stars text-primary me-2"></i>
        AI가 생성한 후기
      </h6>
      <p class="section-subtitle">
        스타일을 선택해주세요.
      </p>

      <div v-if="isLoading" class="loading-container">
        <div class="spinner-border text-primary" role="status"></div>
        <p>AI가 당신의 여행 후기를 작성하고 있어요... 🤖✏️</p>
      </div>

      <div v-else class="caption-list">
        <div
          v-for="(item, index) in reviewStore.generatedOptions"
          :key="index"
          class="caption-card"
          :class="{ active: selectedIndex === index }"
          @click="selectStyle(index)"
        >
          <span class="caption-label" :class="getLabelClass(item.style.toneCode)">
            {{ item.style.name }}
          </span>
          
          <p class="caption-text">
            {{ item.style.caption }}
          </p>
          
          <div class="hashtag-preview">
            <small class="text-muted">
              {{ item.hashtags.map(h => '#' + h.name).slice(0, 3).join(' ') }} ...
            </small>
          </div>

          <div v-if="selectedIndex === index" class="checkmark">
            <i class="bi bi-check-circle-fill"></i>
          </div>
        </div>
      </div>
    </section>
    <NavigationButtons
      backText="Back"
      :isNextDisabled="!canProceed"
      @back="goBack"
      @next="goNext"
    >
      <template #next-content>
        <span v-if="isAnalyzing">분석 중...</span>
        <span v-else>Next Step</span>
      </template>
    </NavigationButtons>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import api from '@/api/travelgramApi'
import StepHeader from '@/components/common/header/StepHeader.vue'
import PageHeader from '@/components/common/header/PageHeader.vue'
import NavigationButtons from '@/components/common/button/NavigationButtons.vue';

const router = useRouter()
const reviewStore = useReviewStore()

const isLoading = ref(false) // 초기 데이터 로딩용
const isAnalyzing = ref(false) // 👈 2. 버튼 로딩 표시용 (Next 클릭 시)
const selectedIndex = ref(null)

// 👈 3. 다음 단계 진행 가능 여부 (선택된 항목이 있으면 true)
const canProceed = computed(() => selectedIndex.value !== null)

// 화면 진입 시 API 호출
onMounted(async () => {
  // 이미 생성된 옵션이 있다면 다시 호출하지 않음 (뒤로가기 했다가 다시 온 경우 등)
  if (reviewStore.generatedOptions.length > 0) return;

  isLoading.value = true
  try {
    // planId와 reviewPostId는 이전 단계에서 store에 저장되어 있어야 함
    const planId = reviewStore.planId; // 혹은 하드코딩된 ID (114 등)
    const reviewPostId = reviewStore.reviewPostId;

    // 백엔드 호출
    const response = await api.generateAiStyles(planId, reviewPostId)
    const options = response.data.data;
    reviewStore.setGeneratedOptions(options)

  } catch (error) {
    console.error("AI Generation Failed:", error)
    alert("Failed to generate AI captions.")
  } finally {
    isLoading.value = false
  }
})

const selectStyle = (index) => {
  selectedIndex.value = index
}
// 톤 코드에 따라 라벨 색상 클래스 반환
const getLabelClass = (code) => {
  switch (code) {
    case 'EMOTIONAL': return 'poetic'
    case 'INFORMATIVE': return 'inspirational' // 색상 매핑은 취향껏
    case 'WITTY': return 'fun'
    case 'SIMPLE': return 'casual'
    default: return 'casual'
  }
}
const goBack = () => router.push({name: 'PhotoOrder'});
const goNext = async() => {
  if (selectedIndex.value === null) return
  isAnalyzing.value = true
  try {
    const selectedOption = reviewStore.generatedOptions[selectedIndex.value]
    
    reviewStore.selectStyleOption(selectedOption)
    
    // 스타일 선택 API 호출
    await api.selectStyle(reviewStore.reviewPostId, reviewStore.reviewStyleId)
    
    reviewStore.nextStep()
    router.push({ name: 'HashtagSelect' })
  } catch (error) {
    console.error("Style selection failed:", error);
    alert("오류가 발생했습니다.");
  } finally {
    // 👈 5. 로딩 종료
    isAnalyzing.value = false
  }
}
</script>

<style scoped>
/* 기존 스타일 유지 + 추가 스타일 */
.loading-container {
  text-align: center;
  margin-top: 3rem;
  color: #666;
}

.hashtag-preview {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #888;
}

.review-caption-select {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem 6rem;
}

/* 제목 섹션 */
.section-title {
  color: #1b3b6f;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.section-subtitle {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

/* 캡션 카드 */
.caption-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.caption-card {
  position: relative;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: all 0.2s ease;
}

.caption-card:hover {
  background-color: #fff8ef;
}

.caption-card.active {
  border-color: #ff8c00;
  background-color: #fffaf3;
}

.caption-label {
  display: inline-block;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

/* 라벨 색상별 */
.poetic {
  background: #e7d7ff;
  color: #6a1b9a;
}

.casual {
  background: #fff0c2;
  color: #d9822b;
}

.inspirational {
  background: #d8f3dc;
  color: #2b7a0b;
}

.fun {
  background: #ffdce0;
  color: #c2185b;
}

.caption-text {
  color: #333;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 체크 아이콘 */
.checkmark {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #ff8c00;
  font-size: 1.3rem;
}
</style>
