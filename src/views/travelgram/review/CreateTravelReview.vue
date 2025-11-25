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
        <div v-for="day in currentTripInfo.itinerary" :key="day.dayNumber" class="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
          <!-- Day Header -->
          <div class="card-body d-flex justify-content-between align-items-center" :class="openDayId === day.dayNumber ? 'bg-secondary text-white' : 'bg-white'" role="button"
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
              <div v-for="(act, index) in day.activities" :key="index" class="list-group-item d-flex justify-content-between align-items-center activity-row bg-white">
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
      <div class="upload-box" @click="triggerFileInput">
        <i class="bi bi-cloud-arrow-up fs-2 text-secondary mb-2"></i>
        <p class="text-secondary mb-0">Click to upload photos</p>
        <small class="text-muted">JPG, PNG up to 10MB each</small>
        <input type="file" multiple accept="image/*" ref="fileInput" @change="handleFileUpload" hidden />
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
import { uploadReviewPhotos } from '@/api/travelgramApi'
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

// store에 여행 정보 저장
reviewStore.setTripInfo(tripId, tripTitle)

const fileInput = ref(null)
const uploadedImages = ref([])
const openDayId = ref(1) // 기본 1번 Day 오픈

const toggleDay = (id) => {
  openDayId.value = id
}
// 모든 여행 데이터
const allTripsData = ref({
  1: {
    location: 'Jeju Island',
    date: 'Oct 15 - Oct 18, 2024',
    cost: '500',
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival & Beach Exploration',
        date: 'Oct 15, 2024',
        isOpen: true,
        activities: [
          { time: '2:00 PM', name: 'Arrive at Jeju Airport' },
          { time: '3:30 PM', name: 'Hotel Check-in' },
          { time: '5:00 PM', name: 'Sunset at Hallim Park' },
          { time: '7:00 PM', name: 'Dinner at Local Restaurant' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Waterfall & Nature',
        date: 'Oct 16, 2024',
        isOpen: false,
        activities: [
          { time: '9:00 AM', name: 'Jeongbang Waterfall Visit' },
          { time: '11:30 AM', name: 'Lunch at Seafood Restaurant' },
          { time: '2:00 PM', name: 'Teddy Bear Museum' },
          { time: '6:00 PM', name: 'Evening Stroll at Harbor' }
        ]
      },
      {
        dayNumber: 3,
        title: 'Mountain & Cafe Tour',
        date: 'Oct 17, 2024',
        isOpen: false,
        activities: [
          { time: '8:00 AM', name: 'Hike Seongsan Ilchulbong' },
          { time: '11:00 AM', name: 'Traditional Haenyeo Show' },
          { time: '1:00 PM', name: 'Lunch Break' },
          { time: '3:00 PM', name: 'Jeju Coffee Museum' }
        ]
      },
      {
        dayNumber: 4,
        title: 'Departure',
        date: 'Oct 18, 2024',
        isOpen: false,
        activities: [
          { time: '10:00 AM', name: 'Hotel Check-out' },
          { time: '11:00 AM', name: 'Shopping at Lotte Mart' },
          { time: '1:00 PM', name: 'Lunch at Airport' },
          { time: '3:00 PM', name: 'Depart Jeju' }
        ]
      }
    ]
  },
  2: {
    location: 'Tokyo, Japan',
    date: 'Sep 20 - Sep 25, 2024',
    cost: '1200',
    itinerary: [
      {
        dayNumber: 1,
        title: 'Tokyo Arrival',
        date: 'Sep 20, 2024',
        isOpen: true,
        activities: [
          { time: '11:00 AM', name: 'Arrive at Narita Airport' },
          { time: '1:00 PM', name: 'Hotel Check-in' },
          { time: '3:00 PM', name: 'Shibuya Crossing Visit' },
          { time: '6:00 PM', name: 'Dinner at Izakaya' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Sushi & Traditional Food',
        date: 'Sep 21, 2024',
        isOpen: false,
        activities: [
          { time: '8:00 AM', name: 'Tsukiji Outer Market Tour' },
          { time: '11:00 AM', name: 'Sushi Making Class' },
          { time: '2:00 PM', name: 'Lunch at Famous Sushi Restaurant' },
          { time: '5:00 PM', name: 'Street Food Tour' }
        ]
      }
    ]
  },
  3: {
    location: 'Busan',
    date: 'Aug 10 - Aug 12, 2024',
    cost: '300',
    itinerary: [
      {
        dayNumber: 1,
        title: 'Coastal City Arrival',
        date: 'Aug 10, 2024',
        isOpen: true,
        activities: [
          { time: '2:00 PM', name: 'Arrive at Busan' },
          { time: '3:00 PM', name: 'Hotel Check-in' },
          { time: '5:00 PM', name: 'Gamcheon Culture Village' },
          { time: '7:00 PM', name: 'Sunset at Dadaepo Beach' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Beach & Markets',
        date: 'Aug 11, 2024',
        isOpen: false,
        activities: [
          { time: '9:00 AM', name: 'Haeundae Beach' },
          { time: '12:00 PM', name: 'Lunch at Seafood Market' },
          { time: '2:00 PM', name: 'Beomeosa Temple' },
          { time: '5:00 PM', name: 'Street Shopping' }
        ]
      }
    ]
  }
})

import { createReviewPhotoGroup } from '@/api/travelgramApi'


onMounted(async () => {
  const result = await createReviewPhotoGroup()
  reviewStore.groupId = result.groupId   // 이 값이 있어야 업로드 성공
})



const currentTripInfo = computed(() => {
  return allTripsData.value[tripId] || { location: '', date: '', cost: '', itinerary: [] }
})

const triggerFileInput = () => fileInput.value?.click()
// ------------------------------
// 1) 파일 선택 핸들러 (미리보기 + 업로드)
// ------------------------------
const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files);

  if (uploadedImages.value.length + files.length > 10) {
    alert('최대 10장까지만 업로드할 수 있습니다.');
    return;
  }

  // ✅ 기존에 올라와 있던 이미지 개수
  const baseOrderIndex = uploadedImages.value.length;

  files.forEach((file, index) => {
    const reader = new FileReader();
    const tempId = uuidv4();
    const orderIndex = baseOrderIndex + index; // ✅ 이 파일의 확정 orderIndex

    reader.onload = (e) => {
      uploadedImages.value.push({
        id: tempId,
        name: file.name,
        url: e.target.result,  // Base64
        file,
        uploading: true,
        orderIndex,       // ✅ 고정된 orderIndex 사용
      });
    };

    reader.readAsDataURL(file);
  });

  // 🚨 Unhandled error 방지 및 업로드 실패 처리
  try {
    // ✅ 모든 미리보기 push를 시작한 뒤, 실제 업로드
    const uploadedList = await uploadPhotos(files, reviewStore.groupId, baseOrderIndex);

    // 응답이 Array인지 확인하고 처리
    const finalUploadedList = uploadedList.data || [];

    finalUploadedList.forEach((uploaded) => {
      const idx = uploadedImages.value.findIndex(
        (img) => img.orderIndex === uploaded.orderIndex
      );

      if (idx !== -1) {
        uploadedImages.value[idx] = {
          ...uploadedImages.value[idx],
          id: uploaded.id,  // 백엔드에서 내려주는 필드명에 맞게
          url: uploaded.fileUrl,  // S3 URL
          file: null,
          uploading: false,
        };
      }
    });

  } catch (error) {
    console.error('File upload failed:', error.response?.status, error.message);
    alert('사진 업로드에 실패했습니다. 서버 설정을 확인해주세요.');

    // 업로드 실패 시, 미리보기로 추가했던 항목들 제거
    uploadedImages.value = uploadedImages.value.filter(
      (img) => img.uploading === false || img.orderIndex < baseOrderIndex
    );
  }
};
// ------------------------------
// 2) 백엔드 업로드 함수 (단일/멀티 모두 지원)
// ------------------------------
const uploadPhotos = async (files, groupId, startOrderIndex = 0) => {
  const formData = new FormData();
  const fileArray = Array.isArray(files) ? files : [files];
  const metadataList = []; // 💡 메타데이터 리스트를 저장할 배열

  fileArray.forEach((file, idx) => {
    const json = {
      groupId: reviewStore.groupId,
      fileName: file.name,
      orderIndex: startOrderIndex + idx
    };

    // 💡 1. 메타데이터 객체를 리스트에 추가합니다.
    metadataList.push(json);

    // 2. 파일 자체는 여전히 'files' 키로 개별 append 합니다.
    formData.append("files", file);
  });

  // 💡 3. 모든 메타데이터를 배열로 묶어 단 하나의 JSON 문자열로 변환하여 append 합니다.
  formData.append("dataListJson", JSON.stringify(metadataList));


  // 디버깅용
  for (let pair of formData.entries()) {
    console.log("FD:", pair[0], pair[1]);
  }
  console.log(">>> REQUEST HEADERS:", formData);

  return uploadReviewPhotos(formData);
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
