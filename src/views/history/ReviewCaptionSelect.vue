<template>
  <div class="review-caption-select">
    <PageHeader
      title="Create Travel Review"
      subtitle="Jeju Island Healing Trip"
      step="3/6"
    />

    <section class="caption-section">
      <h6 class="section-title">
        <i class="bi bi-stars text-primary me-2"></i>
        AI Generated Captions
      </h6>
      <p class="section-subtitle">
        Select a caption style for your post
      </p>

      <!-- 스타일 카드 목록 -->
      <div class="caption-list">
        <div
          v-for="style in captionStyles"
          :key="style.id"
          class="caption-card"
          :class="{ active: selectedStyle === style.id }"
          @click="selectStyle(style.id)"
        >
          <span class="caption-label" :class="style.labelClass">{{ style.label }}</span>
          <p class="caption-text">{{ style.text }}</p>
          <div v-if="selectedStyle === style.id" class="checkmark">
            <i class="bi bi-check-circle-fill"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- 하단 버튼 -->
    <div class="navigation-buttons">
      <button class="btn-back" @click="goBack">Back</button>
      <button class="btn-next" @click="goNext" :disabled="!selectedStyle">
        Next Step
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'

const router = useRouter()
const selectedStyle = ref(null)

const captionStyles = [
  {
    id: 'poetic',
    label: 'Poetic',
    text: '🌊 Lost in the endless blue of Jeju Island... Where the ocean meets the sky, and time stands still. Every wave whispers stories of ancient volcanoes and island dreams. 🏝️✨',
    labelClass: 'poetic'
  },
  {
    id: 'casual',
    label: 'Casual',
    text: 'Living my best island life in Jeju! 🌴🌞 The beaches here are absolutely stunning and the vibes are unmatched. Already planning my next trip back! Who wants to join? 📸',
    labelClass: 'casual'
  },
  {
    id: 'inspirational',
    label: 'Inspirational',
    text: 'Sometimes you need to escape to an island to find yourself again. 🌅 Jeju taught me that peace isn’t a place—it’s a feeling. Grateful for every sunrise, every wave, every moment. 🙏💙',
    labelClass: 'inspirational'
  },
  {
    id: 'fun',
    label: 'Fun & Playful',
    text: 'Jeju mode: ON 🏖️💃 Beach hair don’t care, sandy toes, and endless island vibes! This place is UNREAL!! 😍🌺 Swipe to see why I never want to leave →',
    labelClass: 'fun'
  }
]

const selectStyle = (id) => {
  selectedStyle.value = id
}

const goBack = () => router.back()
const goNext = () => {
  // ✅ 선택된 스타일을 store 또는 router query로 전달
  router.push({ name: 'ReviewHashtagSelect', query: { style: selectedStyle.value } })
}
</script>

<style scoped>
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

/* 버튼 */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 1rem;
  left: 0;
  width: 100%;
  padding: 0 1.25rem;
}

.btn-back,
.btn-next {
  flex: 1;
  height: 48px;
  border-radius: 1rem;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-back {
  background-color: #fff;
  color: #1b3b6f;
  border: 2px solid #1b3b6f;
  margin-right: 0.75rem;
}

.btn-next {
  background-color: #1b3b6f;
  color: #fff;
}

.btn-next:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
