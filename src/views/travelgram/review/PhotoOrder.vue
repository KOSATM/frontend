<template>
  <div class="photo-order-page">
    <PageHeader
        title="트래벌그램"
        subtitle="당신의 지난 여행 기록들"
        icon="bi-instagram"
      />
    <!-- 🔸 상단 헤더 -->
    <StepHeader
      title="여행 후기 작성"
      :subtitle="reviewStore.planTitle"
      step="2/6"
      @back="goBack"
    />
  <section class="photo-order-wrapper">
    <div class="photo-order-container">

      <TipBox
      name="대표 사진 안내"
      description="대표 사진은 삭제되거나 순서를 바꿀 수 없습니다.
      기존 대표 사진이 아닌 사진 항목을 선택해 대표 사진으로 만들 수 있습니다.
      대표 사진은 항상 맨 위로 고정됩니다.
      다른 사진들은 자유롭게 삭제하거나 순서를 바꿀 수 있습니다."
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

<NavigationButtons
      backText="Back"
      :isNextDisabled="!canProceed"
      @back="goBack"
      @next="goNext"
    >
      <template #next-content>
        <span v-if="isLoading">
          <span class="spinner-border spinner-border-sm me-2"></span>
          AI가 열심히 분석 중 입니다...
        </span>
        <span v-else>Next Step</span>
      </template>
    </NavigationButtons>

    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <h5>사진 요약을 모아서 분석 중 입니다.</h5>
        <p>여행의 분위기를 감지하고 있습니다...</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import api from '@/api/travelgramApi'
import StepHeader from '@/components/common/header/StepHeader.vue'
import PageHeader from '@/components/common/header/PageHeader.vue'
import TipBox from '@/components/common/TipBox.vue'
import NavigationButtons from '@/components/common/button/NavigationButtons.vue';

const router = useRouter()
const route = useRoute()
const reviewStore = useReviewStore()

const planId = reviewStore.planId;
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

const isLoading = ref(false) // 🔥 로딩 상태 추가
const canProceed = computed(() => {
  // 1) 사진이 1장 이상 있어야 함
  // 2) 대표 사진이 선택되어 있어야 함
  // 3) 현재 로딩 중(분석 중)이 아니어야 함 (중복 클릭 방지)
  return photos.value.length > 0 && !!mainPhotoId.value && !isLoading.value
})
const goNext = async () => {
  if (!mainPhotoId.value) return
  
  // 로딩 시작
  isLoading.value = true

  try {
    // 1) Store 업데이트 (로컬 상태 저장)
    reviewStore.setPhotos(photos.value)
    reviewStore.setMainPhoto(mainPhotoId.value)

    // 2) 순서 업데이트용 Payload 생성
    const orderPayload = {
      photoGroupId: reviewStore.photoGroupId,
      photos: photos.value.map((p, i) => ({
        photoId: p.id,
        orderIndex: i
      }))
    }

    // 3) 🔥 [순서 저장]과 [사진 분석]을 병렬로 처리 (시간 단축)
    // 순서 저장이 분석에 영향을 미친다면 await api.updatePhotoOrder(...)를 먼저 하세요.
    // 여기서는 순서 저장 후 -> 분석 요청 순서로 작성합니다.
    
    await api.updatePhotoOrder(orderPayload) // 순서 저장

    // 3. 🔥 [분석 요청] 그냥 호출만 하고 결과값은 안 받음 (await는 해야 함)
    // await를 안 하면 분석이 끝나기 전에 다음 페이지가 로딩되어, 
    // 다음 페이지에서 DB를 조회할 때 데이터가 아직 없을 수도 있습니다.
    await api.analyzePhotoMood(reviewStore.photoGroupId)
    
    
    // 6) 다음 스텝 이동
    reviewStore.nextStep()
    router.push({
      name: 'CaptionSelect',
      params: { planId: planId },
      query: { title: planTitle }
    })

  } catch (error) {
    console.error("Failed to process photos:", error)
    alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
  } finally {
    // 로딩 종료
    isLoading.value = false
  }
}

const goBack = () => router.back()
</script>

<style scoped>
/* 🔥 로딩 오버레이 스타일 (화면 중앙에 띄우기) */
.loading-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(255, 255, 255, 0.85);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}
.loading-content {
  text-align: center;
  color: #1b3b6f;
}
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

</style>
