<template>
  <div class="photo-order-page">
    <PageHeader
        title="Travelgram"
        subtitle="Your past travel adventures"
        icon="bi-instagram"
      />
    <!-- 🔸 상단 헤더 -->
    <StepHeader
      title="Create Travel Review"
      :subtitle="reviewStore.planTitle"
      step="2/6"
      @back="goBack"
    />
  <section class="photo-order-wrapper">
    <div class="photo-order-container">

      <TipBox
      name="Main Photo Guide"
      description="The main photo cannot be deleted or rearranged.
      Tap any photo to set it as the main photo — it will always be fixed at the top of the list.
      All other photos can be freely deleted or reordered."
  />
  <transition-group
  name="photo-move"
      tag="div"
      class="photo-order-container"
    >
    <div
    v-for="(photo, index) in photos"
        :key="photo.id"
        class="photo-item"
        :class="{ active: photo.id === mainPhotoId }"
        @click="selectMain(photo.id)"
        >
        <div class="photo-thumb">
          <img :src="photo.url" :alt="photo.name" />
        </div>
        
        <div class="photo-info flex-grow-1">
          <h6 class="photo-name">{{ photo.name?.replace(/\.[^/.]+$/, '') }}</h6>
          <p>Jeju Island</p>
        </div>

        <div class="photo-actions d-flex align-items-center" @click.stop>
          <button class="btn btn-sm btn-outline-secondary me-1" @click="moveUp(index)">
            <i class="bi bi-arrow-up"></i>
          </button>
          <button class="btn btn-sm btn-outline-secondary me-1" @click="moveDown(index)">
            <i class="bi bi-arrow-down"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger me-1" @click="removePhoto(photo.id)">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
    </transition-group>
    <!-- 🔥 여기! navigation-buttons는 컨테이너 안의 최하단에 있어야 한다 -->
  </div>
</section>

<div class="navigation-buttons">
  <button class="btn-back" @click="goBack">Back</button>
  <button class="btn-next" @click="nextStep" :disabled="!mainPhotoId">Next Step</button>
</div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import { updatePhotoOrder } from '@/api/travelgramApi'
import StepHeader from '@/components/common/StepHeader.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import TipBox from '@/components/common/TipBox.vue'

const router = useRouter()
const route = useRoute()
const reviewStore = useReviewStore()

const planTitle = reviewStore.planTitle || route.query.title

/* 🔥 대표사진/사진들 */
const photos = ref([...reviewStore.photos])
const mainPhotoId = ref(reviewStore.mainPhotoId)

/* -----------------------------------
   🔥 1) 첫 번째 사진을 기본 대표사진으로 자동 설정
----------------------------------- */
onMounted(() => {
  if (!mainPhotoId.value && photos.value.length > 0) {
    mainPhotoId.value = photos.value[0].id
    photos.value[0].isMain = true
  }
})
const syncMainPhoto = () => {
  if (photos.value.length > 0) {
    mainPhotoId.value = photos.value[0].id
  }
}
/* -----------------------------------
   🔥 2) 카드 전체 클릭 → 대표사진 지정
   🔥 대표사진은 항상 맨 위로 이동
----------------------------------- */
const selectMain = (id) => {
  const index = photos.value.findIndex(p => p.id === id)
  if (index <= 0) return

  const selected = photos.value.splice(index, 1)[0]
  photos.value.unshift(selected)

  syncMainPhoto()
}


/* -----------------------------------
   🔥 3) 대표 사진 제외한 항목만 순서 이동 가능
----------------------------------- */
const moveUp = (idx) => {
  if (idx === 0) return

  const temp = photos.value[idx]
  photos.value[idx] = photos.value[idx - 1]
  photos.value[idx - 1] = temp

  syncMainPhoto()
}


const moveDown = (idx) => {
  if (idx === 0) return
  if (idx >= photos.value.length - 1) return

  const temp = photos.value[idx]
  photos.value[idx] = photos.value[idx + 1]
  photos.value[idx + 1] = temp

  syncMainPhoto()
}

/* -----------------------------------
   🔥 4) 대표사진은 삭제 금지
----------------------------------- */
const removePhoto = (id) => {
  if (id === mainPhotoId.value) return

  photos.value = photos.value.filter(p => p.id !== id)

  syncMainPhoto()
}


/* -----------------------------------
   🔥 5) 다음 단계
----------------------------------- */

const nextStep = async () => {
  if (!mainPhotoId.value) return

  // 1) Store 업데이트
  reviewStore.setPhotos(photos.value)
  reviewStore.setMainPhoto(mainPhotoId.value)

  // 2) 백엔드에 보낼 orderIndex payload 만들기
  const payload = {
    photoGroupId: reviewStore.photoGroupId,
    photos: photos.value.map((p, i) => ({
      photoId: p.id,
      orderIndex: i
    }))
  }

  // 3) 🔥 사진 순서 업데이트 API 호출
  await updatePhotoOrder(payload)

  // 4) 다음 스텝 이동
  reviewStore.nextStep()
  router.push({
    name: 'CaptionSelect',
    params: { planId: route.params.planId },
    query: { title: planTitle }
  })
}

const goBack = () => router.back()
</script>

<style scoped>
/* ✅ 페이지 전체 배경 */
.photo-order-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding-bottom: 6rem;
  padding: 2rem 1.25rem 6rem; /* 👈 상단 padding 2rem으로 통일 */
  
}
.photo-move-move {
  transition: transform 0.25s ease;
}

.photo-move-enter-active,
.photo-move-leave-active {
  transition: all 0.25s ease;
}

.photo-move-enter-from,
.photo-move-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.tip-box {
  border-left: 4px solid #ff914d;
  background: #fffaf3;   /* soft orange 톤으로 약하게 강조 */
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

.photo-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid #e6e6e6;
  transition: 0.25s ease;
  cursor: pointer;
  margin-bottom: 0.75rem;   /* 🔥 여백 추가 */
  &:hover {
    background: #fff7f0;
  }

  &.active {
    border: 2px solid #ff914d;
    background: #fff3e6;

    .photo-info h6 {
      color: #ff7a2a;
      font-weight: 700;
    }
  }
}

.photo-thumb img {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  object-fit: cover;
}




/* 버튼 영역 */
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
