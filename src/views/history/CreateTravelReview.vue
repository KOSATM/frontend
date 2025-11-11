<template>
    <div class="history-page">

        <PageHeader
          title="History"
          subtitle="Your past travel adventures"
          icon="bi-clock-history"
        />
      <div class="review-container container-fms">
        <!-- 🔙 상단 헤더 -->
        <div class="review-header d-flex justify-content-between align-items-center mb-3">
          <div class="d-flex align-items-center">
            <i class="bi bi-arrow-left-short back-icon" @click="goBack"></i>
            <div>
              <h6 class="review-title mb-0">Create Travel Review</h6>
              <small class="review-subtitle text-muted">{{ tripTitle }}</small>
            </div>
          </div>
          <span class="review-step text-muted">Step {{ step }}/6</span>
        </div>
    
        <!-- 🖼️ 업로드 박스 -->
        <div class="upload-section">
          <h6 class="upload-title mb-1">
            <i class="bi bi-image me-1 text-primary"></i> Upload Photos
          </h6>
          <p class="upload-subtitle">Upload up to 10 photos from your trip ({{ uploadedImages.length }}/10)</p>
    
          <div class="upload-box" @click="triggerFileInput">
            <i class="bi bi-cloud-arrow-up fs-2 text-secondary mb-2"></i>
            <p class="text-secondary mb-0">Click to upload photos</p>
            <small class="text-muted">JPG, PNG up to 10MB each</small>
            <input type="file" multiple accept="image/*" ref="fileInput" @change="handleUpload" hidden />
          </div>
    
          <div v-if="uploadedImages.length" class="preview-grid mt-3">
            <div v-for="(img, idx) in uploadedImages" :key="idx" class="preview-item">
              <img :src="img" alt="preview" />
            </div>
          </div>
        </div>
    
        <!-- 🟦 하단 버튼 -->
        <div class="next-step-area mt-4">
          <button class="btn-next w-100" :disabled="!uploadedImages.length" @click="nextStep">
            Next Step
          </button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReviewStore } from '@/stores/reviewStore'
import PageHeader from '@/components/common/PageHeader.vue'

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

const handleUpload = (e) => {
  const files = e.target.files
  let id = 1
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      uploadedImages.value.push({
        id: id++,
        src: ev.target.result
      })
    }
    reader.readAsDataURL(file)
  }
}

// Step 2로 이동
const nextStep = () => {
  reviewStore.setPhotos(uploadedImages.value)
  reviewStore.nextStep()
  router.push({
    name: 'ReviewPhotoOrder',
    params: { tripId },
    query: { title: tripTitle }
  })
}

const goBack = () => router.back()
</script>

<style scoped>
.review-container {
  background-color: #fff;
  border-radius: 1.25rem;
  padding: 2rem;
}

/* 헤더 */
.review-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 0.75rem;
}

.back-icon {
  font-size: 1.6rem;
  cursor: pointer;
  color: #ff8c00;
  margin-right: 0.5rem;
  transition: transform 0.2s;
}

.back-icon:hover {
  transform: translateX(-2px);
}

.review-title {
  font-weight: 700;
  color: #1b3b6f;
}

.review-step {
  font-size: 0.9rem;
}

/* 업로드 영역 */
.upload-section {
  background-color: #f9fafc;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #eee;
}

.upload-box {
  border: 2px dashed #d0d5dd;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
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

/* 버튼 */
.btn-next {
  background-color: #1b3b6f;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 1rem;
  padding: 0.9rem 0;
  transition: background-color 0.3s ease;
}

.btn-next:disabled {
  background-color: #b0bfd8;
  cursor: not-allowed;
}

.btn-next:hover:not(:disabled) {
  background-color: #ff8c00;
}
</style>
