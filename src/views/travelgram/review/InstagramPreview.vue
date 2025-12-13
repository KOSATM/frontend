<template>
  <div class="preview-page">
    <PageHeader title="트래벌그램" subtitle="당신의 지난 여행 기록들" icon="bi-instagram" />
    <StepHeader title="여행 후기 작성" :subtitle="stepSubtitle" step="6/6" @back="goBack" />

    <section class="preview-section">
      <h6 class="section-title">
        <i class="bi bi-instagram text-danger me-2"></i> 인스타그램 미리보기
      </h6>
      <p class="section-subtitle">
        당신의 게시물이 인스타그램에 어떻게 보일지 미리보기로 확인해보세요.
      </p>

      <div class="insta-card" v-if="currentPhoto">
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

        <div class="photo-carousel">
          <img :src="currentPhoto.url" class="preview-photo" :alt="currentPhoto.name" @error="handleImageError" />
          <div class="photo-index">{{ currentIndex + 1 }}/{{ reviewStore.photos.length }}</div>

          <button v-if="reviewStore.photos.length > 1" class="nav-btn nav-prev" @click="prevPhoto"
            :disabled="currentIndex === 0">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button v-if="reviewStore.photos.length > 1" class="nav-btn nav-next" @click="nextPhoto"
            :disabled="currentIndex === reviewStore.photos.length - 1">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>

        <div class="insta-actions">
          <i class="bi bi-heart"></i>
          <i class="bi bi-chat"></i>
          <i class="bi bi-send"></i>
        </div>

        <p class="likes-count">{{ likes.toLocaleString() }} likes</p>

        <div class="insta-caption">
          <strong>{{ userInfo.handle }}</strong>
          <span>{{ reviewStore.caption || '추가된 내용이 없습니다.' }}</span>
        </div>

        <div class="insta-hashtags" v-if="reviewStore.selectedHashtags.length">
          <span v-for="tag in reviewStore.selectedHashtags" :key="tag.id">
            #{{ tag.name }}
          </span>
        </div>

        <p class="time-posted">2 hours ago</p>
      </div>

      <p v-else class="text-muted text-center mt-4">
        ❌ 사진이 업로드 되지 않았습니다. 새로고침을 하셨다면 처음부터 다시 시작해주세요.
        <br />
        <small>Photos length: {{ reviewStore.photos?.length || 0 }}</small>
      </p>

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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import { useAuthStore } from '@/store/authStore' // ✅ authStore import
import StepHeader from '@/components/common/header/StepHeader.vue'
import PageHeader from '@/components/common/header/PageHeader.vue'
import NavigationButtons from '@/components/common/button/NavigationButtons.vue';
// ✅ 기본 프로필 이미지 임포트
import defaultProfileImg from '@/assets/img/profile-logo.png';
import { JOURNEY_SUBTITLES } from '@/constants/journeySubtitles'

// Store 연결
const reviewStore = useReviewStore()
const authStore = useAuthStore() // ✅ authStore 사용
const router = useRouter()
const stepSubtitle = computed(() => JOURNEY_SUBTITLES[6])
// ✅ 새로고침 시 인증 정보 유실 방지
onMounted(() => {
  if (!authStore.isLoggedIn) {
    authStore.initializeAuth()
  }
})

// ✅ 유저 정보 Computed (authStore 연동)
const userInfo = computed(() => {
  // 이름이 없으면 'Traveler' 사용
  const name = authStore.userName || 'Traveler'
  
  return {
    // 인스타 아이디처럼 보이게 공백을 점으로 대체하고 소문자로 변환
    handle: name.toLowerCase().replace(/\s+/g, '.'),
    // authStore의 프로필 이미지 경로 사용 (없으면 null)
    profileImage: authStore.userProfileImage,
    // 위치 정보 (추후 store에서 가져올 수 있음)
    location: '대한민국, 서울' 
  }
})

const likes = ref(1234)
const currentIndex = ref(0)
const canProceed = computed(() => {
  return reviewStore.photos && reviewStore.photos.length > 0;
});
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

// 이미지 로드 에러 처리 (옵션)
const handleImageError = (e) => {
  // e.target.src = '/path/to/fallback/image.jpg' 
  console.error('Image load failed:', e.target.src)
}


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
const goBack = () => router.push('EditPage')
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

/* ✅ 프로필 이미지 스타일 추가 */
.profile-img-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
  margin-right: 0.75rem;
}

/* 기존 .profile-circle 스타일 제거됨 */

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

/* 네비게이션 버튼 */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: #333;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.9);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.nav-prev {
  left: 10px;
}

.nav-next {
  right: 10px;
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

.insta-caption strong {
  margin-right: 8px; /* 간격 크기 조절 (6px ~ 8px 추천) */
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
</style>