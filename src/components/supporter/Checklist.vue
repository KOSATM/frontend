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
import { ref, computed } from 'vue'
import BaseSection from '@/components/common/BaseSection.vue'

// 스토어에서 현재 여행정보 빼내서 씀
import { useTravelStore } from '@/store/travelStore'

const travelStore = useTravelStore()

// 설정
travelStore.setPlanInfo(81, 3, '2025-11-23')

// 조회
console.log(travelStore.planId)    // 81
console.log(travelStore.dayIndex)  // 3
console.log(travelStore.planDate)  // 2025-11-23

// 초기화
travelStore.clearPlanInfo()

const checklist = ref([
  { title: 'Camera battery fully charged?', done: false, highlight: true },
  { title: "Today's weather: Rainy / Bring umbrella 🌂", done: false, highlight: true },
  { title: 'Portable charger packed', done: false, highlight: false },
  { title: "Today's tip: OO Park - morning visit recommended", done: false, highlight: true },
  { title: 'Check transportation card balance', done: false, highlight: false },
  { title: 'Sunscreen & sunglasses', done: false, highlight: false },
])

const toggleItem = (idx) => {
  checklist.value[idx].done = !checklist.value[idx].done
}

const completedCount = computed(() => checklist.value.filter((c) => c.done).length)
const completionPercent = computed(() =>
  Math.round((completedCount.value / checklist.value.length) * 100)
)
const isComplete = computed(() => completedCount.value === checklist.value.length)
const progressWidth = computed(() => (isComplete.value ? '100%' : `${completionPercent.value}%`))
const completionLabel = computed(() => (isComplete.value ? '100% (complete)' : `${completionPercent.value}%`))
const sortedChecklist = computed(() => {
  const undone = checklist.value.filter(item => !item.done)
  const done = checklist.value.filter(item => item.done)
  return [...undone, ...done]
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