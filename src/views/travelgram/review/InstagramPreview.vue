<template>
  <div class="preview-page">
    <PageHeader title="Travelgram" subtitle="당신의 지난 여행 기록들" icon="bi-instagram" />
    <!-- 상단 헤더 -->
    <StepHeader title="여행 후기 작성" :subtitle="reviewStore.planTitle" step="6/6" @back="goBack" />

    <!-- 📸 인스타그램 프리뷰 섹션 -->
    <section class="preview-section">
      <h6 class="section-title">
        <i class="bi bi-instagram text-danger me-2"></i> 인스타그램 미리보기
      </h6>
      <p class="section-subtitle">
        당신의 게시물이 인스타그램에 어떻게 보일지 미리보기로 확인해보세요.
      </p>

      <!-- 인스타 카드 -->
      <div class="insta-card" v-if="currentPhoto">
        <!-- 프로필 -->
        <div class="insta-header">
          <div class="profile-circle">{{ user.initials }}</div>
          <div class="profile-info">
            <strong>{{ user.username }}</strong>
            <p>{{ user.location }}</p>
          </div>
        </div>

        <!-- 사진 캐러셀 -->
        <div class="photo-carousel">
          <img :src="currentPhoto.url" class="preview-photo" :alt="currentPhoto.name" @error="handleImageError" />
          <div class="photo-index">{{ currentIndex + 1 }}/{{ reviewStore.photos.length }}</div>

          <!-- ✅ 이전/다음 버튼 -->
          <button v-if="reviewStore.photos.length > 1" class="nav-btn nav-prev" @click="prevPhoto"
            :disabled="currentIndex === 0">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button v-if="reviewStore.photos.length > 1" class="nav-btn nav-next" @click="nextPhoto"
            :disabled="currentIndex === reviewStore.photos.length - 1">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>

        <!-- 액션 -->
        <div class="insta-actions">
          <i class="bi bi-heart"></i>
          <i class="bi bi-chat"></i>
          <i class="bi bi-send"></i>
        </div>

        <p class="likes-count">{{ likes.toLocaleString() }} likes</p>

        <!-- 캡션 -->
        <div class="insta-caption">
          <strong>{{ user.username }}</strong>
          <span>{{ reviewStore.caption || 'No caption added' }}</span>
        </div>

        <!-- 해시태그 -->
        <div class="insta-hashtags" v-if="reviewStore.selectedHashtags.length">
          <span v-for="tag in reviewStore.selectedHashtags" :key="tag.id">
            #{{ tag.name }}
          </span>
        </div>

        <p class="time-posted">2 hours ago</p>
      </div>

      <!-- 사진이 없을 때 -->
      <p v-else class="text-muted text-center mt-4">
        ❌ No photos uploaded yet
        <br />
        <small>Photos length: {{ reviewStore.photos?.length || 0 }}</small>
      </p>

      <!-- 복사 버튼 -->
      <div class="copy-section">
        <button class="btn-copy" @click="copyToClipboard">
          <i class="bi bi-clipboard me-2"></i>Copy Caption & Hashtags
        </button>
      </div>
    </section>

        <NavigationButtons
      backText="Back"
      :isNextDisabled="!canProceed"
      @back="goBack"
      nextText="Publish"
      @next="publish"
    >
    </NavigationButtons>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import StepHeader from '@/components/common/StepHeader.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import NavigationButtons from '@/components/common/button/NavigationButtons.vue';

// 기본 유저정보
const user = ref({
  initials: 'JH',
  username: 'jessica.han',
  location: 'Jeju Island',
})

// store 연결 (reactive)
const reviewStore = useReviewStore()
const router = useRouter()

const likes = ref(1234)
const currentIndex = ref(0)

// ✅ 안전한 현재 이미지 조회
const currentPhoto = computed(() => {
  if (!reviewStore.photos || reviewStore.photos.length === 0) return null
  return reviewStore.photos[currentIndex.value] || null
})

// ✅ 사진 네비게이션
const prevPhoto = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextPhoto = () => {
  if (currentIndex.value < reviewStore.photos.length - 1) {
    currentIndex.value++
  }
}

// 디버깅용 로그
console.log('InstagramPreview mounted')
console.log('Store photos:', reviewStore.photos)
console.log('Store photos length:', reviewStore.photos?.length)

// 복사 기능
const copyToClipboard = () => {
  const caption = reviewStore.caption || "";
  // ✅ 수정: map을 사용해 name만 추출하고 앞에 #을 붙임
  const tags = Array.isArray(reviewStore.selectedHashtags)
    ? reviewStore.selectedHashtags.map(tag => `#${tag.name}`).join(" ")
    : "";

  const text = `${caption}\n\n${tags}`.trim(); // 줄바꿈(\n) 두 번 넣으면 더 깔끔합니다.

  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("📋 Copied to clipboard!");
    })
    .catch(() => {
      alert("❌ Copy failed. Please try again.");
    });
};

// 네비게이션
const goBack = () => router.back()
const publish = () => {
  alert('✅ Your post has been published to Instagram!')
  router.push({ name: 'Complete' })
}
</script>

<style scoped>
.preview-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 1.5rem 0.75rem 6rem;
  /* ✅ 좌우 padding 축소 */
}

/* 제목 */
.section-title {
  color: #1b3b6f;
  font-weight: 600;
  padding: 0 1.25rem;
  /* ✅ 내부 padding 추가 */
}

.section-subtitle {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
  padding: 0 1.25rem;
  /* ✅ 내부 padding 추가 */
}

/* 인스타 카드 */
.insta-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid #ddd;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin: 1rem 0.75rem 2rem 0.75rem;
  /* ✅ margin 축소 */
}

/* 프로필 */
.insta-header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f1f1;
}

.profile-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #1b3b6f;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.profile-info p {
  color: #777;
  font-size: 0.8rem;
  margin: 0;
}

/* 사진 */
.photo-carousel {
  position: relative;
  background-color: #f5f5f5;
  aspect-ratio: 4 / 5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
}

.preview-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-index {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  z-index: 5;
}

/* ✅ 이전/다음 버튼 */
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

/* 액션 */
.insta-actions {
  display: flex;
  gap: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  font-size: 1.3rem;
  color: #333;
}

.likes-count {
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0 1rem;
}

/* 캡션 */
.insta-caption {
  padding: 0.5rem 1rem 0 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 해시태그 */
.insta-hashtags {
  padding: 0.5rem 1rem;
  color: #1b3b6f;
  font-size: 0.85rem;
  flex-wrap: wrap;
  display: flex;
  gap: 0.25rem;
}

.insta-hashtags span {
  cursor: pointer;
}

.time-posted {
  color: #888;
  font-size: 0.8rem;
  padding: 0 1rem 1rem 1rem;
}

/* 복사 버튼 */
.copy-section {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 0 1.25rem;
  /* ✅ 내부 padding 추가 */
}

.btn-copy {
  background: #fff;
  border: 2px solid #1b3b6f;
  color: #1b3b6f;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-copy:hover {
  background: #1b3b6f;
  color: white;
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
