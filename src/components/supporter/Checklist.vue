<template>
  <BaseSection title="Today's Checklist" icon="bi-journal-text" class="checklist-header">
    <template #subtitle>
      <div class="subtitle-container" @click.stop>
        <div class="progress progress-bar-row" style="height:8px; position:relative;">
          <div class="progress-bar" role="progressbar" :class="isComplete ? 'bg-success' : 'bg-warning'"
            :style="{ width: progressWidth }" :aria-valuenow="completionPercent" aria-valuemin="0"
            aria-valuemax="100"></div>
          <div class="progress-percent-top small">{{ completionPercent }}%</div>
        </div>
      </div>
    </template>

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
  padding-top: 25px;
}

.progress-bar-row {
  width: 100%;
  border-radius: 6px;
  overflow: visible;
}

.progress-percent-top {
  position: absolute;
  top: -23px;
  right: 8px;
  font-weight: 400;
  font-size: 12px;
  color: #6b7280;
  z-index: 2;
  pointer-events: none;
  background: rgba(255, 255, 255, 0);
  padding: 0 2px;
}
</style>