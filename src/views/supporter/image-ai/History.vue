// filepath: c:\kosa-course\userProject\ATM\projects\frontend\src\views\supporter\image-ai\History.vue

<template>
  <BackButtonPageHeader title="Image-based Travel AI" subtitle="Find destinations from your photos" />

  <BaseSection icon="bi-clock-history" title="AI Recommendation History">
    <template #actions>
      <router-link class="btn btn-sm btn-primary" :to="{ name: 'New' }">+ New Search</router-link>
    </template>
    <div class="history-list">
      <div v-for="(h, i) in history" :key="i" class="history-item card p-3 mb-3">
        <div class="d-flex">
          <img :src="h.thumb" class="thumb me-3" />
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
              <div class="small text-muted mb-1">AI Recommendations ({{ h.recommendations.length }})</div>
              <div class="d-flex gap-2">
                <img v-for="(r, idx) in h.recommendations" :key="idx" :src="r.thumb" class="rec-thumb" />
              </div>
            </div>
          </div>
        </div>

        <!-- Hover Overlay -->
        <div class="hover-overlay">
          <div class="overlay-actions">
            <button class="action-btn detail-btn" @click="openModal(h)" title="View Details">
              <i class="bi bi-eye"></i> Detail
            </button>
            <!-- Change Status 버튼: Saved only 상태일 때만 표시 -->
            <button v-if="h.status === 'Saved only'" class="action-btn change-btn" @click="openChangeStatusModal(h)" title="Change Status">
              <i class="bi bi-arrow-repeat"></i> Change Status
            </button>
          </div>
        </div>
      </div>

      <div v-if="history.length === 0" class="text-center text-muted py-5">
        No AI history yet. Try "+ New Search" or upload a photo from Supporter main.
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
          <h5 class="mb-0">Change Status</h5>
          <button
            class="btn btn-sm btn-light rounded-circle"
            @click="changeStatusItem = null"
          >
            ✕
          </button>
        </div>

        <!-- Item Info -->
        <div class="selected-place card p-3 mb-3 d-flex align-items-center">
          <img :src="changeStatusItem.thumb" class="thumb me-3" />
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
              <div class="fw-medium">Add to Itinerary</div>
              <div class="small text-muted">Add this place to your travel schedule</div>
            </div>
            <div v-if="changeStatusSelection === 'add'" class="select-check" aria-hidden="true">✓</div>
          </li>

          <li class="option p-3 mb-2 rounded d-flex align-items-center" 
            :class="{ selected: changeStatusSelection === 'replace' }"
            @click="changeStatusSelection = 'replace'" role="button" tabindex="0">
            <div class="icon replace me-3">↺</div>
            <div class="flex-fill">
              <div class="fw-medium">Replace Existing</div>
              <div class="small text-muted">Replace an existing schedule item</div>
            </div>
            <div v-if="changeStatusSelection === 'replace'" class="select-check" aria-hidden="true">✓</div>
          </li>
        </ul>

        <!-- Buttons -->
        <div class="d-flex mt-4 gap-2">
          <button class="btn btn-outline-secondary flex-grow-1" @click="changeStatusItem = null">
            Cancel
          </button>
          <button class="btn btn-primary flex-grow-1" :disabled="!changeStatusSelection" @click="confirmChangeStatus">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButtonPageHeader from '@/components/common/BackButtonPageHeader.vue'
import BaseSection from '@/components/common/BaseSection.vue'
import ActivityDetailsModal from '@/components/planner/ActivityDetailsModal.vue'

const router = useRouter()

// 모달 상태
const selectedHistory = ref(null)
const changeStatusItem = ref(null)
const changeStatusSelection = ref(null)

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
const confirmChangeStatus = () => {
  if (!changeStatusSelection.value || !changeStatusItem.value) return

  const item = changeStatusItem.value
  const mode = changeStatusSelection.value

  // planedit으로 이동 (SelectPlan과 동일한 로직)
  router.push({
    name: 'planedit',
    state: { 
      item: {
        id: Math.random(), // 고유 ID 생성
        name: item.title,
        desc: item.note || '',
        distance: '',
        thumb: item.thumb
      },
      mode: mode
    },
    query: { 
      mode: mode, 
      itemId: Math.random(), 
      itemName: item.title 
    }
  }).catch(() => {
    // fallback
    router.push({
      name: 'ChoicePlan',
      state: { 
        item: {
          id: Math.random(),
          name: item.title,
          desc: item.note || '',
          distance: '',
          thumb: item.thumb
        },
        mode: mode
      },
      query: { mode: mode }
    }).catch(() => { })
  })

  changeStatusItem.value = null
}

const history = [
  {
    date: '2025.11.06',
    title: 'Food Photo',
    note: '→ Recommended: Jongro Kim\'s Samgyeopsal',
    status: 'Replaced',
    thumb: '/sample/food-main.jpg',
    area: 'Seoul, South Korea',
    address: 'Jongro-gu, Seoul',
    hours: '10:00 AM - 11:00 PM',
    cost: 15,
    desc: 'A popular Korean BBQ restaurant known for its high-quality samgyeopsal and friendly service.',
    imageQuery: 'Jongro Kims Samgyeopsal Seoul',
    recommendations: [
      { thumb: '/sample/rec1.jpg' },
      { thumb: '/sample/rec2.jpg' }
    ]
  },
  {
    date: '2025.11.05',
    title: 'Food Photo',
    note: '',
    status: 'Saved only',
    thumb: '/sample/food-main.jpg',
    area: 'Seoul, South Korea',
    address: 'Gangnam-gu, Seoul',
    hours: '11:00 AM - 10:00 PM',
    cost: 20,
    desc: 'A trendy Korean restaurant offering traditional and modern fusion dishes.',
    imageQuery: 'Korean restaurant Gangnam Seoul',
    recommendations: [
      { thumb: '/sample/rec1.jpg' },
      { thumb: '/sample/rec2.jpg' }
    ]
  }
]
</script>

<style scoped>
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

:deep(.upload-section .upload-title) {
  font-size: 100rem !important;
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