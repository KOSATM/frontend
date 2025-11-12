<template>
  <div class="preview-page">

    <ReviewHeader
      title="Instagram Preview"
      :subtitle="tripTitle"
      step="6/6"
      @back="goBack"
    />
        <section class="preview-section">
      <h6 class="section-title">
        <i class="bi bi-instagram text-danger me-2"></i> Instagram Preview
      </h6>
      <p class="section-subtitle">
        Preview how your post will look on Instagram
      </p>

      <!-- 인스타 프리뷰 카드 -->
      <div class="insta-card">
        <!-- 헤더 -->
        <div class="insta-header">
          <div class="profile-circle">{{ user.initials }}</div>
          <div class="profile-info">
            <strong>{{ user.username }}</strong>
            <p>{{ user.location }}</p>
          </div>
        </div>

        <!-- 사진 캐러셀 -->
        <div class="photo-carousel">
          <img
            v-for="(photo, index) in photos"
            :key="photo.id"
            :src="photo.url"
            class="preview-photo"
            :alt="'photo ' + (index + 1)"
          />
          <div class="photo-index">{{ currentIndex + 1 }}/{{ photos.length }}</div>
        </div>

        <!-- 액션 영역 -->
        <div class="insta-actions">
          <i class="bi bi-heart"></i>
          <i class="bi bi-chat"></i>
          <i class="bi bi-send"></i>
        </div>

        <p class="likes-count">{{ likes.toLocaleString() }} likes</p>

        <!-- 캡션 -->
        <div class="insta-caption">
          <strong>{{ user.username }}</strong>
          <span>{{ caption }}</span>
        </div>

        <!-- 해시태그 -->
        <div class="insta-hashtags">
          <span v-for="tag in hashtags" :key="tag">{{ tag }}</span>
        </div>

        <p class="time-posted">2 hours ago</p>
      </div>

      <!-- 복사 버튼 -->
      <div class="copy-section">
        <button class="btn-copy" @click="copyToClipboard">
          <i class="bi bi-clipboard me-2"></i>Copy Caption & Hashtags
        </button>
      </div>
    </section>

    <!-- 하단 버튼 -->
    <div class="navigation-buttons">
      <button class="btn-back" @click="goBack">Back</button>
      <button class="btn-next" @click="publish">
        <i class="bi bi-instagram me-2"></i> Publish to Instagram
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ReviewHeader from '@/components/history/ReviewHeader.vue'

const router = useRouter()

// 사용자 정보
const user = ref({
  initials: 'JH',
  username: 'jessica.han',
  location: 'Jeju Island'
})

// 임시 데이터
const photos = ref([
  { id: 1, url: 'https://images.unsplash.com/photo-1682686580458-58efc4f68b1c?w=800' },
  { id: 2, url: 'https://images.unsplash.com/photo-1613810739984-31af6a4bb3b8?w=800' },
  { id: 3, url: 'https://images.unsplash.com/photo-1576416981707-5c16f8e3ff04?w=800' }
])

const caption = ref(
  '🌊 Lost in the endless blue of Jeju Island... Where the ocean meets the sky, and time stands still. Every wave whispers stories of ancient volcanoes and island dreams. 🏝️✨'
)

const hashtags = ref([
  '#JejuIsland', '#JejuTravel', '#Korea', '#TravelKorea',
  '#IslandLife', '#BeachVibes', '#NatureLovers', '#Wanderlust'
])

const likes = ref(1234)
const currentIndex = ref(0)

// 복사 기능
const copyToClipboard = () => {
  const text = `${caption.value}\n${hashtags.value.join(' ')}`
  navigator.clipboard.writeText(text)
  alert('📋 Copied to clipboard!')
}

// 이동
const goBack = () => router.back()
const publish = () => {
  // 인스타그램 API 연동 시 실제 POST 요청 수행
  alert('✅ Your post has been published to Instagram!')
  router.push({ name: 'ReviewComplete' })
}
</script>

<style scoped>
.preview-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem 6rem;
}

/* 진행 표시바 */
.progress-bar {
  width: 100%;
  height: 6px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}
.progress-fill {
  width: 100%;
  height: 100%;
  background: #1b3b6f;
  border-radius: 4px;
  animation: fill 0.8s ease;
}
@keyframes fill {
  from { width: 0; }
  to { width: 100%; }
}

/* 제목 */
.section-title {
  color: #1b3b6f;
  font-weight: 600;
}
.section-subtitle {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

/* 인스타 카드 */
.insta-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid #ddd;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
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
}
.preview-photo {
  width: 100%;
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
  margin-right: 0.4rem;
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

/* 하단 버튼 */
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
.btn-next:hover {
  background-color: #16305c;
}
</style>
