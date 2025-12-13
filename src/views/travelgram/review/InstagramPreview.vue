<template>
  <div class="preview-page">
    <PageHeader
      title="트래벌그램"
      subtitle="당신의 지난 여행 기록들"
      icon="bi-instagram"
    />

    <StepHeader
      title="여행 후기 작성"
      :subtitle="stepSubtitle"
      step="6/6"
      @back="goBack"
    />

    <section class="preview-section">
      <h6 class="section-title">
        <i class="bi bi-instagram me-2"></i>
        인스타그램 미리보기
      </h6>
      <p class="section-subtitle">
        실제 인스타그램에 업로드되었을 때의 모습을 확인해보세요.
      </p>

      <div class="insta-card" v-if="currentPhoto">
        <!-- 상단 프로필 -->
        <div class="insta-header">
          <img
            :src="userInfo.profileImage || defaultProfileImg"
            class="profile-img-circle"
            alt="Profile"
          />
          <div class="profile-info">
            <strong>{{ userInfo.handle }}</strong>
            <p>{{ userInfo.location }}</p>
          </div>
        </div>

        <!-- 사진 -->
        <div class="photo-carousel">
          <img
            :src="currentPhoto.url"
            class="preview-photo"
            :alt="currentPhoto.name"
            @error="handleImageError"
          />

          <div class="photo-index">
            {{ currentIndex + 1 }}/{{ reviewStore.photos.length }}
          </div>

          <button
            v-if="reviewStore.photos.length > 1"
            class="nav-btn nav-prev"
            @click="prevPhoto"
            :disabled="currentIndex === 0"
          >
            <i class="bi bi-chevron-left"></i>
          </button>

          <button
            v-if="reviewStore.photos.length > 1"
            class="nav-btn nav-next"
            @click="nextPhoto"
            :disabled="currentIndex === reviewStore.photos.length - 1"
          >
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
          <strong>{{ userInfo.handle }}</strong>
          <span>{{ reviewStore.caption || '추가된 내용이 없습니다.' }}</span>
        </div>

        <!-- 해시태그 -->
        <div
          class="insta-hashtags"
          v-if="reviewStore.selectedHashtags.length"
        >
          <span
            v-for="tag in reviewStore.selectedHashtags"
            :key="tag.id"
          >
            #{{ tag.name }}
          </span>
        </div>

        <p class="time-posted">2 hours ago</p>
      </div>

      <p v-else class="empty-state">
        사진 정보를 불러올 수 없습니다.
        <br />
        처음 단계부터 다시 시도해주세요.
      </p>

      <!-- 복사 -->
      <div class="copy-section">
        <button class="btn-copy" @click="copyToClipboard">
          <i class="bi bi-clipboard me-2"></i>
          캡션 & 해시태그 복사
        </button>
      </div>
    </section>

    <NavigationButtons
      backText="뒤로가기"
      :isNextDisabled="!canProceed"
      @back="goBack"
      nextText="Publish"
      @next="발행하기"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import { useAuthStore } from '@/store/authStore'

import StepHeader from '@/components/common/header/StepHeader.vue'
import PageHeader from '@/components/common/header/PageHeader.vue'
import NavigationButtons from '@/components/common/button/NavigationButtons.vue'
import defaultProfileImg from '@/assets/img/profile-logo.png'
import { JOURNEY_SUBTITLES } from '@/constants/journeySubtitles'

const reviewStore = useReviewStore()
const authStore = useAuthStore()
const router = useRouter()

const stepSubtitle = computed(() => JOURNEY_SUBTITLES[6])

onMounted(() => {
  if (!authStore.isLoggedIn) {
    authStore.initializeAuth()
  }
})

const userInfo = computed(() => {
  const name = authStore.userName || 'Traveler'
  return {
    handle: name.toLowerCase().replace(/\s+/g, '.'),
    profileImage: authStore.userProfileImage,
    location: '대한민국, 서울'
  }
})

const likes = ref(1234)
const currentIndex = ref(0)

const canProceed = computed(() => {
  return reviewStore.photos && reviewStore.photos.length > 0
})

const currentPhoto = computed(() => {
  if (!reviewStore.photos?.length) return null
  return reviewStore.photos[currentIndex.value]
})

const prevPhoto = () => {
  if (currentIndex.value > 0) currentIndex.value--
}
const nextPhoto = () => {
  if (currentIndex.value < reviewStore.photos.length - 1) {
    currentIndex.value++
  }
}

const handleImageError = (e) => {
  console.error('Image load failed:', e.target.src)
}

const copyToClipboard = () => {
  const caption = reviewStore.caption || ''
  const tags = reviewStore.selectedHashtags
    .map(tag => `#${tag.name}`)
    .join(' ')
  const text = `${caption}\n\n${tags}`.trim()

  navigator.clipboard.writeText(text).then(() => {
    alert('📋 Copied!')
  })
}

const goBack = () => router.push({ name: 'EditPage' })
const publish = () => {
  alert('✅ 게시물이 준비되었습니다!')
  router.push({ name: 'CompleteReview' })
}
</script>

<style scoped>
.preview-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 1.75rem 0.75rem 6rem;
}

/* 섹션 */
.section-title {
  color: #1b3b6f;
  font-weight: 600;
  padding: 0 1.25rem;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #6c757d;
  padding: 0 1.25rem;
  margin-bottom: 1.25rem;
}

/* 카드 */
.insta-card {
  background: white;
  border-radius: 1.25rem;
  border: 1px solid #eee;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  margin: 0 0.75rem 2rem;
}

/* 프로필 */
.insta-header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f1f1;
}

.profile-img-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
  margin-right: 0.75rem;
}

.profile-info p {
  color: #777;
  margin: 0;
}

/* 사진 */
.photo-carousel {
  position: relative;
  aspect-ratio: 4 / 5;
  background: #f5f5f5;
  overflow: hidden;
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
  padding: 0.25rem 0.6rem;
  border-radius: 1rem;
}

/* 네비 */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.75);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.nav-prev { left: 10px }
.nav-next { right: 10px }

/* 액션 */
.insta-actions {
  display: flex;
  gap: 1rem;
  padding: 0.75rem 1rem 0;
  color: #333;
}

.likes-count {
  font-weight: 600;
  padding: 0.25rem 1rem;
}

/* 캡션 */
.insta-caption {
  padding: 0.5rem 1rem 0;
  line-height: 1.5;
}

.insta-caption strong {
  margin-right: 0.5rem;
}

/* 해시태그 */
.insta-hashtags {
  padding: 0.5rem 1rem;
  color: #1b3b6f;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

/* 시간 */
.time-posted {
  color: #888;
  padding: 0 1rem 1rem;
}

/* 복사 */
.copy-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.btn-copy {
  background: white;
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
</style>
