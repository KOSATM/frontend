<template>
  <div class="photo-upload-page">
    <!-- 🔸 상단 헤더 -->
    <ReviewHeader
      title="Create Travel Review"
      :subtitle="reviewStore.tripTitle"
      step="1/6"
      @back="goBack"
    />

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

    <!-- Accordion 일정 섹션 -->
    <div class="itinerary-section">
      <h6 class="itinerary-title mb-3">
        <i class="bi bi-calendar-event me-2 text-primary"></i>Daily Itinerary
      </h6>
      <div class="itinerary-accordion">
        <div v-for="(day, idx) in currentTripInfo.itinerary" :key="idx" class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              :class="{ collapsed: !day.isOpen }"
              type="button"
              @click="day.isOpen = !day.isOpen"
              :aria-expanded="day.isOpen"
            >
              <span class="day-label">Day {{ day.dayNumber }}</span>
              <span class="day-title">{{ day.title }}</span>
              <span class="day-date">{{ day.date }}</span>
            </button>
          </h2>
          <div
            class="accordion-collapse"
            :class="{ show: day.isOpen }"
          >
            <div class="accordion-body">
              <ul class="activities-list">
                <li v-for="(activity, aIdx) in day.activities" :key="aIdx" class="activity-item">
                  <div class="activity-time">{{ activity.time }}</div>
                  <div class="activity-name">{{ activity.name }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

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
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import { v4 as uuidv4 } from 'uuid'
import ReviewHeader from '@/components/common/StepHeader.vue'

const router = useRouter()
const route = useRoute()
const reviewStore = useReviewStore()

const tripId = route.params.tripId
const tripTitle = route.query.title || 'My Trip'

// store에 여행 정보 저장
reviewStore.setTripInfo(tripId, tripTitle)

const fileInput = ref(null)
const uploadedImages = ref([])

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

const currentTripInfo = computed(() => {
  return allTripsData.value[tripId] || { location: '', date: '', cost: '', itinerary: [] }
})

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

/* 여행 정보 카드 */
.trip-info-card {
  background-color: #fff;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.trip-info-header {
  background-color: #ff8c00;
  color: #fff;
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
.accordion-item {
  background-color: #ececec;
  border: none;
  margin-bottom: 0.75rem;
  border-radius: 0.5rem;
  overflow: hidden;
}
.accordion-header {
  margin: 0;
}
.accordion-button {
  background-color: #d9d9d9;
  color: #333;
  font-weight: 500;
  padding: 1rem;
  border: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: background-color 0.3s ease;
  width: 100%;
  cursor: pointer;
}
.accordion-button:not(.collapsed) {
  background-color: #c0c0c0;
  color: #1B3B6F;
  box-shadow: none;
}
.accordion-button:hover {
  background-color: #c0c0c0;
}
.accordion-button:focus {
  outline: none;
  box-shadow: none;
}
.day-label {
  font-weight: 600;
  min-width: 60px;
  color: #1B3B6F;
}
.day-title {
  flex: 1;
  text-align: left;
  font-weight: 500;
}
.day-date {
  font-size: 0.85rem;
  color: #666;
  min-width: 120px;
  text-align: right;
}
.accordion-collapse {
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: 0;
  opacity: 0;
}
.accordion-collapse.show {
  max-height: 500px;
  opacity: 1;
}
.accordion-body {
  background-color: #ececec;
  padding: 1rem;
}
.activities-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.activity-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #c0c0c0;
}
.activity-item:last-child {
  border-bottom: none;
}
.activity-time {
  font-weight: 600;
  color: #1B3B6F;
  min-width: 80px;
}
.activity-name {
  flex: 1;
  color: #333;
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
