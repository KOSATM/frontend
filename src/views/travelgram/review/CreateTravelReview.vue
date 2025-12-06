<template>
  <div class="photo-upload-page">
    <PageHeader title="Travelgram" subtitle="Your past travel adventures" icon="bi-instagram" />
    <!-- 🔸 상단 헤더 -->
    <StepHeader title="Create Travel Review" :subtitle="reviewStore.planTitle" step="1/6" @back="goBack" />

    <!-- 여행 정보 카드 -->
    <div class="plan-info-card" v-if="currentplanInfo">
      <div class="plan-info-header">
        <h5>{{ planTitle }}</h5>
      </div>
      <div class="plan-info-body">
        <div class="info-row">
          <span class="info-label">Location</span>
          <span class="info-value">{{ currentplanInfo.location }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date</span>
          <span class="info-value">{{ currentplanInfo.date }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Budget</span>
          <span class="info-value">${{ currentplanInfo.cost }}</span>
        </div>
      </div>
    </div>

    

    <!-- 일정 정보 섹션 -->

    <div class="itinerary-section" v-if="currentplanInfo && currentplanInfo.itinerary">
      <h6 class="itinerary-title mb-3">
        <i class="bi bi-calendar-event me-2 text-secondary"></i>Daily Itinerary
      </h6>

      <div class="planner-accordion">
        <div v-for="day in currentplanInfo.itinerary" :key="day.dayNumber"
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
      Upload up to 10 photos from your plan ({{ uploadedImages.length }}/10)
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

<div v-if="isAnalyzing" class="alert alert-info mt-3 d-flex align-items-center">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      <div>
        <strong>AI Analyzing Photos...</strong>
        <span class="small ms-1">Please wait for the summary generation to complete.</span>
      </div>
    </div>
  <!-- 🟦 하단 버튼 -->
  <div class="navigation-buttons">
      <button 
        class="btn-next" 
        :disabled="!canProceed" 
        @click="nextStep"
      >
        <span v-if="isAnalyzing">Analyzing...</span>
        <span v-else>Next Step</span>
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
import { computed, onMounted,onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const reviewStore = useReviewStore()

const planId = route.params.planId
const planTitle = route.query.title || 'My plan'

const fileInput = ref(null)
const uploadedImages = ref([])
const openDayId = ref(1) // 기본 1번 Day 오픈

const isAnalyzing = ref(false) // 분석 진행 중 여부
const pollingInterval = ref(null) // 타이머 저장 변수

const currentplanInfo = ref(null)
const toggleDay = (id) => {
  openDayId.value = openDayId.value === id ? null : id // 토글 기능
}
// 🔹 [추가] 상세 일정 가져오는 함수
const fetchPlanDetail = async () => {
  try {
    // 백엔드 API 호출 (GET /plans/{planId}/detail)
    const res = await api.getPlanDetail(planId)
    const data = res.data

    // 📍 [수정] Location 추출 로직
    // plan 객체에 location이 없으므로, 첫 번째 날짜의 첫 번째 장소 주소를 사용
    let derivedLocation = 'Seoul, Korea' // 기본값

    // 데이터가 있고, 첫째날에 장소가 하나라도 있다면
    if (data.days && data.days.length > 0) {
      const firstDay = data.days[0]
      if (firstDay.places && firstDay.places.length > 0) {
        const rawAddress = firstDay.places[0].address || ''
        // 주소 앞부분 2단어만 추출 (예: "서울특별시 송파구 올림픽로..." -> "서울특별시 송파구")
        const addressParts = rawAddress.split(' ')
        if (addressParts.length >= 2) {
          derivedLocation = `${addressParts[0]} ${addressParts[1]}`
        } else if (addressParts.length === 1) {
          derivedLocation = addressParts[0]
        }
      }
    }

    currentplanInfo.value = {
      location: derivedLocation, // 👈 추출한 지역 사용
      date: `${data.plan.startDate} ~ ${data.plan.endDate}`,
      cost: Number(data.plan.budget).toLocaleString(),
      
      // itinerary 매핑 로직 (기존 유지)
      itinerary: data.days.map(d => ({
        dayNumber: d.day.dayIndex,
        title: d.day.title,
        date: d.day.planDate,
        activities: d.places.map(p => ({
          name: p.placeName || p.title,
          // startAt이 ISO string("2025-12-13T01:00:00Z")으로 오므로 시간만 추출
          time: p.startAt ? p.startAt.substring(11, 16) : 'Anytime', 
          address: p.address
        }))
      }))
    }
  } catch (error) {
    console.error("상세 일정을 불러오는데 실패했습니다:", error)
    currentplanInfo.value = { location: '-', date: '-', cost: '0', itinerary: [] }
  }
}
// 🔥 업로드 UI를 보여줄 준비되었는지 여부
const isReady = ref(false);
// import { createReviewPhotoGroup } from '@/api/travelgramApi'
onMounted(async () => {

  // 1) Store에 정보 저장
  reviewStore.setplanInfo(planId, planTitle)

  // 2) 상세 일정 데이터 로드 (비동기)
  await fetchPlanDetail()

  // 3) 리뷰 생성 API 호출
  try {
    const res = await api.createReview(planId) 
    console.log("📌 Review created:", res.data)
    reviewStore.setReviewInfo(res.data.reviewPostId, res.data.photoGroupId, res.data.hashtagGroupId)
    isReady.value = true
  } catch (error) {
    console.error("리뷰 생성 실패:", error)
    alert("리뷰 생성 초기화에 실패했습니다.")
  }

});

// ------------------------------------------------------------
// [수정] 분석 상태 확인 (Polling) 함수 - 로직 개선
// ------------------------------------------------------------
const checkAnalysisStatus = async () => {
  if (!reviewStore.photoGroupId) return;

  try {
    // 1. 백엔드 조회
    const res = await api.getReviewPhotos(reviewStore.photoGroupId);
    const serverPhotos = res.data.data || [];

    // 로그로 데이터 확인 (디버깅용)
    console.log("📸 Server Photos:", serverPhotos);

    // 2. 내 로컬 이미지 상태 업데이트
    // (서버 데이터를 기준으로 매칭되는 로컬 이미지에 '분석완료' 딱지를 붙여줍니다)
    uploadedImages.value.forEach(localImg => {
      // 업로드 중인건 패스
      if (localImg.uploading) return;

      // ID 비교 (문자열로 변환하여 안전하게 비교)
      const match = serverPhotos.find(s => String(s.id) === String(localImg.id));

      if (match && match.summary) {
        localImg.isAnalyzed = true;
        localImg.summary = match.summary; // 데이터 동기화
      }
    });

    // 3. 종료 조건 확인
    // "업로드 중인게 하나도 없고" && "모든 이미지가 분석 완료(isAnalyzed) 상태"여야 함
    const isAllUploaded = uploadedImages.value.every(img => !img.uploading);
    const isAllAnalyzed = uploadedImages.value.every(img => img.isAnalyzed);

    if (uploadedImages.value.length > 0 && isAllUploaded && isAllAnalyzed) {
      console.log('✅ 모든 사진 분석 완료!');
      stopPolling();
      isAnalyzing.value = false;
    } else {
      // 아직 덜 됐으면 계속 진행
      isAnalyzing.value = true;
    }

  } catch (err) {
    console.error('Polling failed', err);
  }
};

const startPolling = () => {
  if (pollingInterval.value) return
  isAnalyzing.value = true
  console.log('⏳ AI 분석 상태 확인 시작...')
  pollingInterval.value = setInterval(checkAnalysisStatus, 3000) // 3초마다 확인
}

const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

// 컴포넌트가 꺼질 때 폴링 중지 (메모리 누수 방지)
onUnmounted(() => {
  stopPolling()
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
      startPolling()
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

const canProceed = computed(() => {
  return uploadedImages.value.length > 0 
      && !uploadedImages.value.some(img => img.uploading)
      && !isAnalyzing.value
})
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
    params: { planId },
    query: { title: planTitle },
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
.plan-info-card {
  background-color: #fff;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.plan-info-header h5 {
  color: #ffffff !important;
}

.plan-info-header {
  background-color: #1B3B6F;
  color: #ffffff;
  padding: 1rem 1.5rem;
}

.plan-info-header h5 {
  margin: 0;
  font-weight: 600;

}

.plan-info-body {
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
