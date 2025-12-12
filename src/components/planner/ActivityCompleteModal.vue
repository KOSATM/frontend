<!-- src/components/planner/PlannerActivityCompleteModal.vue -->
<template>
  <teleport to="body">
    <div v-if="open" class="modal-backdrop" @click="$emit('close')">
      <div class="modal-card" @click.stop>

        <!-- 닫기 버튼 -->
        <button class="close-btn" @click="$emit('close')">✕</button>

        <!-- 상단 이미지 -->
        <div class="main-image-wrapper">
          <img :src="localGallery[0]" alt="thumbnail" class="main-image" />
        </div>

        <!-- 제목 -->
        <h3 class="activity-title">
          {{ title || "방문 장소" }}
        </h3>

        <!-- 방문 문구 -->
        <p class="visit-desc">
          <strong>{{ title }}</strong> 방문은 어떠셨나요?
        </p>

        <!-- 비용 입력 -->
        <label class="label">실제 지출 비용 (선택)</label>
        <div class="input mb-3">
          <span>₩</span>
          <input
            type="number"
            min="0"
            step="1"
            :value="spendInput"
            @input="onInput"
            placeholder="금액을 입력해주세요"
          />
        </div>

        <!-- 빠른 입력 버튼 -->
        <div class="quick-amounts mb-3">
          <button
            v-for="v in [5000, 10000, 20000, 30000]"
            :key="v"
            class="chip-btn"
            @click="$emit('update:spend-input', v)"
          >
            {{ v.toLocaleString() }}원
          </button>

          <button class="chip-btn ghost" @click="$emit('update:spend-input', null)">
            초기화
          </button>
        </div>

        <!-- 코멘트 -->
        <label class="label">간단한 메모 (선택)</label>
        <textarea
          class="comment-box mb-3"
          rows="2"
          :value="comment"
          placeholder="인상 깊었던 점, 불편했던 점 등을 기록해보세요"
          @input="$emit('update:comment', $event.target.value)"
        ></textarea>

        <!-- Quick Stats -->
        <div class="stats-card mb-4">
          <div class="sub small fw-semibold mb-2">기록 정보</div>
          <div class="row small">
            <div class="col-6 mb-1">
              <span class="text-muted">시작 시간:</span>
              <div>{{ quickStats?.started || "-" }}</div>
            </div>
            <div class="col-6 mb-1">
              <span class="text-muted">체류 시간:</span>
              <div>{{ quickStats?.duration || "-" }}</div>
            </div>
            <div class="col-12 mt-2">
              <span class="text-muted">상태:</span>
              <div class="text-success fw-semibold">{{ quickStats?.status || "-" }}</div>
            </div>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="btn-row">
          <button class="btn" @click="$emit('close')">취소</button>
          <button class="btn primary" @click="$emit('confirm')">활동 완료</button>
        </div>

      </div>
    </div>
  </teleport>
</template>

<script setup>
// trigger pr
import { computed } from "vue";
import defaultImg1 from "@/assets/planner/activity-default-1.jpg";

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: "" },
  gallery: { type: Array, default: () => [] }, // 🔥 상세 모달과 통일
  spendInput: { type: Number, default: null },
  comment: { type: String, default: "" },
  quickStats: { type: Object, default: () => ({}) },
});

const emit = defineEmits([
  "close",
  "confirm",
  "update:spend-input",
  "update:comment"
]);

/* 첫 번째 이미지만 사용 */
const localGallery = computed(() => {
  if (!props.gallery || props.gallery.length === 0) return [defaultImg1];
  return props.gallery;
});

const onInput = (e) => {
  const val = e.target.value === "" ? null : Number(e.target.value);
  emit("update:spend-input", val);
};
</script>

<style scoped>
/* Overlay */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 6vh 14px;
  z-index: 2000;
}

/* Card */
.modal-card {
  width: min(480px, 92vw);
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
  animation: fadeIn 0.18s ease;
}

/* Close */
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: #ffffffd8;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
}

/* Image */
.main-image-wrapper {
  width: 100%;
  max-height: 240px;
  overflow: hidden;
}
.main-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Title */
.activity-title {
  font-size: 20px;
  font-weight: 700;
  padding: 16px 18px 4px;
  color: #1e293b;
}

.visit-desc {
  padding: 0 18px 14px;
  font-size: 14px;
  color: #444;
}

/* Input */
.label {
  font-size: 12px;
  color: #6b7280;
  padding-left: 4px;
}
.input {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 6px 10px;
  gap: 6px;
}
.input input {
  border: none;
  outline: none;
  width: 100%;
}

/* Chips */
.quick-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip-btn {
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  padding: 4px 10px;
  font-size: 13px;
  background: #f3f4ff;
  cursor: pointer;
}
.chip-btn.ghost {
  background: #fff;
}

/* Comment */
.comment-box {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 6px 10px;
  font-size: 13px;
  resize: vertical;
}

/* Stats */
.stats-card {
  border-radius: 12px;
  background: #f3f4ff;
  padding: 10px 14px;
  margin-top: 4px;
}

/* Buttons */
.btn-row {
  display: flex;
  gap: 10px;
  padding: 0 2px 14px;
}
.btn {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
}
.btn.primary {
  background: #111827;
  color: #fff;
  border-color: #111827;
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
