<template>
  <div class="photo-order-page">
    <!-- 🔸 상단 헤더 -->
    <ReviewHeader
      title="Create Travel Review"
      :subtitle="reviewStore.tripTitle"
      step="2/6"
      @back="goBack"
    />
    <!-- 🔸 본문 컨테이너 -->
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
            <img :src="photo.url" :alt="'Photo ' + (index + 1)" />
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

      <!-- 🔹 하단 버튼 -->
      <div class="navigation-buttons">
        <button class="btn-back" @click="goBack">Back</button>
        <button class="btn-next" @click="nextStep" :disabled="!mainPhotoId">Next Step</button>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import ReviewHeader from '@/components/common/DetailHeader.vue'

const router = useRouter()
const route = useRoute()
const reviewStore = useReviewStore()

const tripTitle = reviewStore.tripTitle || route.query.title
const photos = ref([...reviewStore.photos])
const mainPhotoId = ref(reviewStore.mainPhotoId)

/* 순서 변경 - 메인포토는 고정 */
const moveUp = (index) => {
  // ✅ 메인포토는 이동 불가
  if (photos.value[index].id === mainPhotoId.value) {
    alert('Main photo cannot be moved')
    return
  }
  // 위로 이동하려는 항목이 메인포토 바로 아래면 스킵
  if (index > 0 && photos.value[index - 1].id === mainPhotoId.value) {
    alert('Main photo must stay at the first position')
    return
  }
  
  if (index > 0) {
    const temp = photos.value[index]
    photos.value[index] = photos.value[index - 1]
    photos.value[index - 1] = temp
  }
}

const moveDown = (index) => {
  // ✅ 메인포토는 이동 불가
  if (photos.value[index].id === mainPhotoId.value) {
    alert('Main photo cannot be moved')
    return
  }
  
  if (index < photos.value.length - 1) {
    const temp = photos.value[index]
    photos.value[index] = photos.value[index + 1]
    photos.value[index + 1] = temp
  }
}

/* 삭제 */
const removePhoto = (id) => {
  // ✅ 메인포토는 삭제 불가
  if (id === mainPhotoId.value) {
    alert('Cannot delete main photo. Select another main photo first.')
    return
  }
  photos.value = photos.value.filter((p) => p.id !== id)
}

/* ✅ 대표사진 지정 - 선택 시 맨 앞으로 이동 */
const selectMain = (id) => {
  // 이미 메인포토가 지정되었으면 그 사진을 원래 위치로 되돌림
  if (mainPhotoId.value && mainPhotoId.value !== id) {
    const oldMainIndex = photos.value.findIndex(p => p.id === mainPhotoId.value)
    if (oldMainIndex !== -1) {
      photos.value[oldMainIndex].isMain = false
    }
  }

  // 새 메인포토를 맨 앞으로 이동
  const newMainIndex = photos.value.findIndex(p => p.id === id)
  if (newMainIndex > 0) {
    const mainPhoto = photos.value.splice(newMainIndex, 1)[0]
    mainPhoto.isMain = true
    photos.value.unshift(mainPhoto)
  } else if (newMainIndex === 0) {
    photos.value[0].isMain = true
  }

  mainPhotoId.value = id
}

/* 네비게이션 */
const goBack = () => router.back()

const nextStep = () => {
  if (!mainPhotoId.value) {
    alert('대표사진을 선택해주세요!')
    return
  }
  reviewStore.setPhotos(photos.value)
  reviewStore.setMainPhoto(mainPhotoId.value)
  reviewStore.nextStep()
  router.push({
    name: 'ReviewCaptionSelect',
    params: { tripId: route.params.tripId },
    query: { title: tripTitle }
  })
}
</script>

<style scoped>
/* ✅ 페이지 전체 배경 */
.photo-order-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding-bottom: 6rem;
  padding: 2rem 1.25rem 6rem; /* 👈 상단 padding 2rem으로 통일 */
  
}




/* ✅ 라이트 컨테이너 */
.photo-order-container {
  background-color: #fff;
  border-radius: 1.25rem;
  padding: 2rem 1.5rem;
  margin: 1.5rem 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* 제목 */
.section-title {
  font-weight: 600;
  color: #1b3b6f;
  margin-bottom: 0.25rem;
}
.section-subtitle {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

/* 사진 아이템 */
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

/* 버튼 영역 */
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
.btn-next:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
