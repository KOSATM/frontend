<template>
  <BaseSection title="Today's Checklist" icon="bi-journal-text" bgColor="#fff9d6">

    <div class="progress-wrapper mb-3">
      <div class="progress progress-bar-row m-3" :class="{ 'progress-complete': isComplete }">
        <div class="progress-bar" role="progressbar" :class="isComplete ? 'bg-success' : 'bg-warning'"
          :style="{ width: progressWidth }" :aria-valuenow="completionPercent" aria-valuemin="0"
          aria-valuemax="100"></div>
        <div class="progress-stats">
          <div class="text-muted small mb-2">{{ completedCount }}/{{ checklist.length }}</div>
          <div class="text-muted small mt-2 mb-1">{{ completionLabel }}</div>
        </div>
      </div>
    </div>

    <ul class="list-unstyled mb-0" @click.stop>
      <li v-for="(item, idx) in sortedChecklist" :key="idx"
        class="checklist-item d-flex align-items-center p-3 mb-2 rounded" :class="{ 'checked-item': item.done }"
        @click="toggleItem(checklist.indexOf(item))" role="button">
        <div class="me-3">
          <div class="circle-check" :class="{ checked: item.done }"></div>
        </div>
        <div class="flex-fill">
          <div class="d-flex justify-content-between align-items-center">
            <span class="item-title" :class="{ checkedTitle: item.done }">{{ item.title }}</span>
            <div class="text-muted small">{{ item.hint || '' }}</div>
          </div>
        </div>
      </li>
    </ul>
  </BaseSection>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseSection from '@/components/common/BaseSection.vue'
import { getChecklistByUserId } from '@/api/checklistApi'
import { useTravelStore } from '@/store/travelStore'

const travelStore = useTravelStore()
const checklist = ref([])
const loading = ref(false)

// 테스트용: dayIndex = 3 설정
travelStore.dayIndex = 3

// 기본 체크리스트 (dayIndex가 없을 때)
const defaultChecklist = [
  { title: 'Camera battery fully charged?', done: false, highlight: true },
  { title: "Today's weather: Rainy / Bring umbrella 🌂", done: false, highlight: true },
  { title: 'Portable charger packed', done: false, highlight: false },
  { title: "Today's tip: OO Park - morning visit recommended", done: false, highlight: true },
  { title: 'Check transportation card balance', done: false, highlight: false },
  { title: 'Sunscreen & sunglasses', done: false, highlight: false },
]

// DB에서 체크리스트 불러오기
const loadChecklist = async () => {
  try {
    loading.value = true
    
    console.log('📌 Current dayIndex:', travelStore.dayIndex)
    
    // dayIndex가 없으면 기본값 사용
    if (travelStore.dayIndex === null) {
      console.log('⚠️ No dayIndex - using default checklist')
      checklist.value = [...defaultChecklist]
      return
    }
    
    // localStorage에서 사용자 정보 가져오기
    const userStr = localStorage.getItem('user')
    
    if (!userStr) {
      console.log('❌ User not logged in - using default checklist')
      checklist.value = [...defaultChecklist]
      return
    }
    
    const user = JSON.parse(userStr)
    const userId = user.id
    
    console.log('👤 Loading checklist for userId:', userId)
    
    // userId로 체크리스트 조회
    const response = await getChecklistByUserId(userId)
    
    console.log('📦 API Response:', response)
    
    // API 응답에서 data 추출
    const data = response.data || response
    
    if (data && Array.isArray(data) && data.length > 0) {
      // DB 데이터를 컴포넌트 형식에 맞게 변환
      checklist.value = data.map(item => ({
        id: item.id,
        title: item.content,  // content를 title로 매핑
        done: item.isChecked || false,
        hint: '',  // hint는 비움
        highlight: false
      }))
      console.log('✅ Checklist loaded from DB:', checklist.value)
    } else {
      console.log('⚠️ No checklist items found - using default checklist')
      checklist.value = [...defaultChecklist]
    }
  } catch (error) {
    console.error('❌ Failed to load checklist:', error)
    console.error('Error details:', error.response?.data || error.message)
    // 에러 시 기본값 설정
    checklist.value = [...defaultChecklist]
  } finally {
    loading.value = false
  }
}

const toggleItem = (idx) => {
  checklist.value[idx].done = !checklist.value[idx].done
}

const completedCount = computed(() => checklist.value.filter((c) => c.done).length)
const completionPercent = computed(() =>
  checklist.value.length > 0 ? Math.round((completedCount.value / checklist.value.length) * 100) : 0
)
const isComplete = computed(() => checklist.value.length > 0 && completedCount.value === checklist.value.length)
const progressWidth = computed(() => (isComplete.value ? '100%' : `${completionPercent.value}%`))
const completionLabel = computed(() => (isComplete.value ? '100% (complete)' : `${completionPercent.value}%`))
const sortedChecklist = computed(() => {
  const undone = checklist.value.filter(item => !item.done)
  const done = checklist.value.filter(item => item.done)
  return [...undone, ...done]
})

// 컴포넌트 마운트 시 체크리스트 로드
onMounted(() => {
  loadChecklist()
})
</script>

<style scoped>
.checklist-item {
  background: #fff;
  border: 1px solid #ececec;
  cursor: pointer;
  transition: opacity .28s ease, transform .12s ease;
  display: flex;
  align-items: center;
  gap: 0px;
  padding: 10px;
}

.checklist-item.checked-item {
  opacity: .55;
  transform: scale(.995);
  border-color: #d1fae5;
  background: rgba(255, 255, 255, 0.95);
}

.item-title {
  font-size: 13px;
  color: #222;
}

.item-title.checkedTitle {
  position: relative;
  color: #555;
  text-decoration: line-through;
}

.circle-check {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all .18s ease;
}

.circle-check.checked {
  background: #34d399;
  border-color: #34d399;
}

.circle-check.checked::after {
  content: "✓";
  color: #fff;
  font-weight: 700;
  font-size: 10px;
  line-height: 1;
}

.subtitle-container {
  position: relative;
  padding-top: 0;
}

.progress-wrapper {
  display: flex;
  width: 100%;
}

.progress-bar-row {
  display: flex;
  align-items: center;
  width: 100%;
  height: 12px;
  border-radius: 6px;
  overflow: visible;
  position: relative;
  background-color: #e9ecef;
}

.progress-bar-row .progress-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-complete {
  background-color: #d1f5e0 !important;
}

.progress-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: absolute;
  right: 0;
  text-align: right;
  white-space: nowrap;
  font-size: 0.875rem;
  line-height: 1.2;
}
</style>