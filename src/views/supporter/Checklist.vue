<template>
  <section>
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div>
        <h4 class="mb-1">Today's Travel Assistant</h4>
        <small class="text-muted">{{ todayString }}</small>
      </div>
      <div class="text-end">
        <small class="text-muted">{{ completedCount }}/{{ checklist.length }}</small>
      </div>
    </div>

    <div class="card shadow-sm border-0 p-3 checklist-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center gap-2">
          <span class="fs-5">📋</span>
          <div>
            <strong>Today's Checklist</strong>
            <div class="text-muted small">Completion Rate</div>
          </div>
        </div>
        <div class="text-end">
          <div class="small text-muted">{{ completedCount }}/{{ checklist.length }}</div>
          <div class="progress progress-sm" style="width:120px;">
            <div
              class="progress-bar bg-warning"
              role="progressbar"
              :style="{ width: completionPercent + '%' }"
            ></div>
          </div>
          <div class="small text-muted mt-1">{{ completionPercent }}%</div>
        </div>
      </div>

      <ul class="list-unstyled mb-0">
        <li
          v-for="(item, idx) in checklist"
          :key="idx"
          class="checklist-item d-flex align-items-center p-3 mb-2 rounded"
          :class="{ 'border-warning': item.highlight }"
          @click="toggleItem(idx)"
          role="button"
        >
          <div class="me-3">
            <div class="circle-check" :class="{ checked: item.done }"></div>
          </div>
          <div class="flex-fill">
            <div class="d-flex justify-content-between">
              <div>
                <span v-if="item.highlight" class="text-warning me-1">★</span>
                {{ item.title }}
              </div>
              <div class="text-muted small">{{ item.hint || '' }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const checklist = ref([
  { title: 'Camera battery fully charged?', done: false, highlight: true },
  { title: "Today's weather: Rainy / Bring umbrella 🌂", done: false, highlight: true },
  { title: 'Portable charger packed', done: false, highlight: false },
  { title: "Today's tip: OO Park - morning visit recommended", done: false, highlight: true },
  { title: 'Check transportation card balance', done: false, highlight: false },
  { title: 'Sunscreen & sunglasses', done: false, highlight: false },
]);

const toggleItem = (idx) => {
  checklist.value[idx].done = !checklist.value[idx].done;
};

const completedCount = computed(() => checklist.value.filter((c) => c.done).length);
const completionPercent = computed(() =>
  Math.round((completedCount.value / checklist.value.length) * 100)
);

const todayString = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
</script>

<style scoped>
.checklist-card { background: #fff; }
.checklist-item { background: #fff; border: 1px solid #f0f0f0; cursor: pointer; }
.circle-check { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #ced4da; }
.circle-check.checked { background: linear-gradient(90deg,#ffd966,#ffb86b); border-color: #ffb86b; }
.progress-sm { height: 8px; border-radius: 4px; overflow: hidden; }
</style>