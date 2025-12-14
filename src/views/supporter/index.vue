<template>
  <div class="supporter-page">
    <PageHeader title="서포터" subtitle="실시간으로 당신의 여행을 도와드립니다." icon="bi-chat-dots" />
    <!-- <BackButtonPageHeader title="메인 페이지" subtitle="위치 기반으로 당신의 여행을 도와드립니다." @back="goBack"/> -->

    <div class="map-wrapper-full mb-4">
      <div class="map-top-row d-flex align-items-start justify-content-between mb-2">
        <nav class="browser-tabs" role="tablist" aria-label="Map tabs">
          <button role="tab" :class="['tab-btn', { active: currentTab === 'image' }]" @click="currentTab = 'image'">
            이미지 기반 여행 AI
          </button>
          <button role="tab" :class="['tab-btn', { active: currentTab === 'restroom' }]" @click="currentTab = 'restroom'">
            공중 화장실
          </button>
        </nav>

        <div class="map-file-label small text-muted" role="button" title="Files">
          <i class="bi bi-folder2-open-fill"></i>
        </div>
      </div>

      <div class="card map-container shadow-sm border-0 p-0 position-relative">
        <NaverMap
          v-if="currentTab === 'image'"
          :markers="historyMarkers"
          :initialCenter="{ lat: 37.45, lng: 127.05 }"
          :initialZoom="11"
          :fitBoundsMode="true"
        />
        <NaverMap
          v-if="currentTab === 'restroom'"
          ref="restroomMapRef"
          :markers="toiletMarkers"
          :initialCenter="mapCenter"
          :initialZoom="16"
          :fitBoundsMode="false"
          @bounds-changed="onBoundsChanged"
        />
      </div>
    </div>

    <div v-show="currentTab === 'image'">
        <BaseSection title="이미지 기반 여행 AI" subtitle="사진을 올리면 관련된 장소를 추천해드립니다.">
          <template #icon>
            <div class="ai-badge"><i class="bi bi-camera-fill"></i></div>
          </template>

          <div class="image-ui-row d-flex gap-3 align-items-start">
            <div class="col how-works">
              <div class="a"><strong>어떻게 동작하나요?</strong></div>
              <ol class="small text-muted mb-0 ps-3">
                <li>여행 중 궁금한 점을 사진으로 올려보세요.</li>
                <li>AI가 이미지를 분석합니다.</li>
                <li>사진과 관련된 장소 추천을 받아보세요.</li>
              </ol>
            </div>

            <div class="col upload-column d-flex">
              <label class="upload-control d-block" @dragover.prevent @drop.prevent="onDrop" for="imageInput"
                @click.prevent="goToImageAINew" title="Open Image AI">
                <div class="upload-gradient d-flex align-items-center justify-content-center h-100 w-100">
                  <div class="text-center text-white-50">
                    <template v-if="imagePreview">
                      <img :src="imagePreview" alt="preview" class="preview-img rounded" />
                    </template>
                    <template v-else>
                      <i class="bi bi-camera fs-1"></i>
                      <div class="mt-2 label-text">업로드</div>
                    </template>
                  </div>
                </div>
              </label>
            </div>

            <div class="col history-column d-flex">
              <label class="upload-control history-control d-block" @click.prevent="goToImageAIHistory" title="History">
                <div class="upload-gradient d-flex align-items-center justify-content-center h-100 w-100">
                  <div class="text-center text-white-50">
                    <i class="bi bi-clock-history fs-1"></i>
                    <div class="mt-2 label-text">히스토리</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <input id="imageInput" type="file" accept="image/*" class="d-none" @change="onFileChange" />
          <div v-if="imagePreview" class="mt-3">
            <img :src="imagePreview" alt="preview" class="img-fluid rounded" />
          </div>
        </BaseSection>
      </div>

      <div v-show="currentTab === 'restroom'">
        <BaseSection title="근처 공중 화장실" subtitle="근처에 있는 공중 화장실을 찾아보세요.">
          <template #icon>
            <div class="ai-badge"><i class="bi bi-person-standing"></i></div>
          </template>

          <div v-if="isLoadingRestrooms" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">로딩 중...</span>
            </div>
            <p class="mt-2 text-muted">주변 화장실 검색 중...</p>
          </div>

          <div v-else class="list-group">
            <a v-for="(r, i) in filteredRestrooms" :key="i" href="#"
              class="list-group-item list-group-item-action mb-2 d-flex align-items-center rounded border-0 shadow-sm"
              @click.prevent="focusOnRestroom(r)">
              <div class="me-3 icon-box d-flex align-items-center justify-content-center">
                <i class="bi bi-person-standing text-primary fs-4"></i>
              </div>
              <div class="flex-fill">
                <div class="fw-medium">{{ r.name || '공중화장실' }}</div>
                <div class="small text-muted">
                  <i class="bi bi-geo-alt me-1"></i> {{ r.address || r.roadAddress || '주소 정보 없음' }}
                </div>
              </div>
              <div class="ms-3 text-muted"><i class="bi bi-chevron-right"></i></div>
            </a>

            <div v-if="filteredRestrooms.length === 0" class="text-center py-4 text-muted">
              주변에 등록된 화장실이 없습니다
            </div>
          </div>
        </BaseSection>
      </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/header/PageHeader.vue'
import BaseSection from '@/components/common/BaseSection.vue'
import NaverMap from '@/components/supporter/NaverMap.vue'
import ToiletApi from '@/api/ToiletApi'
import imageSearchApi from '@/api/imageSearchApi'
import {useAuthStore} from '@/store/authStore'
// import BackButtonPageHeader from '@/components/common/BackButtonPageHeader.vue'


const router = useRouter()
const authStore= useAuthStore()
// Map-related state
const currentTab = ref('image')

// 히스토리 마커 (Image 탭) - 백엔드에서 로드
const historyMarkers = ref([])
const isLoadingHistory = ref(false)

// Restroom 탭 관련
const restroomMapRef = ref(null)
const mapCenter = ref({ lat: 37.5665, lng: 126.9780 })
const userLocation = ref(null)
const toiletMarkers = ref([])
const nearestRestrooms = ref([])
const isLoadingRestrooms = ref(false)

// null 필터링된 화장실 목록
const filteredRestrooms = computed(() => {
  return nearestRestrooms.value.filter(r => r != null)
})

// 사용자 위치 가져오기
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          resolve(location)
        },
        (error) => {
          console.error('Geolocation 오류:', error)
          reject(error)
        }
      )
    } else {
      reject(new Error('Geolocation not supported'))
    }
  })
}

// Image History 로드 (대표 후보지만)
const loadImageHistory = async () => {
  try {
    isLoadingHistory.value = true
    
    const userId = authStore.userId;
    if(!userId){
      console.warn('❌ 사용자 ID가 없습니다. (비로그인 상태 또는 초기화 실패)');
      historyMarkers.value = [];
    }
    console.log('🖼️ 이미지 히스토리 로드 중... userId:', userId)
    
    const response = await imageSearchApi.getSessionsByUserId(userId)
    console.log('✅ API 응답:', response)
    
    // response.data가 배열인지 확인
    const sessions = Array.isArray(response) ? response : (response.data || [])
    console.log('✅ 세션 데이터:', sessions)
    
    // 각 세션의 선택된 후보지(대표 후보지)만 추출
    const markersMap = new Map() // 중복 제거를 위한 Map (lat,lng를 key로)
    
    sessions.forEach(session => {
      const candidates = session.candidates || []
      console.log(`📌 세션 ${session.sessionId} - 후보지 ${candidates.length}개`)
      candidates.forEach((c, idx) => {
        console.log(`  [${idx}] id:${c.candidateId}, isSelected:${c.isSelected}, place:${c.place?.name}, lat:${c.place?.lat}, lng:${c.place?.lng}`)
      })
      
      const selectedCandidate = candidates.find(c => c.isSelected === true)
      
      if (selectedCandidate && selectedCandidate.place) {
        const place = selectedCandidate.place
        console.log(`✅ 세션 ${session.sessionId} - 선택됨: ${place.name} (lat:${place.lat}, lng:${place.lng})`)
        
        if (place.lat && place.lng) {
          const key = `${place.lat},${place.lng}`
          
          // 중복되지 않은 경우에만 추가
          if (!markersMap.has(key)) {
            markersMap.set(key, {
              lat: place.lat,
              lng: place.lng,
              title: place.name || '추천 장소',
              info: `
                <div style="padding: 10px; min-width: 200px;">
                  <strong>${place.name || '추천 장소'}</strong>
                  <div style="margin-top: 8px; font-size: 12px; color: #666;">
                    ${place.address || '주소 정보 없음'}
                  </div>
                  <div style="margin-top: 6px; font-size: 11px; color: #999;">
                    순위: ${selectedCandidate.rank || '-'}
                  </div>
                </div>
              `
            })
          }
        } else {
          console.warn(`⚠️ 세션 ${session.sessionId} - 좌표 없음: ${place.name}`)
        }
      } else {
        console.warn(`⚠️ 세션 ${session.sessionId}: isSelected인 후보지 없음`)
      }
    })
    
    historyMarkers.value = Array.from(markersMap.values())
    console.log('🎯 히스토리 마커 개수:', historyMarkers.value.length)
    
  } catch (error) {
    console.error('❌ 히스토리 로드 실패:', error)
    historyMarkers.value = []
  } finally {
    isLoadingHistory.value = false
  }
}

// 가까운 화장실 3개 가져오기
const loadNearestRestrooms = async () => {
  try {
    isLoadingRestrooms.value = true
    
    let location = userLocation.value
    if (!location) {
      try {
        location = await getUserLocation()
        userLocation.value = location
        mapCenter.value = location
      } catch (error) {
        console.warn('사용자 위치를 가져올 수 없습니다. 기본 위치 사용')
        location = mapCenter.value
      }
    }
    
    console.log('🚻 가까운 화장실 검색 - 위치:', location)
    
    const toilets = await ToiletApi.getNearestToilets(location.lat, location.lng, 3)
    
    console.log('✅ 가까운 화장실:', toilets)
    nearestRestrooms.value = Array.isArray(toilets) ? toilets.filter(t => t != null) : []
    
  } catch (error) {
    console.error('❌ 가까운 화장실 로드 실패:', error)
    nearestRestrooms.value = []
  } finally {
    isLoadingRestrooms.value = false
  }
}

// 지도 범위 내 화장실 가져오기
const loadToiletsInBounds = async (bounds) => {
  try {
    if (!bounds) return
    
    console.log('🗺️ 지도 범위 내 화장실 검색:', bounds)
    
    const toilets = await ToiletApi.getToiletsInBounds(bounds)
    
    console.log('✅ 범위 내 화장실 개수:', toilets?.length)
    
    toiletMarkers.value = Array.isArray(toilets) 
      ? toilets
          .filter(toilet => toilet != null && (toilet.latitude || toilet.lat) && (toilet.longitude || toilet.lng))
          .map(toilet => ({
            lat: toilet.latitude || toilet.lat,
            lng: toilet.longitude || toilet.lng,
            title: toilet.toiletName || toilet.name || '공중화장실',
            info: `
              <div style="padding: 10px; min-width: 200px;">
                <strong>${toilet.toiletName || toilet.name || '공중화장실'}</strong>
                <div style="margin-top: 8px; font-size: 12px; color: #666;">
                  ${toilet.address || toilet.roadAddress || '주소 정보 없음'}
                </div>
              </div>
            `
          }))
      : []
    
    console.log('🎯 변환된 마커 개수:', toiletMarkers.value.length)
    
  } catch (error) {
    console.error('❌ 범위 내 화장실 로드 실패:', error)
    toiletMarkers.value = []
  }
}

// 지도 범위 변경 이벤트 핸들러
const onBoundsChanged = (bounds) => {
  console.log('🟡 onBoundsChanged 호출됨:', bounds)
  loadToiletsInBounds(bounds)
}

// 특정 화장실에 포커스
const focusOnRestroom = (restroom) => {
  if (restroomMapRef.value && restroomMapRef.value.map) {
    const map = restroomMapRef.value.map
    const lat = restroom.latitude || restroom.lat
    const lng = restroom.longitude || restroom.lng
    const location = new window.naver.maps.LatLng(lat, lng)
    map.setCenter(location)
    map.setZoom(18)
  }
}

// Restroom 탭으로 전환 시 데이터 로드
watch(currentTab, async (newTab) => {
  if (newTab === 'restroom') {
    console.log('🟢 Restroom 탭 활성화 - 데이터 로드 시작')
    
    // 가까운 화장실 로드
    if (nearestRestrooms.value.length === 0) {
      await loadNearestRestrooms()
    }
    
    // 지도가 초기화될 때까지 대기 후 bounds 이벤트 트리거
    setTimeout(() => {
      if (restroomMapRef.value && restroomMapRef.value.map) {
        const map = restroomMapRef.value.map
        const bounds = map.getBounds()
        
        if (bounds) {
          const ne = bounds.getNE()
          const sw = bounds.getSW()
          
          onBoundsChanged({
            northEastLat: ne.lat(),
            northEastLng: ne.lng(),
            southWestLat: sw.lat(),
            southWestLng: sw.lng()
          })
        }
      }
    }, 1000)
  } else if (newTab === 'image') {
    console.log('🟢 Image 탭 활성화 - 히스토리 로드')
    
    // 히스토리 로드
    if (historyMarkers.value.length === 0) {
      await loadImageHistory()
    }
  }
})

// 컴포넌트 마운트 시 Image 탭 히스토리 로드
onMounted(async () => {
  console.log('🟢 Supporter 페이지 마운트')
  await loadImageHistory()
})

// image upload handling (for image-ui content)
const imagePreview = ref(null)
const triggerFile = () => document.getElementById('imageInput')?.click()
const onFileChange = (e) => {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    imagePreview.value = ev.target.result
  }
  reader.readAsDataURL(f)
}
const onDrop = (e) => {
  const f = e.dataTransfer.files && e.dataTransfer.files[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    imagePreview.value = ev.target.result
  }
  reader.readAsDataURL(f)
}

// quick route helper (kept for compatibility)
const goToImageAI = () => {
  router.push({ name: 'History' }).catch(() => { })
}
// navigator to open new Image AI page
const goToImageAINew = () => {
  router.push({ name: 'CreateNewSearch' })
    .then(() => {
      // ensure we are at page top after navigation
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    })
    .catch(() => { })
}

const goToImageAIHistory = () => {
  // 로그인 체크
  if (!authStore.userId) {
    alert('로그인이 필요한 서비스입니다.\n히스토리를 확인하려면 로그인해주세요.')
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
    return
  }
  
  router.push({ name: 'History' })
    .then(() => {
      // ensure we are at page top after navigation
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    })
    .catch(() => { })
}
</script>

<style scoped>
.supporter-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem; /* App.vue 사이드바도 padding-top: 2rem 필요 */
}


/* two-column spacing handled by Bootstrap .row/.col */

/* collapse animation for checklist */
/* (collapse styles removed) */

/* map card */
.map-container {
  min-height: 380px;
  overflow: visible;
  border-radius: 12px;
}

.map-gradient {
  height: 100%;
  background: #f3fffb;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

/* ensure map top bar (tabs) sits above map content */
.map-top-bar {
  z-index: 250;
  pointer-events: auto;
}

.map-top-bar .tab-btn {
  pointer-events: auto;
}

/* browser-style tabs (segmented control) placed above the map */
.browser-tabs {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.tab-btn {
  background: #fff;
  border: 1px solid rgba(2, 6, 23, 0.06);
  padding: 6px 12px;
  font-size: 0.85em;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  box-shadow: 0 6px 14px rgba(6, 95, 70, 0.04);
  cursor: pointer;
  color: #374151;
  transition: transform .08s ease, box-shadow .12s ease;
}

.tab-btn.active {
  color: #0d6efd;
  font-weight: 600;
  transform: translateY(-4px);
  box-shadow: 0 14px 28px rgba(13, 110, 253, 0.08);
}

.tab-btn:focus {
  outline: 2px solid rgba(13, 110, 253, 0.12);
}

/* marker base */
.map-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 20px;
  z-index: 5;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* image marker style */
.marker-image {
  color: #fff;
  background: rgba(58, 87, 151, 0.95);
}

/* restroom marker overridden (keeps existing look) */
.marker-restroom {
  color: #0d6efd;
  background: rgba(255, 255, 255, 0.9);
}

/* gps center */
.gps-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
}

/* detail area */
.detail-area {
  min-height: 360px;
  border-radius: 12px;
}

/* BaseSection small tweaks */
.ai-badge {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #3A5797;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.upload-gradient {
  height: 120px;
  border-radius: 12px;
  background: #3A5797;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

/* history box: use site orange and ensure white icons/text */
.image-ui-row .history-column .upload-gradient {
  background: linear-gradient(180deg, #ff8c00 0%, #ff7a00 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.image-ui-row .history-column .upload-gradient .text-white-50,
.image-ui-row .history-column .upload-gradient i,
.image-ui-row .history-column .label-text {
  color: #ffffff !important;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

/* checklist wrapper styling */
.checklist-wrapper {
  cursor: pointer;
  user-select: none;
}

.checklist-wrapper :deep(.upload-header) {
  cursor: pointer;
  user-select: none;
}

.checklist-wrapper :deep(.upload-header):hover {
  opacity: 0.9;
}

.map-top-row {
  position: relative;
  z-index: 80;
}

.map-file-label {
  z-index: 85;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 10px;
  border-radius: 8px;
}

/* ensure map card is lower in stacking context than top row */
.map-container {
  position: relative;
  z-index: 10;
}

/* left column layout: make checklist : chat = 1 : 2 */
.col-md-4.d-flex.flex-column {
  /* total height approximates map (380) + detail (220) + gaps; adjust if your layout changes */
  min-height: 640px;
}

.col-md-4.d-flex.flex-column>.checklist-wrapper {
  flex: 1 1 0;
  min-height: 220px;
  /* ensure checklist area keeps consistent height */
  min-width: 0;
  /* allow proper flex overflow */
  overflow-y: auto;
}

.col-md-4.d-flex.flex-column>.flex-grow-1 {
  flex: 2 1 0;
  min-height: 360px;
  /* ensure chat area keeps consistent height */
  min-width: 0;
  overflow-y: auto;
}

.checklist-wrapper::-webkit-scrollbar {
  width: 8px;
}

.checklist-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.checklist-wrapper::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 4px;
}

/* memo-style background for checklist only */
.checklist-wrapper .upload-section {
  background: #fff9d6;
  /* pale paper yellow */
  border-color: rgba(0, 0, 0, 0.04);
  box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.03);
}

/* responsive adjustments */
@media (max-width: 991px) {

  .col-md-4,
  .col-md-8 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .map-gradient {
    height: 280px;
  }
}

/* Image UI layout tweaks */
@media (min-width: 0) {
  .image-ui-row {
    align-items: stretch;
    margin-top: 8px;
    min-height: 140px;
    height: 100%;
    display: flex;
  }

  /* explicit 2:1:1 ratio */
  .image-ui-row .how-works {
    flex: 2 2 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 0;
    gap: 8px;
    padding-right: 12px;
  }

  .image-ui-row .upload-column,
  .image-ui-row .history-column {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    align-items: stretch;
    justify-content: center;
  }

  .image-ui-row .col {
    min-width: 0;
  }

  /* make each column a column flex container so children can stretch to full height */
  .image-ui-row .col {
    display: flex;
    flex-direction: column;
  }

  /* ensure upload and history controls fill their column equally */
  .image-ui-row .upload-column .upload-control,
  .image-ui-row .history-column .upload-control {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
  }

  .image-ui-row .upload-column .upload-gradient,
  .image-ui-row .history-column .upload-gradient {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 140px;
    /* ensure both boxes have enough height and match */
  }
}
</style>