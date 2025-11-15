<template>
  <div
    v-for="(act, aIdx) in day.activities"
    :key="aIdx"
    :class="[
      'list-group-item d-flex justify-content-between align-items-center activity-row',
      activityRowClass(dayIndex, aIdx),
    ]"
    @click="$emit('openDetails', dayIndex, aIdx)"
  >
    <div class="d-flex align-items-start gap-3">
      <div class="icon-badge themed" :class="'theme-' + (act.type || 'default')">
        {{ act.icon || getIconForType(act.type) }}
      </div>
      <div class="d-flex flex-column">
        <div class="fw-semibold small title">
          <span v-if="act.completed" class="me-2">✅</span>
          {{ act.title }}
        </div>
        <div class="d-flex align-items-center gap-2 small text-muted sub">
          <span class="soft-chip">
            <span class="chip-emoji">⏰</span> {{ act.time }}
          </span>
          <span v-if="hasCost(act.cost)" class="soft-chip">
            <span class="chip-emoji">💰</span>
            {{ formatCost(act.cost) }}
          </span>
          <span v-if="act.spent != null" class="soft-chip">
            <span class="chip-emoji">💵</span> Spent
            {{ formatCost(act.spent) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 오른쪽 버튼 영역 -->
    <div class="d-flex align-items-center gap-2" @click.stop>
      <!-- 완료된 일정일 때만 되돌리기 -->
      <button
        v-if="act.completed"
        class="btn btn-sm btn-outline-secondary rounded-pill undo-btn"
        title="Mark as not done"
        @click="$emit('toggleComplete', dayIndex, aIdx)"
      >
        ↺
      </button>

      <button
        class="btn btn-sm btn-outline-danger rounded-pill delete-btn"
        title="Delete or replace"
        @click="$emit('openReplace', dayIndex, aIdx)"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  day: Object,
  dayIndex: Number,
  activityRowClass: Function,
  getIconForType: Function,
  hasCost: Function,
  formatCost: Function,
});

defineEmits(["openDetails", "toggleComplete", "openReplace"]);
</script>

<style scoped>
/* === 폰트 === */
.title {
  font-family: "Siganpyo", sans-serif;
}

.sub {
  font-family: "Kyobo2024", sans-serif;
}

/* === 전환 === */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.2s ease;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

/* === Activity Row === */
.activity-row {
  transition: background-color 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
}

.activity-row .delete-btn {
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.activity-row:hover .delete-btn {
  opacity: 1;
  transform: translateY(-1px);
}

.undo-btn {
  font-size: 12px;
  padding: 4px 10px;
  border-style: dashed;
}

/* === 상태 색상 === */
.activity-row--upcoming {
  background-color: #ffffff;
}

.activity-row--current {
  background-color: #e0edff;
  box-shadow: inset 4px 0 0 #2563eb, 0 4px 10px rgba(37, 99, 235, 0.18);
  transform: translateY(-1px);
}

.activity-row--current .title {
  font-weight: 700;
}

.activity-row--done {
  background-color: #f9fafb;
  box-shadow: inset 4px 0 0 #d1d5db;
}

.activity-row--done .title {
  color: #9ca3af;
  font-weight: 400;
  opacity: 0.9;
}

.activity-row--done .sub,
.activity-row--done .soft-chip {
  color: #9ca3af;
}

.activity-row--done .soft-chip {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.activity-row--done .icon-badge.themed {
  background: #e5e7eb;
  color: #6b7280;
  filter: grayscale(100%);
  opacity: 0.9;
}

.activity-row:hover {
  background-color: #fff7eb;
}

/* === 아이콘 배지 === */
.icon-badge.themed {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

/* === 타입 색상 === */
.theme-cafe { background: #fff2e6; }
.theme-food { background: #ffeaea; }
.theme-brunch { background: #fff7e0; }
.theme-dessert { background: #ffeef7; }
.theme-palace,
.theme-museum { background: #eaf3ff; }
.theme-tower { background: #eef4ff; }
.theme-walk { background: #eafaf1; }
.theme-shopping { background: #f1f0ff; }
.theme-market { background: #fff4e6; }
.theme-view { background: #eaf6ff; }
.theme-default { background: #f5f6f8; }

/* === 칩 === */
.soft-chip {
  padding: 2px 8px;
  border-radius: 10px;
  background: #f8f9fa;
  border: 1px solid #f1f3f5;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.chip-emoji {
  font-size: 12px;
  line-height: 1;
}
</style>
