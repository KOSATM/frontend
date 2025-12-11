<!-- src/components/planner/PlannerActivityCompleteModal.vue -->
<template>
  <teleport to="body">
    <div v-if="open" class="modal-backdrop" @click="$emit('close')">
      <div class="modal-card" @click.stop>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0 title">Complete Activity</h5>
          <button
            class="btn btn-sm btn-light rounded-circle"
            @click="$emit('close')"
          >
            ✕
          </button>
        </div>

        <p class="mb-2 sub">
          How was your visit to <strong>{{ title }}</strong
          >?
        </p>

        <!-- 비용 입력 -->
        <label class="label">Actual Cost (Optional)</label>
        <div class="input mb-2">
          <span>$</span>
          <input
            type="number"
            min="0"
            step="1"
            :value="spendInput"
            @input="onInput"
          />
          <span>USD</span>
        </div>

        <!-- 빠른 입력 버튼 -->
        <div class="quick-amounts mb-3">
          <button
            v-for="v in [5, 10, 20, 30]"
            :key="v"
            type="button"
            class="chip-btn"
            @click="$emit('update:spend-input', v)"
          >
            ${{ v }}
          </button>
          <button
            type="button"
            class="chip-btn ghost"
            @click="$emit('update:spend-input', null)"
          >
            Clear
          </button>
        </div>

        <!-- 코멘트 -->
        <label class="label">Quick note (Optional)</label>
        <textarea
          class="comment-box mb-3"
          rows="2"
          :value="comment"
          placeholder="Any highlights, issues, or thoughts?"
          @input="$emit('update:comment', $event.target.value)"
        ></textarea>

        <!-- Quick Stats -->
        <div class="stats-card mb-3">
          <div class="sub small fw-semibold mb-2">Quick Stats</div>
          <div class="row small">
            <div class="col-6 mb-1">
              <span class="text-muted">Started:</span>
              <div>{{ quickStats?.started }}</div>
            </div>
            <div class="col-6 mb-1">
              <span class="text-muted">Duration:</span>
              <div>{{ quickStats?.duration }}</div>
            </div>
            <div class="col-12 mt-2">
              <span class="text-muted">Status:</span>
              <div class="text-success fw-semibold">
                {{ quickStats?.status }}
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <button class="btn flex-fill me-2" @click="$emit('close')">
            Cancel
          </button>
          <button class="btn primary flex-fill" @click="$emit('confirm')">
            Complete Activity
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: "" },
  spendInput: { type: Number, default: null },
  comment: { type: String, default: "" },
  quickStats: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["close", "confirm", "update:spend-input", "update:comment"]);

const onInput = (e) => {
  const val = e.target.value === "" ? null : Number(e.target.value);
  emit("update:spend-input", val);
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 6vh 14px;
  z-index: 10000;
}
.modal-card {
  width: min(520px, 92vw);
  background: #fff;
  border-radius: 16px;
  padding: 20px 18px 18px;
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

.label {
  font-size: 12px;
  color: #6b7280;
}
.input {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 6px 8px;
  gap: 6px;
}
.input input {
  border: 0;
  outline: 0;
  width: 100%;
}

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

.comment-box {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 6px 8px;
  font-size: 13px;
  resize: vertical;
}

.stats-card {
  border-radius: 12px;
  background: #f3f4ff;
  padding: 10px 12px;
}

.btn {
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


</style>
