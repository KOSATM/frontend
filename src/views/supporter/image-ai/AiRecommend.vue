<template>
  <!-- <div class="supporter-page"> -->
  <!-- <PageHeader title="서포터" subtitle="실시간으로 당신의 여행을 도와드립니다." icon="bi-chat-dots" /> -->
  <StepHeader title="이미지 기반 여행 AI" subtitle="AI가 사진 분석을 완료했습니다!" step="3/4"
    @back="router.push({ name: 'ImageType' })" />
  <BaseSection icon="bi bi-images" title="AI 분석 완료"
    :subtitle="`유사한 장소 ${results.length} 개`">
    <template #actions>
      <router-link class="btn btn-sm btn-outline-primary" :to="{ name: 'CreateNewSearch' }">새로운 검색</router-link>
    </template>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">로딩 중...</span>
      </div>
      <p class="mt-3 text-muted">AI가 분석 중입니다...</p>
    </div>

    <template v-else>
      <h5 class="mb-3">추천된 목적지</h5>
      <div class="results-list">
        <div v-for="(r, i) in results" :key="i" class="result-card card mb-3 p-3"
          :class="{ selected: selectedIndex === i }" @click="select(i)" @keyup.enter.space.prevent="select(i)"
          role="button" tabindex="0" :aria-pressed="selectedIndex === i">
          <div class="d-flex align-items-center">
            <div class="thumb-wrap me-3 position-relative">
              <div class="thumb-bg rounded">
                <img :src="r.imageUrl || '/sample/placeholder.jpg'" alt="thumb" class="thumb rounded" v-img-fallback="fallbacks" />
              </div>
              <div class="match-badge rounded-pill">{{ Math.round((r.confidence || 0) * 100) }}%</div>
            </div>

            <div class="flex-fill">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-semibold fs-6">{{ r.placeName }}</div>
                  <div class="small text-muted mt-1">{{ r.description || r.association }}</div>
                </div>
                <div class="text-end small text-muted d-none d-md-block">
                  <div><i class="bi bi-geo-alt me-1"></i>{{ r.address }}</div>
                  <div class="mt-1 text-purple">신뢰도: {{ Math.round((r.confidence || 0) * 100) }}%</div>
                </div>
              </div>

              <div class="d-flex align-items-center mt-3 small text-muted d-md-none">
                <i class="bi bi-geo-alt me-1"></i>{{ r.address }}
                <span class="ms-3 text-purple">신뢰도: {{ Math.round((r.confidence || 0) * 100) }}%</span>
              </div>
            </div>
          </div>

          <!-- visual selection indicator (right side) -->
          <div v-if="selectedIndex === i" class="select-check" aria-hidden="true">✓</div>
        </div>
      </div>
    </template>
  </BaseSection>

    <div class="d-flex mt-2">
      <NavigationButtons
    back-text="뒤로가기"
    next-text="적용하기"
    :is-next-disabled="selectedIndex === null"
    @back="goBack"
    @next="addPlan"
      />
    </div>
  <!-- </div> -->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSupporterStore } from '@/store/supporterStore'
import { useImageSearchStore } from '@/store/imageSearchStore'
import imageSearchApi from '@/api/imageSearchApi'
import StepHeader from '@/components/common/header/StepHeader.vue'
import BaseSection from '@/components/common/BaseSection.vue'
import PageHeader from '@/components/common/header/PageHeader.vue'
import NavigationButtons from '@/components/common/button/NavigationButtons.vue';

const router = useRouter()
const route = useRoute()
const supporterStore = useSupporterStore()
const imageSearchStore = useImageSearchStore()
const selectedIndex = ref(null)
const results = ref([])
const isLoading = ref(true)

const fallbacks = [
  "/images/01.png",
  "/images/02.png",
  "/images/03.png",
  "/images/04.png",
  "/images/05.png",
  "/images/06.png",
];

const goBack = () => {
  router.push({ name: 'CreateNewSearch' });
};

// Base64 문자열을 File 객체로 변환
function base64ToFile(base64String, fileName) {
  const arr = base64String.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  const n = bstr.length
  const u8arr = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i)
  }
  return new File([u8arr], fileName, { type: mime })
}

// 페이지 로드 시 백엔드 API 호출
onMounted(async () => {
  try {
    const preview = route.query?.preview
    const type = route.query?.type
    const userAddress = supporterStore.getUserAddress

    if (!preview || !type) {
      console.error('필수 파라미터가 없습니다.')
      isLoading.value = false
      return
    }

    console.log('선택된 사진 타입:', type)
    console.log('사용자 주소:', userAddress || 'Seoul, South Korea')

    // Base64 문자열을 File 객체로 변환
    const imageFile = base64ToFile(preview, 'uploaded-image.jpg')

    // 백엔드 API 호출 (imageSearchApi가 FormData 처리)
    try {
      const response = await imageSearchApi.recommendPlacesByImage(
        type, 
        imageFile, 
        userAddress || 'Seoul, South Korea'
      )

      console.log('백엔드 API 응답:', response)

      // API 응답 데이터를 results에 저장
      // 백엔드 응답이 { success, status, data, error } 형식이므로 data 배열을 추출
      if (response.success && response.data && Array.isArray(response.data)) {
        results.value = response.data
        // 스토어에도 저장 (다음 페이지에서 사용)
        imageSearchStore.setSearchResult(preview, type, response.data)
      } else if (Array.isArray(response)) {
        // 혹은 바로 배열인 경우
        results.value = response
        imageSearchStore.setSearchResult(preview, type, response)
      } else {
        results.value = []
      }

    } catch (apiError) {
      console.error('백엔드 API 호출 오류:', apiError)
      console.error('API 상세 오류:', apiError.response?.status, apiError.response?.data)
      
      // 테스트용 더미 데이터 (백엔드가 준비될 때까지)
      console.warn('더미 데이터를 사용합니다.')
      results.value = [
        {
          placeName: 'Gyeongbokgung Palace',
          description: 'Traditional Korean architecture with beautiful gardens',
          confidence: 0.95,
          address: '서울시 종로구 삼청로 37',
          type: 'poi',
          imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EGyeongbokgung Palace%3C/text%3E%3C/svg%3E'
        },
        {
          placeName: 'Bukchon Hanok Village',
          description: 'Historic Korean traditional village',
          confidence: 0.88,
          address: '서울시 종로구 계동길',
          type: 'poi',
          imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EBukchon Hanok Village%3C/text%3E%3C/svg%3E'
        },
        {
          placeName: 'N Seoul Tower',
          description: 'Iconic tower with panoramic city views',
          confidence: 0.82,
          address: '서울시 중구 장충동2가 산1-6',
          type: 'poi',
          imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EN Seoul Tower%3C/text%3E%3C/svg%3E'
        }
      ]
    }

  } catch (error) {
    console.error('백엔드 API 호출 오류:', error)
    alert('추천 데이터를 가져오는데 실패했습니다.')
  } finally {
    isLoading.value = false
  }
})

const select = (i) => {
  selectedIndex.value = i === selectedIndex.value ? null : i
  
  // 선택된 장소를 스토어에 저장
  if (selectedIndex.value !== null) {
    const selectedItem = results.value[selectedIndex.value]
    imageSearchStore.setSelectedPlace(selectedItem)
    console.log('선택된 장소:', selectedItem)
  } else {
    // 선택 해제 시
    imageSearchStore.setSelectedPlace(null)
  }
}

const addPlan = () => {
  if (selectedIndex.value === null) return
  
  // 선택된 장소는 이미 스토어에 저장됨 (select 함수에서 저장)
  // 다음 페이지로 이동
  router.push({
    name: 'SelectPlan'
  })
}
</script>

<style scoped>
.supporter-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem; /* App.vue 사이드바도 padding-top: 2rem 필요 */
}

.results-card {
  background: #fff9ff;
  border-radius: 12px;
}

/* status icon */
.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #1b3b6f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
}

/* result card base */
.result-card {
  border-radius: 12px;
  background: #fff;
  border: 1px solid #f3e8ff;
  box-shadow: none;
  cursor: pointer;
  transition: box-shadow .15s, transform .06s, border-color .12s, background .12s;
  position: relative;
  overflow: visible;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

/* selected state: 남색(#1b3b6f)로 통일 */
.result-card.selected {
  border-color: #1b3b6f;
  box-shadow: 0 10px 30px rgba(27, 59, 111, 0.08);
  background: #f3f7ff;
  transform: translateY(-4px);
}

/* select check (right side) - 남색으로 통일 */
.select-check {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: #1b3b6f;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: 0 6px 18px rgba(27, 59, 111, 0.12);
  border: 2px solid rgba(255, 255, 255, 0.6);
}

/* thumbnail area */
.thumb-wrap {
  width: 84px;
  flex: 0 0 84px;
}

.thumb-bg {
  width: 84px;
  height: 84px;
  background: #f7f7f9;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #f0ecf8;
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* match badge: solid color (no gradient) */
.match-badge {
  position: absolute;
  left: 6px;
  top: 6px;
  background: #1b3b6f;
  color: #fff;
  padding: 6px 8px;
  font-size: 12px;
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(27, 59, 111, 0.12);
}

/* 선택 텍스트 색 통일 (클래스명 유지) */
.text-purple {
  color: #1b3b6f;
  font-weight: 600;
}

/* card rounding */
.card {
  border-radius: 12px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>