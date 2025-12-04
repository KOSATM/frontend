<template>
  <div class="photo-upload-page">
    <PageHeader title="Travelgram" subtitle="Your past travel adventures" icon="bi-instagram" />
    <!-- 🔸 상단 헤더 -->
    <StepHeader title="Create Travel Review" :subtitle="reviewStore.tripTitle" step="1/6" @back="goBack" />

    <!-- 여행 정보 카드 -->
    <div class="trip-info-card">
      <div class="trip-info-header">
        <h5>{{ tripTitle }}</h5>
      </div>
      <div class="trip-info-body">
        <div class="info-row">
          <span class="info-label">Location</span>
          <span class="info-value">{{ currentTripInfo.location }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date</span>
          <span class="info-value">{{ currentTripInfo.date }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Budget</span>
          <span class="info-value">${{ currentTripInfo.cost }}</span>
        </div>
      </div>
    </div>

    <!-- 일정 정보 섹션 -->

    <div class="itinerary-section">
      <h6 class="itinerary-title mb-3">
        <i class="bi bi-calendar-event me-2 text-secondary"></i>Daily Itinerary
      </h6>

      <div class="planner-accordion">
        <div v-for="day in currentTripInfo.itinerary" :key="day.dayNumber"
          class="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
          <!-- Day Header -->
          <div class="card-body d-flex justify-content-between align-items-center"
            :class="openDayId === day.dayNumber ? 'bg-secondary text-white' : 'bg-white'" role="button"
            @click="toggleDay(day.dayNumber)">
            <div>
              <div class="small fw-semibold" :class="openDayId !== day.dayNumber ? 'text-secondary' : ''">
                Day {{ day.dayNumber }}
              </div>
              <h6 class="mb-0 title">{{ day.title }}</h6>
              <div class="small" :class="openDayId !== day.dayNumber ? 'text-muted' : 'text-white-50'">
                {{ day.date }}
              </div>
            </div>

            <div class="text-end">
              <div class="small" :class="openDayId === day.dayNumber ? 'text-white-50' : ''">
                Activities
              </div>
              <div class="fw-bold title">{{ day.activities.length }}</div>
              <div class="small">
                <span class="chevron" :class="{ 'rotate-180': openDayId === day.dayNumber }">⌃</span>
              </div>
            </div>
          </div>

          <!-- ▶ Activities collapse area -->
          <transition name="collapse">
            <div v-if="openDayId === day.dayNumber" class="list-group list-group-flush">
              <div v-for="(act, index) in day.activities" :key="index"
                class="list-group-item d-flex justify-content-between align-items-center activity-row bg-white">
                <div class="d-flex align-items-start gap-3">
                  <div class="icon-badge themed theme-default">⏰</div>
                  <div>
                    <div class="fw-semibold small title">{{ act.name }}</div>

                    <div class="d-flex align-items-center gap-2 small text-muted sub">
                      <span class="soft-chip">
                        <span class="chip-emoji">🕒</span> {{ act.time }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>



    <h6 class="upload-title mb-1">
      <i class="bi bi-image me-1 text-secondary"></i> Upload Photos
    </h6>
    <p class="upload-subtitle">
      Upload up to 10 photos from your trip ({{ uploadedImages.length }}/10)
    </p>
    <section class="upload-section">

      <!-- 🖼️ 업로드 박스 -->
      <div v-if="isReady" class="upload-box" @click="triggerFileInput">
        <i class="bi bi-cloud-arrow-up fs-2 text-secondary mb-2"></i>
        <p class="text-secondary mb-0">Click to upload photos</p>
        <small class="text-muted">JPG, PNG up to 10MB each</small>
        <input type="file" multiple accept="image/*" ref="fileInput" @change="handleFileUpload" hidden />
      </div>

      <div v-if="uploadedImages.length" class="preview-grid mt-3">
        <div v-for="(img, idx) in uploadedImages" :key="idx" class="preview-item">
          <img :src="img.url" :alt="img.name" :class="{ 'opacity-50': img.uploading }" />

          <div v-if="img.uploading" class="upload-spinner">
            <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
          </div>
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
import api from '@/api/travelgramApi'
import PageHeader from '@/components/common/PageHeader.vue'
import StepHeader from '@/components/common/StepHeader.vue'
import { useReviewStore } from '@/store/reviewStore'
import { v4 as uuidv4 } from 'uuid'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const reviewStore = useReviewStore()

const tripId = route.params.tripId
const tripTitle = route.query.title || 'My Trip'

const fileInput = ref(null)
const uploadedImages = ref([])
const openDayId = ref(1) // 기본 1번 Day 오픈

const toggleDay = (id) => {
  openDayId.value = id
}
// 모든 여행 데이터
const allTripsData = ref({})
// 🔥 업로드 UI를 보여줄 준비되었는지 여부
const isReady = ref(false);
// import { createReviewPhotoGroup } from '@/api/travelgramApi'
onMounted(async () => {
  // 1) trip 정보 저장
  reviewStore.setTripInfo(route.params.tripId, route.query.title)

  // 2) 리뷰 생성 - planId를 명시적인 객체 형태로 전달 (백엔드 요청 본문에 맞게)

  const res = await api.createReview(reviewStore.tripId); // 👈 수정된 부분
  console.log("📌 Review created:", res.data);

  // 3) store에 저장
  reviewStore.setReviewInfo(res.data.reviewPostId, res.data.photoGroupId, res.data.hashtagGroupId);
  // 4) 업로드 화면 활성화
  isReady.value = true;
});



const currentTripInfo = computed(() => {
  return allTripsData.value[tripId] || { location: '', date: '', cost: '', itinerary: [] }
})

const triggerFileInput = () => fileInput.value?.click()
// ------------------------------
// 1) 파일 선택 핸들러 (즉시 미리보기 + 동시 업로드)
// ------------------------------
const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files);

  if (uploadedImages.value.length + files.length > 10) {
    alert('최대 10장까지만 업로드할 수 있습니다.');
    return;
  }

  const baseOrderIndex = uploadedImages.value.length;

  // ✅ [STEP 1] 즉시 미리보기 생성 (FileReader 제거)
  // URL.createObjectURL은 파일을 읽을 필요 없이 브라우저 메모리 주소만 따오므로 즉시 실행됩니다.
  const newPreviewImages = files.map((file, index) => ({
    id: uuidv4(),      // 임시 ID
    name: file.name,
    url: URL.createObjectURL(file), // ⭐ 핵심: 즉시 미리보기 URL 생성
    file: file,
    uploading: true,   // 로딩 상태 표시용
    orderIndex: baseOrderIndex + index,
  }));

  // 화면에 바로 반영 (사용자는 이미지가 바로 뜬 것처럼 느낌)
  uploadedImages.value = [...uploadedImages.value, ...newPreviewImages];

  // ✅ [STEP 2] 백그라운드에서 업로드 수행
  try {
    const uploadedList = await uploadPhotos(files, reviewStore.photoGroupId, baseOrderIndex);
    const finalUploadedList = uploadedList.data || [];

    // ✅ [STEP 3] 업로드가 완료되면 S3 URL로 교체해주기
    finalUploadedList.forEach((uploaded) => {
      const targetImg = uploadedImages.value.find(
        (img) => img.orderIndex === uploaded.orderIndex
      );

      if (targetImg) {
        // 기존 blob: URL 메모리 해제 (메모리 누수 방지)
        URL.revokeObjectURL(targetImg.url);

        // 서버에서 받은 진짜 URL과 ID로 교체
        targetImg.url = uploaded.fileUrl;
        targetImg.id = uploaded.id;
        targetImg.uploading = false; // 로딩 완료
        targetImg.file = null;       // 원본 파일 객체는 이제 필요 없음
      }
    });

    console.log("업로드 완료 및 URL 교체 성공");

  } catch (error) {
    console.error('File upload failed:', error);
    alert('사진 업로드에 실패했습니다.');

    // 실패 시, 방금 추가했던 가짜 이미지들 삭제
    uploadedImages.value = uploadedImages.value.filter(
      (img) => img.orderIndex < baseOrderIndex
    );
  } finally {
    // input 초기화 (같은 파일 다시 선택 가능하게)
    if (fileInput.value) fileInput.value.value = '';
  }
};
// ============================================================
// 2) 백엔드 업로드 함수 (여기가 '다이어트' 된 핵심 부분)
// ============================================================
const uploadPhotos = async (files, photoGroupId, startOrderIndex = 0) => {
  const formData = new FormData();
  
  formData.append("photoGroupId", photoGroupId);
  formData.append("startOrderIndex", startOrderIndex);

  const fileArray = Array.isArray(files) ? files : [files];
  fileArray.forEach((file) => {
    formData.append("files", file); 
  });

  return api.uploadReviewPhotos(formData);
};





// Step 2로 이동
const nextStep = () => {
  reviewStore.setPhotos(uploadedImages.value)
  reviewStore.nextStep()
  router.push({
    name: 'PhotoOrder',
    params: { tripId },
    query: { title: tripTitle },
  })
}

const goBack = () => router.back()
</script>

<style scoped>
/* PlannerList.vue style */
.chevron {
  transition: transform 0.2s;
  display: inline-block;
}

.rotate-180 {
  transform: rotate(180deg);
}

.list-group-item.activity-row {
  transition: background-color 0.18s ease, box-shadow 0.18s ease,
    transform 0.12s ease;
}

.soft-chip {
  padding: 2px 8px;
  border-radius: 10px;
  background: #f8f9fa;
  border: 1px solid #f1f3f5;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}



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

/* 여행 정보 카드 */
.trip-info-card {
  background-color: #fff;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.trip-info-header h5 {
  color: #ffffff !important;
}

.trip-info-header {
  background-color: #1B3B6F;
  color: #ffffff;
  padding: 1rem 1.5rem;
}

.trip-info-header h5 {
  margin: 0;
  font-weight: 600;

}

.trip-info-body {
  padding: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #1B3B6F;
}

.info-value {
  color: #666;
}

/* Accordion 일정 섹션 */


.itinerary-section {
  background-color: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.itinerary-title {
  font-weight: 600;
  color: #1B3B6F;
}

.itinerary-accordion {
  background-color: #f5f5f5;
  border-radius: 0.75rem;
  padding: 1rem;
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
  font-size: 1rem;
  /* ✅ 글씨 키움 */
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
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.upload-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.opacity-50 {
  opacity: 0.5;
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
