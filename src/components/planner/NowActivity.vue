<!-- src/components/planner/NowActivity.vue -->
<template>
  <div
    v-if="place"
    class="now-active-card"
    @click="onClickCard"
  >
    <!-- Top row: NOW pill + dot + status + (nav on right) -->
    <div class="now-top">
      <span class="now-pill">NOW</span>

      <span
        class="dot"
        :class="{ done: place.status === 'DONE' }"
        aria-hidden="true"
      ></span>

      <span class="status">
        {{ place.status === "DONE" ? "완료됨" : "진행 중" }}
      </span>

      <!-- 네비게이션: 기능 유지 (UI는 최대한 얇게) -->
      <div class="now-nav" @click.stop>
        <button
          class="now-nav-btn"
          :disabled="index === 0"
          @click.stop="$emit('update:index', index - 1)"
          aria-label="previous"
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
          aria-label="next"
        >
          ›
        </button>
      </div>
    </div>

    <!-- Center title -->
    <div class="now-title">
      {{ place.title }}
    </div>

    <!-- subtitle: time • place -->
    <div class="now-sub">
      <span class="time">
        {{ formatTime(place.startAt) }}
        <span v-if="place.endAt">– {{ formatTime(place.endAt) }}</span>
      </span>
      <span class="sep">•</span>
      <span class="place truncate">
        {{ place.details?.area || place.details?.address || "Seoul" }}
      </span>
    </div>

    <!-- progress -->
    <div class="progress" aria-hidden="true">
      <div class="bar" :style="{ width: progressPercent + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs } from "vue";

/* ===========================
   Props / Emits (그대로)
=========================== */
const props = defineProps({
  place: { type: Object, default: null },
  index: { type: Number, required: true },
  total: { type: Number, required: true },
  dayIndex: { type: Number, required: true }, // 기능 유지(사용 안 해도 OK)
});

const emit = defineEmits(["update:index", "complete"]);
const { place, index, total } = toRefs(props);

/* ===========================
   Handlers (그대로)
=========================== */
const onClickCard = () => {
  emit("complete", place.value);
};

/* ===========================
   Utils (그대로)
=========================== */
const formatTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/* ===========================
   UI용 progress
=========================== */
const progressPercent = computed(() => {
  if (!place.value) return 0;
  return place.value.status === "DONE" ? 100 : 35;
});
</script>

<style scoped>
/* =================================================
   NOW ACTIVE CARD (스크린샷 스타일: 가로 글래스 카드)
================================================= */
.now-active-card {
  margin: 16px 18px 22px;
  width: min(920px, calc(100% - 36px));
  border-radius: 22px;
  padding: 18px 20px 14px;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  /* 🔥 핵심 수정 */
  background:
    linear-gradient(
      135deg,
      rgba(20, 18, 48, 0.92),
      rgba(42, 18, 85, 0.92)
    );

  border: 1px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  box-shadow:
    0 18px 70px rgba(0,0,0,.35),
    inset 0 1px 0 rgba(255,255,255,.10);
}

/* 카드 내부 ‘도트’ 분위기 (사진처럼 은은하게) */
.now-active-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .35;

  background-image:
    radial-gradient(rgba(255,255,255,.22) 1px, transparent 1px);
  background-size: 18px 18px;
  background-position: center;
  mask-image: radial-gradient(closest-side, rgba(0,0,0,.9), transparent 68%);
  -webkit-mask-image: radial-gradient(closest-side, rgba(0,0,0,.9), transparent 68%);
}

/* 쉬머 살짝 */
.now-active-card::before {
  content: "";
  position: absolute;
  inset: -40% -20% auto -20%;
  height: 160%;
  background: radial-gradient(closest-side, rgba(255,255,255,.16), transparent 70%);
  transform: rotate(18deg);
  opacity: .30;
  pointer-events: none;
}

/* =========================
   TOP ROW
========================= */
.now-top {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 2;
}

.now-pill {
  font-size: 12px;
  letter-spacing: .12em;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.14);
  border: 1px solid rgba(255,255,255,.22);
  color: rgba(255,255,255,.92);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(150, 255, 210, .95);
  box-shadow: 0 0 0 6px rgba(150, 255, 210, .14);
}

.dot.done {
  background: rgba(170, 255, 120, .95);
  box-shadow: 0 0 0 6px rgba(170, 255, 120, .14);
}

.status {
  font-size: 13px;
  color: rgba(255,255,255,.84);
}

/* nav: 최대한 얇게, 우측 정렬 */
.now-nav {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.now-nav-btn {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.22);
  background: rgba(255,255,255,.08);
  color: rgba(255,255,255,.92);
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  line-height: 1;
}

.now-nav-btn:disabled {
  opacity: 0.35;
  cursor: default;
}

.now-nav-count {
  font-size: 12px;
  color: rgba(255,255,255,.62);
}

/* =========================
   TITLE / SUB (센터 정렬)
========================= */
.now-title {
  margin: 14px 0 8px;
  text-align: center;
  font-size: 26px;
  line-height: 1.15;
  font-weight: 850;
  color: rgba(255,255,255,.96);
  text-shadow: 0 10px 26px rgba(0,0,0,.28);
  position: relative;
  z-index: 2;
}

.now-sub {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(255,255,255,.82);
  margin-bottom: 12px;
  position: relative;
  z-index: 2;
}

.sep { opacity: .6; }

.truncate {
  max-width: 44ch;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* =========================
   PROGRESS (바닥에 길게)
========================= */
.progress {
  height: 6px;
  border-radius: 999px;
  background: rgba(255,255,255,.14);
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.bar {
  height: 100%;
  border-radius: 999px;
  background: rgba(255,255,255,.82);
  box-shadow: 0 10px 26px rgba(255,255,255,.16);
  transition: width .35s ease;
}
</style>
