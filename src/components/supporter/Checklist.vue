<template>
  <BaseSection title="오늘의 체크리스트" icon="bi-journal-text" bgColor="#fff9d6">

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
          <div class="d-flex justify-content-between align-items-start">
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
travelStore.setPlanInfo(travelStore.planId, 3, travelStore.planDate)

// 기본 체크리스트 (dayIndex가 없을 때)
const defaultChecklist = [
  { title: '카메라 충전은 완료되었나요?', done: false, highlight: true },
  { title: "오늘의 날씨: 비 / 우산을 챙겨주세요. 🌂", done: false, highlight: true },
  { title: '보조배터리를 챙겨주세요.', done: false, highlight: false },
  { title: "오늘의 팁: ㅇㅇ공원 - 아침 방문을 추천드립니다.", done: false, highlight: true },
  { title: '교통카드 잔액을 확인해주세요.', done: false, highlight: false },
  { title: '선크림 & 선글라스', done: false, highlight: false },
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

  /* --- 줄바꿈을 위한 핵심 코드 --- */
  word-break: keep-all;  /* 한글 단어 중간이 끊기지 않고 단어 단위로 줄바꿈 */
  word-wrap: break-word; /* 아주 긴 영문이나 숫자는 강제로 줄바꿈 */
  white-space: normal;   /* 텍스트가 영역을 넘어가면 줄바꿈 허용 */
  line-height: 1.4;      /* 여러 줄일 때 가독성을 위해 줄 간격 확보 */
  display: block;        /* span 태그가 공간을 차지하도록 설정 */
  margin-right: 8px;     /* 힌트 텍스트와의 간격 확보 */
}
.checklist-item .text-muted.small {
  flex-shrink: 0;       /* 제목이 길어져도 힌트 영역이 찌그러지지 않음 */
  white-space: nowrap;  /* 힌트 텍스트는 줄바꿈 되지 않게 설정 */
  margin-left: auto;    /* 오른쪽 끝으로 확실하게 밀어줌 */
}
.checklist-item.checked-item {
  opacity: .55;
  transform: scale(.995);
  border-color: #d1fae5;
  background: rgba(255, 255, 255, 0.95);
}

.item-title {
  font-size: 20px;
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