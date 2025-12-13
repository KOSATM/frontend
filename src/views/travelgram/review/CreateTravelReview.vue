<template>
  <div class="photo-upload-page">
    <PageHeader title="트래벌그램" subtitle="당신의 지난 여행 기록들" icon="bi-instagram" />
    <StepHeader title="여행 후기 작성" subtitle="여행 사진을 업로드해서 AI에게 사진 분석을 맡겨보세요." step="1/6" @back="goBack" />

    <div class="plan-info-card" v-if="currentplanInfo">
      <div class="plan-info-header"><h5 class="text-white">{{ planTitle }}</h5></div>
      <div class="plan-info-body">
        <div class="info-row"><span class="info-label">Location</span><span class="info-value">{{ currentplanInfo.location }}</span></div>
        <div class="info-row"><span class="info-label">Date</span><span class="info-value">{{ currentplanInfo.date }}</span></div>
        <div class="info-row"><span class="info-label">Budget</span><span class="info-value">${{ currentplanInfo.cost }}</span></div>
      </div>
    </div>

    <div class="itinerary-section" v-if="currentplanInfo && currentplanInfo.itinerary">
      <h6 class="itinerary-title mb-0">
        <i class="bi bi-calendar-event me-2 text-secondary"></i>지난 여행 일정
      </h6>

      <div class="timeline-wrapper">
        <PlanDayTimeline 
          :days="currentplanInfo.itinerary" 
          :edit-mode="false"
          :type-color="getTypeColor"
          :type-label="getTypeLabel"
          :format-time="formatTime"
          :category-map="categoryMap"
          @open-modal="handleOpenModal"
        />
      </div>
    </div>

    <PhotoUploader 
      v-model="uploadedImages" 
      :is-ready="isReady"
      :photo-group-id="reviewStore.photoGroupId"
      :max-count="10"
      @upload-started="startPolling"
    />

    <div v-if="isAnalyzing" class="alert alert-info mt-3 d-flex align-items-center">
      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
      <div>
        <strong>AI가 사진을 분석하고 있어요...</strong>
        <span class="small ms-1">사진 요약이 종료될 때까지 기다려주세요.</span>
      </div>
    </div>

    <NavigationButtons
      backText="Back"
      :isNextDisabled="!canProceed"
      @back="goBack"
      @next="goNext"
    >
      <template #next-content>
        <span v-if="isAnalyzing">분석 중...</span>
        <span v-else>Next Step</span>
      </template>
    </NavigationButtons>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import api from '@/api/travelgramApi'

// 컴포넌트 import
import PageHeader from '@/components/common/header/PageHeader.vue'
import StepHeader from '@/components/common/header/StepHeader.vue'
import NavigationButtons from '@/components/common/button/NavigationButtons.vue'
import PhotoUploader from '@/components/travelgram/PhotoUploader.vue'
import PlanDayTimeline from '@/components/planner/PlanDayTimeline.vue' 

const router = useRouter()
const route = useRoute()
const reviewStore = useReviewStore()

const planId = route.params.planId
const planTitle = route.params.planTitle || '나의 여행'

// 상태 변수
const uploadedImages = ref([])
const isAnalyzing = ref(false)
const pollingInterval = ref(null)
const isReady = ref(false)
const currentplanInfo = ref(null)

// -----------------------------------------------------------
// 🎨 1. 헬퍼 함수 수정 (planner/edit 코드와 통일)
// -----------------------------------------------------------
const categoryMap = {
  FOOD: "음식점",
  SPOT: "관광지",
  SHOPPING: "쇼핑",
  CAFE: "카페",
  HOTEL: "숙소",
  EVENT: "이벤트",
  ETC: "기타",
  // 호환성을 위해 추가
  ATTRACTION: "관광지",
  RESTAURANT: "음식점",
  ACCOMMODATION: "숙소"
}

const getTypeColor = (type) => {
  // 대문자로 변환하여 비교
  const t = type?.toUpperCase()
  switch (t) {
    case "FOOD":
    case "RESTAURANT": return "color-red";
    
    case "SHOPPING": return "color-blue";
    
    case "CAFE": return "color-green";
    
    case "HOTEL":
    case "ACCOMMODATION": return "color-gray";
    
    case "SPOT": 
    case "ATTRACTION": return "color-purple";
    
    case "EVENT": return "color-purple";
    default: return "color-purple"; // 기본값
  }
};

const getTypeLabel = (type) => {
  const t = type?.toUpperCase()
  switch (t) {
    case "FOOD": 
    case "RESTAURANT": return "식사 장소 추천";
    
    case "SHOPPING": return "쇼핑 추천";
    case "CAFE": return "카페 추천";
    
    case "HOTEL": 
    case "ACCOMMODATION": return "숙소 이동";
    
    case "SPOT": 
    case "ATTRACTION": return "관광지 추천";
    
    case "EVENT": return "이벤트 방문";
    case "ETC": return "공원 산책";
    default: return null; // null이면 라벨이 숨겨짐
  }
};

const formatTime = (isoString) => {
  if (!isoString) return ''
  // 00:00 형태로 자르기
  return isoString.substring(11, 16)
}

const handleOpenModal = (place) => {
  console.log("Place Clicked:", place.title)
}

// -----------------------------------------------------------
// 🔹 2. 데이터 로드 및 매핑 수정 (핵심 부분)
// -----------------------------------------------------------
const fetchPlanDetail = async () => {
  try {
    const res = await api.getPlanDetail(planId)
    const data = res.data

    // Location 추출
    let derivedLocation = 'Seoul, Korea'
    if (data.days?.[0]?.places?.[0]?.address) {
       const parts = data.days[0].places[0].address.split(' ')
       derivedLocation = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0]
    }

    currentplanInfo.value = {
      location: derivedLocation,
      date: `${data.plan.startDate} ~ ${data.plan.endDate}`,
      cost: Number(data.plan.budget).toLocaleString(),
      
      // ✅ PlanDayTimeline의 props 구조인 { days: [ { places: [...] } ] } 에 맞춤
      itinerary: data.days.map(d => ({
        dayNumber: d.day.dayIndex,
        title: d.day.title,
        date: d.day.planDate,
        
        // places 배열 매핑
        places: d.places.map(p => {
            // 백엔드에서 오는 카테고리 값 확인 (normalizedCategory, placeType 등)
            // 없는 경우를 대비해 기본값 설정
            const rawType = p.placeType || p.category || 'ETC';
            
            // 이미지 처리: firstImage2가 있으면 우선 사용, 없으면 firstImage
            const imageList = [];
            if (p.firstImage2) imageList.push(p.firstImage2);
            else if (p.firstImage) imageList.push(p.firstImage);

            return {
              title: p.placeName || p.title, 
              startAt: p.startAt,           
              
              // details 객체 구조 매핑
              details: { 
                type: rawType, // 색상/라벨 결정용
                desc: p.description || `${p.placeName || p.title} 방문 추천`, // 설명 텍스트 보강
                gallery: imageList, // ✅ 이미지가 있어야 썸네일이 뜸
                area: p.area || 'Seoul',
                address: p.address
              }
            }
        })
      }))
    }
  } catch (error) {
    console.error("상세 일정 로드 실패:", error)
    currentplanInfo.value = null
  }
}

// -----------------------------------------------------------
// Lifecycle & Actions (기존 유지)
// -----------------------------------------------------------
onMounted(async () => {
  reviewStore.setplanInfo(planId, planTitle)
  await fetchPlanDetail()
  
  try {
    const res = await api.createReview(planId)
    reviewStore.setReviewInfo(res.data.reviewPostId, res.data.photoGroupId, res.data.hashtagGroupId)
    isReady.value = true
  } catch (e) { console.error(e) }
})

const checkAnalysisStatus = async () => {
  if (!reviewStore.photoGroupId) return;
  try {
    const res = await api.getReviewPhotos(reviewStore.photoGroupId);
    const serverPhotos = res.data.data || [];

    uploadedImages.value.forEach(localImg => {
      if (localImg.uploading) return;
      const match = serverPhotos.find(s => String(s.id) === String(localImg.id));
      if (match && match.summary) {
        localImg.isAnalyzed = true;
        localImg.summary = match.summary;
      }
    });

    const isAllUploaded = uploadedImages.value.every(img => !img.uploading);
    const isAllAnalyzed = uploadedImages.value.every(img => img.isAnalyzed);

    if (uploadedImages.value.length > 0 && isAllUploaded && isAllAnalyzed) {
      stopPolling();
      isAnalyzing.value = false;
    } else {
      isAnalyzing.value = true;
    }
  } catch (err) { console.error('Polling failed', err); }
};

const startPolling = () => {
  if (pollingInterval.value) return
  isAnalyzing.value = true
  pollingInterval.value = setInterval(checkAnalysisStatus, 3000)
}

const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

onUnmounted(() => { stopPolling() })

const canProceed = computed(() => {
  return uploadedImages.value.length > 0 && !uploadedImages.value.some(img => img.uploading) && !isAnalyzing.value
})

const goNext = () => {
  reviewStore.setPhotos(uploadedImages.value)
  reviewStore.nextStep()
  router.push({
    name: 'PhotoOrder',
    params: { planId },
    query: { title: planTitle },
  })
}

const goBack = () => router.push({name: 'Travelgram'});
</script>

<style scoped>
/* 페이지 기본 스타일 */
.photo-upload-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem 6rem;
}

.plan-info-card {
  background-color: #fff;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.plan-info-header {
  background-color: #1B3B6F;
  color: #ffffff;
  padding: 1rem 1.5rem;

}
.plan-info-header h5 { margin: 0; font-weight: 600; }
.plan-info-body { padding: 1.5rem; }
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}
.info-label { font-weight: 600; color: #1B3B6F; }
.info-value { color: #666; }

/* 일정 섹션 */
.itinerary-section {
  margin-bottom: 2rem;
}
.itinerary-title {
  font-weight: 600;
  color: #1B3B6F;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
}

/* Timeline Wrapper: 
   자식 컴포넌트가 height: 100%를 가질 수 있도록 높이 설정이나
   배경색 등 최소한의 스타일만 부여
*/
.timeline-wrapper {
  background-color: transparent;
}
</style>