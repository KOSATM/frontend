<template>
  <div class="photo-upload-page">
    <!-- 🔸 상단 헤더 -->
    <ReviewHeader
      title="Create Travel Review"
      :subtitle="reviewStore.tripTitle"
      step="1/6"
      @back="goBack"
    />

    <h6 class="upload-title mb-1">
      <i class="bi bi-image me-1 text-primary"></i> Upload Photos
    </h6>
    <p class="upload-subtitle">
      Upload up to 10 photos from your trip ({{ uploadedImages.length }}/10)
    </p>
    <section class="upload-section">
      
      <!-- 🖼️ 업로드 박스 -->
        <div class="upload-box" @click="triggerFileInput">
          <i class="bi bi-cloud-arrow-up fs-2 text-secondary mb-2"></i>
          <p class="text-secondary mb-0">Click to upload photos</p>
          <small class="text-muted">JPG, PNG up to 10MB each</small>
          <input
            type="file"
            multiple
            accept="image/*"
            ref="fileInput"
            @change="handleFileUpload"
            hidden
          />
        </div>

        <div v-if="uploadedImages.length" class="preview-grid mt-3">
          <div v-for="(img, idx) in uploadedImages" :key="idx" class="preview-item">
            <img :src="img.url" :alt="img.name" />
          </div>
        </div>
      </section>

      <!-- 🟦 하단 버튼 -->
      <div class="navigation-buttons">
        <button class="btn-next" :disabled="!uploadedImages.length" @click="nextStep">
          Next Step
        </button>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import { v4 as uuidv4 } from 'uuid'
import ReviewHeader from '@/components/common/DetailHeader.vue'

const router = useRouter()
const route = useRoute()
const reviewStore = useReviewStore()

const tripId = route.params.tripId
const tripTitle = route.query.title || 'My Trip'

// store에 여행 정보 저장
reviewStore.setTripInfo(tripId, tripTitle)

const fileInput = ref(null)
const uploadedImages = ref([])

const triggerFileInput = () => fileInput.value?.click()

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)

  if (uploadedImages.value.length + files.length > 10) {
    alert('최대 10장까지만 업로드할 수 있습니다.')
    return
  }

  files.forEach((file) => {
    // FileReader를 사용하여 Base64로 변환
    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = {
        id: uuidv4(),
        name: file.name,
        url: e.target.result, // ✅ Base64 문자열
        file,
      }
      uploadedImages.value.push(preview)
    }
    reader.readAsDataURL(file)
  })
}

// Step 2로 이동
const nextStep = () => {
  reviewStore.setPhotos(uploadedImages.value)
  reviewStore.nextStep()
  router.push({
    name: 'ReviewPhotoOrder',
    params: { tripId },
    query: { title: tripTitle },
  })
}

const goBack = () => router.back()
</script>

<style scoped>
/* ✅ 전체 페이지 배경 */
.photo-upload-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding-bottom: 6rem;
  padding: 2rem 1.25rem 6rem;
}

/* ✅ 중앙 카드형 컨테이너 */
.upload-container {
  background-color: #fff;
  border-radius: 1.25rem;
  padding: 2rem 1.5rem;
  margin: 1.5rem 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* 업로드 섹션 */
.upload-section {
  background-color: #f9fafc;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #eee;
}

.upload-title {
  font-weight: 600;
  color: #1b3b6f;
}

.upload-subtitle {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.upload-box {
  border: 2px dashed #d0d5dd;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem; /* ✅ 글씨 키움 */
}
.upload-box:hover {
  background-color: #fef8f2;
}

/* 미리보기 */
.preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.preview-item {
  width: 80px;
  height: 80px;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 하단 버튼 */
.navigation-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}
.btn-next {
  flex: 1;
  height: 48px;
  background-color: #1b3b6f;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.btn-next:disabled {
  background-color: #b0bfd8;
  cursor: not-allowed;
}
.btn-next:hover:not(:disabled) {
  background-color: #ff8c00;
}
</style>
