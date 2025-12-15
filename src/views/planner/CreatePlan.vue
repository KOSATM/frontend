<template>
  <div class="planner-create">
    <!-- 헤더 -->
    <PageHeader title="플래너" subtitle="당신의 서울 여행 일정을 만들고 관리해보세요." icon="bi-map" />

    <div class="content-wrapper px-4 py-4">

      <!-- AI 프롬프트 입력 -->
      <div class="prompt-section mb-5">
        <div class="prompt-card">
          <div class="prompt-input-wrapper">
            <textarea class="prompt-input" placeholder="여행 일정을 생성해보세요. 예) KPOP 3일 여행 일정을 생성해줘." v-model="promptInput"
              rows="4" :disabled="isLoading" />

            <button class="btn-generate" @click="generateItinerary" :disabled="!promptInput.trim()"
              :class="{ loading: isLoading }">
              <template v-if="isLoading">
                <span class="spinner-border spinner-border-sm"></span>
                일정 생성 중…
              </template>
              <template v-else>
                ✨ 일정 생성하기
                <i class="bi bi-play-fill"></i>
              </template>
            </button>
          </div>
        </div>
      </div>

      <!-- 추천 카드 -->
      <div class="recommended-section mb-4">
        <h3 class="fw-bold">서울 추천 장소 검색</h3>

        <div class="row g-3 mb-3">
          <div class="col-6" v-for="item in cards" :key="item.key">
            <RecommendationCard :imageSrc="item.img" :cardLabel="item.label" :icon="item.icon"
              @click="openModal(item.key)" />
          </div>
        </div>
      </div>

      <BlogListModal :isOpen="isModalOpen" :isLoading="isLoading" :items="blogItems" :keyword="currentKeyword"
        @close="isModalOpen = false" />

      <TipBox name="Travel Tip"
        description="Enter your budget and AI will create a customized itinerary considering accommodation, transportation, and meals." />
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

import PageHeader from '@/components/common/header/PageHeader.vue'
import TipBox from '@/components/common/TipBox.vue'
import RecommendationCard from '@/components/planner/RecommendationCard.vue'
import BlogListModal from '@/components/planner/BlogListModal.vue'

import plannerApi from '@/api/plannerApi'
import chatApi from '@/api/chatApi'
import { useAuthStore } from '@/store/authStore'

// 이미지
import accommodationImg from '@/assets/img/planner-recommendation/accommodation.png'
import restaurantImg from '@/assets/img/planner-recommendation/restaurant.png'
import attractionImg from '@/assets/img/planner-recommendation/attraction.png'
import photoSpotImg from '@/assets/img/planner-recommendation/photospot.png'
import festivalImg from '@/assets/img/planner-recommendation/festival.png'
import experienceImg from '@/assets/img/planner-recommendation/experience.png'

const route = useRoute()
const authStore = useAuthStore()

const promptInput = ref('')
const isLoading = ref(false)

// 모달
const isModalOpen = ref(false)
const blogItems = ref([])
const currentKeyword = ref('')

// 카드 정의
const cards = [
  { key: 'accommodation', label: '감성 숙소', icon: 'bi-house-heart', img: accommodationImg },
  { key: 'restaurants', label: '맛집 내돈내산', icon: 'bi-cup-hot', img: restaurantImg },
  { key: 'attractions', label: '가볼만한 곳', icon: 'bi-compass', img: attractionImg },
  { key: 'photospots', label: '사진 명소', icon: 'bi-camera', img: photoSpotImg },
  { key: 'festivals', label: '축제', icon: 'bi-music-note', img: festivalImg },
  { key: 'experiences', label: '이색 체험', icon: 'bi-calendar-event', img: experienceImg }
]

// 블로그 모달
const openModal = async (category) => {
  currentKeyword.value = `서울 ${category}`
  isModalOpen.value = true
  isLoading.value = true

  try {
    const res = await plannerApi.getBlogList(currentKeyword.value)
    blogItems.value = res.data || []
  } finally {
    isLoading.value = false
  }
}

// AI 일정 생성
const generateItinerary = async () => {
  if (!promptInput.value.trim() || isLoading.value) return

  isLoading.value = true

  try {
    await chatApi.chat({
      message: promptInput.value,
      userId: authStore.userId,
      currentUrl: route.path
    })

    // 페이지 이동 전에 로딩 유지
    setTimeout(() => {
      router.push('/planner/edit');
    }, 600)

  } catch (e) {
    console.error(e)
    isLoading.value = false;
  }
}

</script>

<style scoped>
.planner-create {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem 6rem;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

/* 카드 */
.prompt-card {
  background: #ffffff;
  border: 1px solid rgba(255, 140, 0, 0.15);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(255, 140, 0, 0.08);
}

/* 입력 영역 */
.prompt-input-wrapper {
  position: relative;
}

.prompt-input {
  width: 100%;
  padding: 1rem 7.5rem 3rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.75rem;
  background-color: #f9f9f9;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}
.prompt-input:disabled {
  background-color: #f3f3f3;
  color: #999;
  cursor: not-allowed;
}
.prompt-input:focus {
  outline: none;
  border-color: #ff8c00;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.08);
}

/* 🔥 핵심 버튼 */
.btn-generate {
  position: absolute;
  right: 16px;
  bottom: 16px;

  padding: 0.65rem 1.25rem;
  border-radius: 999px;

  background: linear-gradient(90deg, #ff8c00, #ffb347);
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;

  display: inline-flex;
  align-items: center;
  gap: 0.45rem;

  border: none;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(255, 140, 0, 0.35);

  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(255, 140, 0, 0.45);
}

.btn-generate.loading {
  cursor: wait;
}

.btn-generate:disabled {
  background: #eee;
  color: #aaa;
  box-shadow: none;
  cursor: not-allowed;
}

/* spinner */
.spinner-border {
  width: 0.9rem;
  height: 0.9rem;
  border-width: 2px;
  color: #fff;
}
</style>
