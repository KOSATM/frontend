<template>
  <div class="planner-create">
    <!-- 플래너 탭 -->
    <PageHeader title="Planner" subtitle="Create and manage your Seoul travel itinerary" icon="bi-map" />

    <!-- 메인 컨텐츠 -->
    <div class="content-wrapper px-4 py-4">

      <!-- AI 프롬프트 입력 섹션 -->
      <div class="prompt-section mb-5">
        <div class="prompt-card">
          <div class="prompt-input-wrapper">
            <textarea class="prompt-input form-control" placeholder="Leave a comment here" v-model="promptInput"
              rows="4"></textarea>

            <!-- Button sits inside the textarea wrapper, overlapping the bottom-left -->
            <button class="btn-generate" @click="generateItinerary" :disabled="!promptInput.trim() || isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
              Start
              <i class="bi bi-play-fill"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Create Budget-Based Itinerary 버튼 -->
      <!-- <BaseButton variant="primary" 
      class="w-100 mb-4 py-3 d-flex align-items-center justify-content-center gap-2"
      @click="next()"><i class="bi bi-plus-lg"></i>
        <span class="fw-semibold">Create Budget-Based Itinerary</span>
      </BaseButton> -->


      <!-- AI-Recommended Places -->
      <div class="recommended-section mb-4">
        <h5 class="fw-bold">AI-Recommended Places</h5>

        <!-- 카드 그리드 -->
        <div class="row g-3 mb-3">
          <!-- Accommodation -->
          <div class="col-6">
            <RecommendationCard imageSrc="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"
              alt="Accommodation" cardLabel="Accommodation" icon="bi-house-heart" @click="openModal('accommodation')" />
          </div>

          <!-- Restaurants -->
          <div class="col-6">
            <RecommendationCard imageSrc="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500"
              alt="Restaurants" cardLabel="Restaurants" icon="bi-cup-hot" @click="openModal('restaurants')" />
          </div>

          <!-- Attractions -->
          <div class="col-6">
            <RecommendationCard imageSrc="https://images.unsplash.com/photo-1553603227-2358aabe821e?w=500"
              alt="Attractions" cardLabel="Attractions" icon="bi-compass" @click="openModal('attractions')" />
          </div>
          <!-- Photo Spots -->
          <div class="col-6">
            <RecommendationCard imageSrc="https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=500"
              alt="Photospots" cardLabel="Photospots" icon="bi-camera" @click="openModal('photospots')" />
          </div>
          <!-- Festivals -->
          <div class="col-6">
            <RecommendationCard imageSrc="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500"
              alt="Festivals" cardLabel="Festivals" icon="bi-music-note" @click="openModal('festivals')" />
          </div>
          <!-- Experiences -->
          <div class="col-6">
            <RecommendationCard imageSrc="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=500"
              alt="Experiences" cardLabel="Experiences" icon="bi-calendar-event" @click="openModal('experiences')" />
          </div>
        </div>
      </div>
      <!-- BlogListModal -->
      <BlogListModal :isOpen="isModalOpen" :isLoading="isLoading" :items="blogItems" :keyword="currentKeyword"
        @close="isModalOpen = false" />
      <!-- Travel Tip -->
      <TipBox name="Travel Tip" description="Enter your budget and AI will create a customized itinerary considering accommodation, transportation, and
            meals." />

    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/common/button/BaseButton.vue";
import PageHeader from "@/components/common/header/PageHeader.vue";
import TipBox from "@/components/common/TipBox.vue";
import RecommendationCard from "@/components/planner/RecommendationCard.vue";
import { RouterLink, useRoute } from "vue-router";
import { onMounted, ref } from 'vue'
import { useTravelStore } from '@/store/travelStore'
import router from "@/router";
import { useChatStore } from "@/store/chatStore";
import chatApi from "@/api/chatApi";
import { useAuthStore } from "@/store/authStore";
import plannerApi from "@/api/plannerApi";
import BlogListModal from "@/components/planner/BlogListModal.vue";

const authStore = useAuthStore();
const travelStore = useTravelStore()
const chatStore = useChatStore();

const route = useRoute();

const promptInput = ref('')

const currentMessage = ref("");
const chatMessages = ref([]);
const messagesContainer = ref(null);
const textareaRef = ref(null);
const isLoading = ref(false);

// 모달 관련 상태
const isModalOpen = ref(false);
const blogItems = ref([]);
const currentKeyword = ref('');

// 키워드 매핑
const keywordMap = {
  accommodation: '서울 감성 숙소',
  restaurants: '서울 맛집 내돈내산',
  attractions: '서울 가볼만한곳',
  photospots: '서울 사진 명소',
  festivals: '서울 축제',
  experiences: '서울 이색 체험'
};


// 모달 열기 및 검색 실행
const openModal = async (category) => {
  const keyword = keywordMap[category] || '서울 여행';
  currentKeyword.value = keyword;

  isModalOpen.value = true;
  isLoading.value = true;
  blogItems.value = []; // 기존 리스트 초기화

  try {
    // 1. API 호출
    const res = await plannerApi.getBlogList(keyword);

    console.log("서버 응답 데이터:", res); // 브라우저 콘솔(F12)에서 구조 확인 가능

    if (res.data) {
      blogItems.value = res.data;
    }

  } catch (error) {
    console.error("검색 실패:", error);
  } finally {
    isLoading.value = false;
  }
};

function next() {
  travelStore.increaseStep();
  router.push("/planner/edit");
}

async function generateItinerary() {
  if (promptInput.value.trim()) {
    console.log('Generating itinerary with prompt:', promptInput.value)
    // AI 기반 일정 생성 로직이 여기에 추가됨
    // 예: router.push('/planner/form')
    currentMessage.value = promptInput.value;
    await sendMessage();
    // next()
  }
}

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return;

  const userMessage = {
    id: Date.now(),
    type: "user",
    content: currentMessage.value,
    timestamp: new Date(),
  };

  console.log(userMessage);

  chatMessages.value.push(userMessage);

  const toProcess = currentMessage.value;
  currentMessage.value = "";

  // 텍스트 영역 높이 초기화
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }

  isLoading.value = true;

  setTimeout(async () => {
    const aiText = await generateAIResponse(toProcess);
    chatMessages.value.push({
      id: Date.now() + 1,
      type: "ai",
      content: aiText.data.mainResponse.message,
      timestamp: new Date(),
    });
    isLoading.value = false;
    router.push("/planner/edit");
  }, 900);
};

const generateAIResponse = async (text) => {
  const low = text.toLowerCase();
  const res = await chatApi.chat({message: text, userId: authStore.userId, currentUrl: route.path});
  console.log(res);
  return res;
};

onMounted(async () => {
  try {
    if (authStore.userId != null) {
      const res = await plannerApi.getActivePlan(authStore.userId);
      if (res != null) {
        if (res.data.success === true) {
          router.push("/planner/edit");
        }
      }
    }
  } catch (error) {
    console.log(error)
  }

});
</script>

<style scoped>
.planner-create {
  background-color: #fffaf3;
  min-height: 100vh;
  padding-bottom: 6rem;
  padding: 2rem 1.25rem 6rem; /* 👈 상단 padding 2rem으로 통일 */
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

/* AI 프롬프트 섹션 */
.prompt-section {
  margin-bottom: 2rem;
}

.prompt-card {
  background: #ffffff;
  border: 1px solid rgba(255, 140, 0, 0.15);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(255, 140, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 140, 0, 0.3);
    box-shadow: 0 4px 16px rgba(255, 140, 0, 0.12);
  }
}

.prompt-header {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #1b3b6f;

  i {
    font-size: 1.2rem;
    color: #ff914d;
  }

  span:nth-child(2) {
    color: #1b3b6f;
  }

  span:nth-child(3) {
    font-size: 0.9rem;
    color: #999;
  }
}

.prompt-input-wrapper {
  position: relative;
  display: block;

  .prompt-input {
    width: 100%;
    /* add right/bottom padding so the button doesn't overlap the textarea content or border */
    padding: 1rem 7.5rem 3rem 1rem;
    /* top right bottom left */
    border: 1px solid #ddd;
    border-radius: 0.75rem;
    font-size: 0.95rem;
    background-color: #f9f9f9;
    color: #1b3b6f;
    transition: all 0.2s ease;

    &::placeholder {
      color: #aaa;
    }

    &:hover {
      border-color: rgba(#ff914d, 0.3);
      background-color: rgba(#ff914d, 0.02);
    }

    &:focus {
      border-color: #ff914d;
      outline: none;
      background-color: #fff;
      box-shadow: 0 0 0 3px rgba(#ff914d, 0.08);
    }
  }

  .btn-generate {
    position: absolute;
    right: 16px;
    bottom: 16px;
    padding: 0.6rem 1.1rem;
    background: linear-gradient(90deg, #ff914d 0%, lighten(#ff914d, 5%) 100%);
    color: white;
    border: none;
    border-radius: 28px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 6px 18px rgba(#ff914d, 0.18);

    i {
      font-size: 0.85rem;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 22px rgba(#ff914d, 0.22);
    }
  }

  @media (max-width: 576px) {
    .btn-generate {
      position: static;
      display: block;
      width: 100%;
      margin-top: 0.75rem;
      border-radius: 0.5rem;
    }
  }
}

/* AI-Recommended Places 제목 - 타이포그래피 스타일 적용 */
.recommended-section h5 {
  color: #1b3b6f;
  font-weight: 700;
  margin-bottom: 1.5rem !important;
}

/* 추천 카드 스타일 - 컴포넌트 스타일 적용 */
.recommendation-card {
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  cursor: pointer;
  height: 150px;
  box-shadow: 0 6px 16px rgba(255, 140, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(#ff914d, 0.3);
  background-color: #ffffff;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(255, 140, 0, 0.2);
    border-color: rgba(#ff914d, 0.3);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.95) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    i {
      font-size: 16px;
    }
  }

  .card-label {
    font-size: 14px;
    font-weight: 600;
  }
}

/* 버튼 스타일 - BaseButton이 있지만 추가 커스텀 */
:deep(.btn-primary) {
  background: linear-gradient(90deg, #ff914d 0%, lighten(#ff914d, 10%) 100%);
  border: none;
  color: #fff;
  font-weight: 500;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(#ff914d, 0.4);
  }
}

/* 그리드 간격 조정 */
.row.g-3 {
  margin: 0 -0.75rem;

  >.col-6 {
    padding: 0 0.75rem;
    margin-bottom: 1rem;
  }
}

/* 레이아웃 스타일 적용 - 모바일 반응형 */
@media (max-width: 576px) {
  .content-wrapper {
    padding: 1rem !important;
    margin: 4rem auto 2rem;
    border-radius: 0.75rem;
  }

  .recommendation-card {
    height: 120px;

    .card-icon {
      width: 28px;
      height: 28px;

      i {
        font-size: 14px;
      }
    }

    .card-label {
      font-size: 12px;
    }

    .card-overlay {
      padding: 8px;
    }
  }

  .recommended-section h5 {
    font-size: 1.1rem;
  }
}
</style>
