<!-- src/components/planner/NowActivity.vue -->
<template>
  <div
    v-if="place"
    class="now-active-card"
    @click="onClickCard"
  >
    <!-- Header -->
    <div class="now-header">
      <!-- Day Plan (크게) -->
      <h3 class="now-badge mb-0">
        ★ Day {{ dayIndex + 1 }} Plan
      </h3>

      <!-- 오른쪽 영역 -->
      <div class="now-nav">
        <!-- 상태 배지 : < 버튼 왼쪽 -->
        <span
          class="badge"
          :class="place.status === 'DONE' ? 'bg-success' : 'bg-warning'"
        >
          {{ place.status === 'DONE' ? '✔ Done' : '⏳ Pending' }}
        </span>

        <button
          class="now-nav-btn"
          :disabled="index === 0"
          @click.stop="$emit('update:index', index - 1)"
        >
          ‹
        </button>

        <span class="now-nav-count">
          {{ index + 1 }} / {{ total }}
        </span>

        <button
          class="now-nav-btn"
          :disabled="index === total - 1"
          @click.stop="$emit('update:index', index + 1)"
        >
          ›
        </button>
      </div>
    </div>

    <!-- Title -->
    <h5 class="now-title">
      {{ place.title }}
    </h5>

    <!-- Time -->
    <p class="now-subtitle text-muted">
      {{ formatTime(place.startAt) }}
      <span v-if="place.endAt">
        – {{ formatTime(place.endAt) }}
      </span>
    </p>

    <!-- Info -->
    <div class="now-info-row">
      <div class="now-info-box">
        <small class="now-info-label">Duration</small>
        <div class="now-info-value">
          {{ getDuration(place.startAt, place.endAt) }}
        </div>
      </div>

      <div class="now-info-box">
        <small class="now-info-label">Address</small>
        <div class="now-info-value truncate">
          {{ place.details?.address || "주소 정보 없음" }}
        </div>
      </div>

      <div class="now-info-box">
        <small class="now-info-label">Type</small>
        <div class="now-info-value">
          {{ categoryMap[place.details?.type] || "기타" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* ===========================
   Props / Emits
=========================== */
const props = defineProps({
  place: { type: Object, default: null },
  index: { type: Number, required: true },
  total: { type: Number, required: true },
  dayIndex: { type: Number, required: true },
});

const emit = defineEmits(["update:index", "complete"]);

/* ===========================
   Handlers
=========================== */
const onClickCard = () => {
  emit("complete", props.place);
};

/* ===========================
   Utils
=========================== */
const formatTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const getDuration = (start, end) => {
  if (!start || !end) return "-";
  const diff = (new Date(end) - new Date(start)) / 60000;
  const h = Math.floor(diff / 60);
  const m = Math.floor(diff % 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

const categoryMap = {
  FOOD: "음식점",
  SPOT: "관광지",
  SHOPPING: "쇼핑",
  CAFE: "카페",
  HOTEL: "숙소",
  EVENT: "이벤트",
  ETC: "기타",
};
</script>

<style scoped>
/* ===============================
   NOW ACTIVE CARD
=============================== */
.now-active-card {
  margin: 16px 18px 22px;
  padding: 20px 22px;
  border-radius: 16px;
  border: 2px solid #3b82f6;
  background: linear-gradient(135deg, #f5f9ff, #fdfdff);
  cursor: pointer;
}

/* header */
.now-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.now-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #2563eb;
}

/* navigation */
.now-nav {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.now-nav-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #c7d2fe;
  background: white;
  color: #2563eb;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  line-height: 1;
}

.now-nav-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.now-nav-count {
  font-size: 0.75rem;
  color: #6b7280;
}

/* title */
.now-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

/* subtitle */
.now-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 14px;
}

/* info */
.now-info-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.now-info-box {
  background: white;
  border-radius: 12px;
  padding: 10px 12px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.now-info-label {
  font-size: 0.72rem;
  color: #6b7280;
  margin-bottom: 2px;
}

.now-info-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}

/* truncate */
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
