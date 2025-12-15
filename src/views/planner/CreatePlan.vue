<template>
  <div class="planner-page">
    <!-- 플래너 탭 -->
    <PageHeader title="플래너" subtitle="당신의 서울 여행 일정을 만들고 관리해보세요." icon="bi-map" />

    <!-- 메인 컨텐츠 -->
    <div class="content-wrapper px-4 py-4">

      <!-- AI 프롬프트 입력 섹션 -->
      <div class="prompt-section mb-5">
        <div class="prompt-card">
          <div class="prompt-input-wrapper">
            <textarea class="prompt-input form-control" placeholder="여행 일정을 생성해보세요. 예) KPOP 3일 여행 일정을 생성해줘." v-model="promptInput"
              rows="4"></textarea>

            <!-- Button sits inside the textarea wrapper, overlapping the bottom-left -->
            <button class="btn-generate" @click="generateItinerary" :disabled="!promptInput.trim() || isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
              생성하기
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
        <h3 class="fw-bold">서울 추천 장소 검색</h3>

        <!-- 카드 그리드 -->
        <div class="row g-3 mb-3">
          <!-- Accommodation -->
          <div class="col-6">
            <RecommendationCard :imageSrc="accommodationImg"
              alt="Accommodation" cardLabel="감성 숙소" icon="bi-house-heart" @click="openModal('accommodation')" />
          </div>

          <!-- @/src/assets/img/planner-recommendation/accomdation.png -->
          <!-- Restaurants -->
          <div class="col-6">
            <RecommendationCard :imageSrc="restaurantImg"
              alt="Restaurants" cardLabel="맛집 내돈내산" icon="bi-cup-hot" @click="openModal('restaurants')" />
          </div>

          <!-- Attractions -->
          <div class="col-6">
            <RecommendationCard :imageSrc="attractionImg"
              alt="Attractions" cardLabel="가볼만한 곳" icon="bi-compass" @click="openModal('attractions')" />
          </div>
          <!-- Photo Spots -->
          <div class="col-6">
            <RecommendationCard :imageSrc="photoSpotImg"
              alt="Photospots" cardLabel="사진 명소" icon="bi-camera" @click="openModal('photospots')" />
          </div>
          <!-- Festivals -->
          <div class="col-6">
            <RecommendationCard :imageSrc="festivalImg"
              alt="Festivals" cardLabel="축제" icon="bi-music-note" @click="openModal('festivals')" />
          </div>
          <!-- Experiences -->
          <div class="col-6">
            <RecommendationCard :imageSrc="experienceImg"
              alt="Experiences" cardLabel="이색 체험" icon="bi-calendar-event" @click="openModal('experiences')" />
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

// 1. 이미지 파일들을 import 합니다.
// (주의: 파일명 철자가 스크린샷과 일치하는지 꼭 확인하세요! 예: accomodation vs accommodation)
import accommodationImg from '@/assets/img/planner-recommendation/accommodation.png'
import restaurantImg from '@/assets/img/planner-recommendation/restaurant.png'
import attractionImg from '@/assets/img/planner-recommendation/attraction.png'
import photoSpotImg from '@/assets/img/planner-recommendation/photospot.png'
import festivalImg from '@/assets/img/planner-recommendation/festival.png'
import experienceImg from '@/assets/img/planner-recommendation/experience.png'

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
    console.log('AI Response:', aiText); // 디버깅용
    // ✅ Axios 응답 구조를 고려한 정확한 파싱
    const apiRes = aiText.data;
    let message = "";
    if (apiRes?.data?.mainResponse?.message) {
      message = apiRes.data.mainResponse.message;
    } else if (apiRes?.message) {
      message = apiRes.message;
    } else {
      message = "응답을 받지 못했습니다.";
    }

    chatMessages.value.push({
      id: Date.now() + 1,
      type: "ai",
      content: message,
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

// onMounted(async () => {
//   try {
//     if (authStore.userId != null) {
//       const res = await plannerApi.getActivePlan(authStore.userId);
//       if (res != null) {
//         if (res.data.success === true) {
//           router.push("/planner/edit");
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error)
//   }

// });
</script>

<style scoped>
.planner-page {
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
  color: #1b3b6f;

  i {
    color: #ff914d;
  }

  span:nth-child(2) {
    color: #1b3b6f;
  }

  span:nth-child(3) {
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
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 6px 18px rgba(#ff914d, 0.18);

    i {
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
/* .recommended-section h5 {
  color: #1b3b6f;
  font-weight: 700;
  margin-bottom: 1.5rem !important;
} */


/* 버튼 스타일 - BaseButton이 있지만 추가 커스텀 */
/* :deep(.btn-primary) {
  background: linear-gradient(90deg, #ff914d 0%, lighten(#ff914d, 10%) 100%);
  border: none;
  color: #fff;
  font-weight: 500;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(#ff914d, 0.4);
  }
} */

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
    }

    .card-overlay {
      padding: 8px;
    }
  }

}
</style>
