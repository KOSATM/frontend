<template>
  <div class="review-container container-fms">
    <!-- 🔙 헤더 -->
    <div class="review-header d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex align-items-center">
        <i class="bi bi-arrow-left-short back-icon" @click="goBack"></i>
        <div>
          <h6 class="review-title mb-0">Create Travel Review</h6>
          <small class="review-subtitle text-muted">{{ tripTitle }}</small>
        </div>
      </div>
      <span class="review-step text-muted">Step 2/6</span>
    </div>

    <!-- 🧭 진행 바 -->
    <div class="progress mb-3">
      <div class="progress-bar bg-primary" role="progressbar" style="width: 33%"></div>
    </div>

    <!-- 🖼️ 사진 순서 & 대표사진 지정 -->
    <section class="photo-order-section">
      <h6 class="section-title">
        <i class="bi bi-images me-1 text-primary"></i>
        Arrange Photo Order & Select Main Photo
      </h6>
      <p class="section-subtitle">
        Use buttons to change the order of your photos and select the main photo
      </p>

      <!-- 리스트 -->
      <div
        v-for="(photo, index) in photos"
        :key="photo.id"
        class="photo-item"
        :class="{ active: photo.id === mainPhotoId }"
      >
        <div class="photo-thumb">
          <img :src="photo.src" :alt="'Photo ' + (index + 1)" />
        </div>

        <div class="photo-info flex-grow-1">
          <h6>Photo {{ index + 1 }}</h6>
          <p>Jeju Island</p>
        </div>

        <div class="photo-actions d-flex align-items-center">
          <button class="btn btn-sm btn-outline-secondary me-1" @click="moveUp(index)">
            <i class="bi bi-arrow-up"></i>
          </button>
          <button class="btn btn-sm btn-outline-secondary me-1" @click="moveDown(index)">
            <i class="bi bi-arrow-down"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger me-1" @click="removePhoto(photo.id)">
            <i class="bi bi-x-lg"></i>
          </button>
          <button
            class="btn btn-sm btn-outline-primary"
            @click="selectMain(photo.id)"
            :disabled="photo.id === mainPhotoId"
          >
            <i class="bi" :class="photo.id === mainPhotoId ? 'bi-check-circle-fill' : 'bi-check-circle'"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- 🟦 하단 버튼 -->
    <div class="next-step-area mt-4 d-flex justify-content-between">
      <button class="btn-back" @click="goBack">Back</button>
      <button class="btn-next" @click="nextStep" :disabled="!mainPhotoId">Next Step</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReviewStore } from '@/stores/reviewStore'

const router = useRouter()
const route = useRoute()
const reviewStore = useReviewStore()

const tripTitle = reviewStore.tripTitle || route.query.title
const photos = ref([...reviewStore.photos])
const mainPhotoId = ref(reviewStore.mainPhotoId)

/* 순서 변경 */
const moveUp = (index) => {
  if (index > 0) {
    const temp = photos.value[index]
    photos.value[index] = photos.value[index - 1]
    photos.value[index - 1] = temp
  }
}
const moveDown = (index) => {
  if (index < photos.value.length - 1) {
    const temp = photos.value[index]
    photos.value[index] = photos.value[index + 1]
    photos.value[index + 1] = temp
  }
}

/* 삭제 */
const removePhoto = (id) => {
  photos.value = photos.value.filter((p) => p.id !== id)
  if (mainPhotoId.value === id) mainPhotoId.value = null
}

/* 대표사진 지정 */
const selectMain = (id) => {
  mainPhotoId.value = id
}

/* 네비게이션 */
const goBack = () => router.back()
const nextStep = () => {
  reviewStore.setPhotos(photos.value)
  reviewStore.setMainPhoto(mainPhotoId.value)
  reviewStore.nextStep()

  router.push({
    name: 'ReviewWriteStep3',
    params: { tripId: route.params.tripId },
    query: { title: tripTitle }
  })
}
</script>

<style scoped>
.review-container {
  background-color: #fff;
  border-radius: 1.25rem;
  padding: 2rem;
}
.review-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 0.75rem;
}
.back-icon {
  font-size: 1.6rem;
  color: #ff8c00;
  cursor: pointer;
  margin-right: 0.5rem;
}
.section-title {
  font-weight: 600;
  color: #1b3b6f;
  margin-bottom: 0.25rem;
}
.section-subtitle {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 1rem;
}
.photo-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
}
.photo-item.active {
  border-color: #ff8c00;
  box-shadow: 0 0 0 2px rgba(255, 140, 0, 0.1);
}
.photo-thumb {
  width: 64px;
  height: 64px;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-right: 1rem;
}
.photo-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo-info h6 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  color: #1b3b6f;
}
.photo-info p {
  font-size: 0.8rem;
  color: #6c757d;
  margin: 0;
}
.btn-back,
.btn-next {
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  transition: all 0.3s ease;
}
.btn-back {
  background-color: #fff;
  border: 2px solid #1b3b6f;
  color: #1b3b6f;
}
.btn-back:hover {
  background-color: #e9eef9;
}
.btn-next {
  background-color: #1b3b6f;
  color: #fff;
}
.btn-next:disabled {
  background-color: #b0bfd8;
}
.btn-next:hover:not(:disabled) {
  background-color: #ff8c00;
}
</style>
