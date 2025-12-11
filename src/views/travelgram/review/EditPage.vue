<template>
    <PageHeader
      title="Travelgram"
      subtitle="당신의 지난 여행 기록들"
      icon="bi-instagram"
    />
  <div class="review-edit-page">
    <StepHeader title="여행 후기 편집" :subtitle="reviewStore.planTitle" step="5/6" @back="goBack" />

    <section class="review-section">
      <h6 class="section-title">
        <i class="bi bi-pencil-square me-2 text-primary"></i>
        후기 & 편집
      </h6>

      <!-- 📸 Photos -->
      <div class="photo-section">
        <div class="photo-header d-flex justify-content-between align-items-center">
          <p class="photo-count">사진 ({{ photos.length }})</p>
        </div>
        <!-- ✅ 사진 컨테이너 (네비게이션 포함) -->
        <div class="photo-container">
          <div class="photo-carousel">
            <div v-for="(photo, index) in photos" :key="photo.id" class="photo-item">
              <img :src="photo.url" alt="photo" />
              <div v-if="photo.id === reviewStore.mainPhotoId" class="main-badge">🌟 대표 사진</div>
              <div class="photo-index">{{ index + 1 }}/{{ photos.length }}</div>
            </div>
          </div>
          <!-- ✅ 이전/다음 네비게이션 버튼 -->
          <button v-if="photos.length > 1" class="nav-btn nav-prev" @click="prevPhoto" :disabled="currentPhotoIndex === 0">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button v-if="photos.length > 1" class="nav-btn nav-next" @click="nextPhoto" :disabled="currentPhotoIndex === photos.length - 1">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- ✍️ Caption -->
      <div class="caption-section mt-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6>내용</h6>
        </div>
        <textarea v-model="caption" rows="4" class="caption-box" maxlength="2200"></textarea>
        <p class="char-count">{{ caption.length }} 글자</p>
      </div>

      <!-- 🏷️ Hashtags -->
      <div class="hashtag-section mt-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6>해시태그</h6>
        </div>
        <div class="hashtag-box">
          <span v-for="(tag,index) in selectedHashtags" :key="index" class="tag">#{{ tag.name}}</span>
        </div>
        <p class="tag-count">{{ selectedHashtags.length }} 개</p>
      </div>
    </section>

        <NavigationButtons
      backText="Back"
      :isNextDisabled="!canProceed"
      @back="goBack"
      @next="goNext"
    >
    </NavigationButtons>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useReviewStore } from "@/store/reviewStore";
import api from "@/api/travelgramApi"
import StepHeader from "@/components/common/StepHeader.vue";
import PageHeader from "@/components/common/PageHeader.vue";
import NavigationButtons from '@/components/common/button/NavigationButtons.vue';

const route = useRoute();
const router = useRouter();
const reviewStore = useReviewStore();

// store 데이터
const photos = computed(() => reviewStore.photos);
const caption = ref(reviewStore.caption || "");
const selectedHashtags = computed(() => reviewStore.selectedHashtags || []);

// ✅ 현재 사진 인덱스
const currentPhotoIndex = ref(0);

// 반응형 저장
watch(caption, (val) => reviewStore.caption = val);

// ✅ 사진 네비게이션
const prevPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--;
    scrollToPhoto();
  }
};

const nextPhoto = () => {
  if (currentPhotoIndex.value < photos.value.length - 1) {
    currentPhotoIndex.value++;
    scrollToPhoto();
  }
};

const scrollToPhoto = () => {
  const carousel = document.querySelector('.photo-carousel');
  if (carousel) {
    const itemWidth = carousel.querySelector('.photo-item').offsetWidth + 16; // 16은 gap
    carousel.scrollLeft = currentPhotoIndex.value * itemWidth;
  }
};

const goBack = () => router.back();
const goNext = async() => {

try {
    // 1) 스토어에 상태 저장 (클라이언트 상태 동기화)
    reviewStore.setCaption(caption.value);

    // 2) API 호출 (DB 업데이트)
    // reviewPostId가 없으면 에러 방지 (선택사항)
    if (reviewStore.reviewPostId) {
      await api.updateCaption(reviewStore.reviewPostId, caption.value);
    } else {
      console.warn("reviewPostId가 없습니다. 저장을 건너뜁니다.");
    }

    // 3) 다음 페이지로 이동
    router.push({ name: 'InstagramPreview', params: { planId: route.params.planId } });

  } catch (error) {
    console.error("캡션 저장 중 오류 발생:", error);
    alert("저장에 실패했습니다. 다시 시도해주세요.");
  }
};  
</script>

<style scoped>
.review-edit-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 0.75rem 6rem;
}

.section-title {
  color: #1b3b6f;
  font-weight: 600;
  margin-bottom: 1rem;
}

.edit-btn,
.change-btn {
  background: none;
  border: none;
  color: #ff8c00;
  font-weight: 600;
  cursor: pointer;
}

/* ✅ 사진 컨테이너 (네비게이션 포함) */
.photo-container {
  position: relative;
}

.photo-carousel {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 1rem;
  scroll-behavior: smooth;
  padding-bottom: 0.5rem;
  scroll-snap-type: x mandatory;
}

/* 스크롤바 숨기기 */
.photo-carousel::-webkit-scrollbar {
  display: none;
}

.photo-carousel {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.photo-item {
  position: relative;
  flex: 0 0 90%;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  aspect-ratio: 3 / 4;
  scroll-snap-align: start;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-badge {
  position: absolute;
  top: .75rem;
  left: .75rem;
  background: #1b3b6f;
  color: #fff;
  font-size: .75rem;
  padding: .3rem .6rem;
  border-radius: .5rem;
}

.photo-index {
  position: absolute;
  top: .75rem;
  right: .75rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: .75rem;
  border-radius: 1rem;
  padding: .2rem .5rem;
}

/* ✅ 네비게이션 버튼 */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  z-index: 10;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.8);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-prev {
  left: 0.75rem;
}

.nav-next {
  right: 0.75rem;
}

.caption-box {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 1rem;
  padding: 1rem;
  background: #fff;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: none;
}

.hashtag-box {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 1rem;
  padding: 1rem;
  gap: 0.5rem;
}

.tag {
  background: #ff8c00;
  color: #fff;
  border-radius: 1rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

/* 하단 버튼 영역 */
.navigation-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
}

.btn-back,
.btn-next {
  flex: 1;
  height: 48px;
  border-radius: 1rem;
  border: none;
  font-weight: 600;
  font-size: 1rem;
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
