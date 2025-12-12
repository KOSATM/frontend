// filepath: c:\kosa-course\userProject\ATM\projects\frontend\src\views\supporter\image-ai\History.vue

<template>
  <div class = "supporter-page">
  <PageHeader title="서포터" subtitle="실시간으로 여행을 도와드립니다." icon="bi-chat-dots" />
  <BackButtonPageHeader title="이미지 기반 여행 AI" subtitle="당신의 사진으로 여행 장소를 찾아보아요!" />

  <BaseSection icon="bi-clock-history" title="AI가 추천한 히스토리">
    <template #actions>
      <router-link class="btn btn-sm btn-primary" :to="{ name: 'CreateNewSearch' }">+ 새로운 검색</router-link>
    </template>
    
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">로딩 중...</span>
      </div>
    </div>
    
    <div v-else class="history-list">
      <div v-for="(h, i) in history" :key="i" class="history-item card p-3 mb-3">
        <div class="d-flex">
          <img v-if="h.thumb" :src="h.thumb" class="thumb me-3" />
          <div v-else class="thumb me-3 bg-secondary d-flex align-items-center justify-content-center text-white">
            <i class="bi bi-image"></i>
          </div>
          <div class="flex-fill">
            <div class="d-flex justify-content-between">
              <div>
                <div class="small text-muted">{{ h.date }}</div>
                <div class="fw-medium mt-1">{{ h.title }}</div>
                <div class="small text-muted mt-1">{{ h.note }}</div>
              </div>
              <div>
                <span v-if="h.status" class="badge status-badge">{{ h.status }}</span>
              </div>
            </div>

            <div class="mt-3">
              <div class="small text-muted mb-1">AI 추천 ({{ h.recommendations.length }})</div>
              <div class="d-flex gap-2">
                <template v-for="(r, idx) in h.recommendations" :key="idx">
                  <img v-if="r.thumb" :src="r.thumb" class="rec-thumb" :title="r.name" />
                  <div v-else class="rec-thumb bg-secondary d-flex align-items-center justify-content-center text-white" :title="r.name">
                    <i class="bi bi-image"></i>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Hover Overlay -->
        <div class="hover-overlay">
          <div class="overlay-actions">
            <button class="action-btn detail-btn" @click="openModal(h)" title="세부사항을 확인해보세요.">
              <i class="bi bi-eye"></i> 세부 사항
            </button>
            <!-- Change Status 버튼: Saved only 상태일 때만 표시 -->
            <button v-if="h.status === 'Saved only'" class="action-btn change-btn" @click="openChangeStatusModal(h)" title="상태 변경">
              <i class="bi bi-arrow-repeat"></i> 상태 변경
            </button>
          </div>
        </div>
      </div>

      <div v-if="history.length === 0" class="text-center text-muted py-5">
        AI 히스토리가 존재하지 않습니다. "새로운 검색" 버튼을 클릭하거나 서포터 홈에서 사진 업로드를 해보세요.
      </div>
    </div>
  </BaseSection>

  <!-- ActivityDetailsModal -->
  <ActivityDetailsModal 
    v-if="selectedHistory" 
    :open="true"
    :data="selectedHistory"
    @close="selectedHistory = null"
  />

  <!-- Change Status Modal -->
  <teleport to="body">
    <div v-if="changeStatusItem" class="modal-backdrop" @click="changeStatusItem = null">
      <div class="modal-card" @click.stop>
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">상태 변경</h5>
          <button
            class="btn btn-sm btn-light rounded-circle"
            @click="changeStatusItem = null"
          >
            ✕
          </button>
        </div>

        <!-- Item Info -->
        <div class="selected-place card p-3 mb-3 d-flex align-items-center">
          <img v-if="changeStatusItem.thumb" :src="changeStatusItem.thumb" class="thumb me-3" />
          <div v-else class="thumb me-3 bg-secondary d-flex align-items-center justify-content-center text-white">
            <i class="bi bi-image"></i>
          </div>
          <div>
            <div class="fw-medium">{{ changeStatusItem.title }}</div>
            <div class="small text-muted">{{ changeStatusItem.note }}</div>
          </div>
        </div>

        <!-- Options -->
        <ul class="list-unstyled">
          <li class="option p-3 mb-2 rounded d-flex align-items-center" 
            :class="{ selected: changeStatusSelection === 'add' }"
            @click="changeStatusSelection = 'add'" role="button" tabindex="0">
            <div class="icon add me-3">＋</div>
            <div class="flex-fill">
              <div class="fw-medium">장소 추가</div>
              <div class="small text-muted">당신의 여행 일정에 이 장소를 추가해보세요.</div>
            </div>
            <div v-if="changeStatusSelection === 'add'" class="select-check" aria-hidden="true">✓</div>
          </li>

          <li class="option p-3 mb-2 rounded d-flex align-items-center" 
            :class="{ selected: changeStatusSelection === 'replace' }"
            @click="changeStatusSelection = 'replace'" role="button" tabindex="0">
            <div class="icon replace me-3">↺</div>
            <div class="flex-fill">
              <div class="fw-medium">장소 대체</div>
              <div class="small text-muted">일정에 존재하는 장소를 대체해보세요.</div>
            </div>
            <div v-if="changeStatusSelection === 'replace'" class="select-check" aria-hidden="true">✓</div>
          </li>
        </ul>

        <!-- Buttons -->
        <div class="d-flex mt-4 gap-2">
          <button class="btn btn-outline-secondary flex-grow-1" @click="changeStatusItem = null">
            취소
          </button>
          <button class="btn btn-primary flex-grow-1" :disabled="!changeStatusSelection" @click="confirmChangeStatus">
            확인
          </button>
        </div>
      </div>
    </div>
  </teleport>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import BackButtonPageHeader from '@/components/common/header/BackButtonPageHeader.vue'
import BaseSection from '@/components/common/BaseSection.vue'
import ActivityDetailsModal from '@/components/planner/ActivityDetailsModal.vue'
import imageSearchApi from '@/api/imageSearchApi'
import PageHeader from '@/components/common/header/PageHeader.vue'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()

// 모달 상태
const selectedHistory = ref(null)
const changeStatusItem = ref(null)
const changeStatusSelection = ref(null)

// 히스토리 데이터
const history = ref([])
const isLoading = ref(false)

// ActionType 한글 변환
const getStatusText = (actionType) => {
  const statusMap = {
    'SAVE_ONLY': 'Saved only',
    'ADD_PLAN': 'Added',
    'REPLACED_PLAN': 'Replaced'
  }
  return statusMap[actionType] || actionType
}

// 히스토리 데이터 로드
const loadHistory = async () => {
  try {
    isLoading.value = true
    
    const userId = authStore.userId;
    console.log('📋 히스토리 로드 - userId:', userId)
    
    // API 호출
    const response = await imageSearchApi.getSessionsByUserId(userId)
    console.log('📋 받은 세션 데이터:', response)
    console.log('📋 데이터 타입:', typeof response, Array.isArray(response))
    
    // 응답이 래핑되어 있는 경우 data 추출
    const sessions = response.data ? response.data : (Array.isArray(response) ? response : [])
    
    console.log('📋 추출된 세션 배열:', sessions, '개수:', sessions.length)
    
    if (sessions.length === 0) {
      console.log('📋 세션 데이터가 없습니다')
      history.value = []
      return
    }
    
    // 데이터 변환
    history.value = sessions.map(session => {
      // 선택된 후보지 찾기 (isSelected === true)
      const selectedCandidate = session.candidates.find(c => c.isSelected)
      const selectedPlace = selectedCandidate?.place
      
      // 이미지 URL 우선순위: internalThumbnailUrl > internalOriginalUrl > externalImageUrl
      const getImageUrl = (place) => {
        return place?.internalThumbnailUrl || place?.internalOriginalUrl || place?.externalImageUrl || ''
      }
      
      // 선택되지 않은 후보지들 (나머지 추천 목록)
      const otherCandidates = session.candidates.filter(c => !c.isSelected)
      
      return {
        sessionId: session.sessionId,
        date: new Date(session.createdAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\. /g, '.').replace('.', ''),
        title: selectedPlace?.name || 'Unknown Place',
        note: selectedPlace?.address || '',
        status: getStatusText(session.actionType),
        thumb: getImageUrl(selectedPlace),
        area: selectedPlace?.address || '',
        address: selectedPlace?.address || '',
        hours: '',
        cost: 0,
        desc: selectedPlace?.description || '',
        imageQuery: selectedPlace?.name || '',
        candidates: session.candidates,
        selectedCandidate: selectedCandidate,
        // ActivityDetailsModal용 gallery 배열 (internalOriginalUrl 우선)
        gallery: [
          selectedPlace?.internalOriginalUrl || selectedPlace?.internalThumbnailUrl || selectedPlace?.externalImageUrl || ''
        ].filter(url => url),
        recommendations: otherCandidates.map(c => ({
          candidateId: c.candidateId,
          thumb: getImageUrl(c.place),
          name: c.place?.name || '',
          isSelected: c.isSelected
        }))
      }
    })
    
    console.log('✅ 변환된 히스토리:', history.value)
    
    // 각 히스토리의 recommendations 확인
    history.value.forEach((h, idx) => {
      console.log(`세션 ${idx + 1} - 대표: ${h.title}, 추천 개수: ${h.recommendations.length}`)
      h.recommendations.forEach((r, ridx) => {
        console.log(`  추천 ${ridx + 1}: ${r.name}, 이미지: ${r.thumb ? '있음' : '없음'}`)
      })
    })
    
  } catch (error) {
    console.error('❌ 히스토리 로드 실패:', error)
  } finally {
    isLoading.value = false
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadHistory()
})

// 상세 보기 모달 열기
const openModal = (item) => {
  selectedHistory.value = item
}

// Change Status 모달 열기
const openChangeStatusModal = (item) => {
  changeStatusItem.value = item
  changeStatusSelection.value = null
}

// Change Status 확인
const confirmChangeStatus = async () => {
  if (!changeStatusSelection.value || !changeStatusItem.value) return

  const item = changeStatusItem.value
  const mode = changeStatusSelection.value

  try {
    // 선택된 후보지의 candidateId 가져오기 (대표 장소)
    if (!item.selectedCandidate) {
      console.error('선택된 후보지가 없습니다')
      alert('선택된 장소를 찾을 수 없습니다.')
      return
    }
    
    const candidateId = item.selectedCandidate.candidateId
    
    // ActionType 업데이트
    console.log('🔄 ActionType 업데이트:', candidateId, mode)
    await imageSearchApi.updateActionType(candidateId, mode)
    
    console.log('✅ ActionType 업데이트 성공')
    
    // 히스토리 새로고침
    await loadHistory()
    
    // 모달 닫기
    changeStatusItem.value = null
    changeStatusSelection.value = null
    
    alert('상태가 변경되었습니다.')
    
  } catch (error) {
    console.error('❌ ActionType 업데이트 실패:', error)
    alert('상태 변경에 실패했습니다.')
  }
}
</script>

<style scoped>
.supporter-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem; /* App.vue 사이드바도 padding-top: 2rem 필요 */
}

.history-card {
  background: #FFD9A6;
  border-radius: 12px;
}

.history-item {
  border-radius: 12px;
  background: #fff;
  border: 1px solid #f3e8ff;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}

.history-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.thumb {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  object-fit: cover;
}

.rec-thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid rgba(167, 139, 255, 0.15);
}

.status-badge {
  background: #1b3b6f;
  color: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}

/* Hover Overlay */
.hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  border-radius: 12px;
}

.history-item:hover .hover-overlay {
  opacity: 1;
  pointer-events: auto;
}

.overlay-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #fff;
}

.detail-btn {
  background: #2563eb;
}

.detail-btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

.change-btn {
  background: #7c3aed;
}

.change-btn:hover {
  background: #6d28d9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(124, 58, 237, 0.3);
}


/* Change Status Modal Styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 10000;
}

.modal-card {
  width: min(500px, 90vw);
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
  animation: pop 0.18s ease;
}

@keyframes pop {
  from {
    transform: translateY(-6px);
    opacity: 0.9;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.selected-place {
  border-radius: 10px;
  background: #fff;
  border: 1px solid #f3e8ff;
  justify-content: flex-start;
}

.thumb {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.option {
  background: #fff;
  border: 1px solid #f3e8ff;
  cursor: pointer;
  transition: box-shadow .12s, transform .08s;
  position: relative;
}

.option.selected {
  border-color: #1b3b6f;
  background: #f3f7ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(27, 59, 111, 0.06);
}

.option .icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7ff;
  color: #6b46ff;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}

.option:hover {
  box-shadow: 0 8px 20px rgba(167, 139, 255, 0.06);
  transform: translateY(-2px);
}

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
</style>