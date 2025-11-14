<!-- src/components/planner/PlannerReplaceModal.vue -->
<template>
  <teleport to="body">
    <div v-if="open" class="modal-backdrop" @click="$emit('close')">
      <div class="modal-card" @click.stop>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="mb-0">Replace</h6>
          <button
            class="btn btn-sm btn-light rounded-circle"
            @click="$emit('close')"
          >
            ✕
          </button>
        </div>

        <p class="small text-muted mb-3">
          Choose a replacement for
          <strong>{{ target?.title }}</strong>
        </p>

        <div class="list-group">
          <div
            v-for="(alt, i) in alternatives"
            :key="'alt-' + i"
            class="list-group-item border-0 shadow-sm rounded-3 mb-2 alt-row"
            @click="$emit('preview-alt', alt)"
          >
            <div class="d-flex align-items-center gap-3">
              <div
                class="icon-badge themed"
                :class="'theme-' + (alt.type || 'default')"
              >
                {{ getIconForType(alt.type) }}
              </div>
              <div class="flex-grow-1">
                <div class="fw-semibold small">{{ alt.title }}</div>
                <div class="d-flex align-items-center gap-2 small text-muted">
                  <span class="soft-chip">
                    <span class="chip-emoji">⏰</span> {{ alt.time }}
                  </span>
                  <span v-if="hasCost(alt.cost)" class="soft-chip">
                    <span class="chip-emoji">💰</span>
                    {{ formatCost(alt.cost) }}
                  </span>
                </div>
              </div>
              <button
                class="btn btn-sm btn-outline-primary rounded-pill"
                @click.stop="$emit('apply-replacement', alt)"
              >
                Replace
              </button>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between mt-3">
          <button class="btn btn-light" @click="$emit('close')">Cancel</button>
          <button class="btn btn-danger" @click="$emit('delete-anyway')">
            Delete anyway
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  name: "PlannerReplaceModal",
  props: {
    open: { type: Boolean, default: false },
    target: { type: Object, default: null },
    alternatives: { type: Array, default: () => [] },
  },
  emits: ["close", "preview-alt", "apply-replacement", "delete-anyway"],
  methods: {
    getIconForType(type) {
      const map = {
        cafe: "☕",
        food: "🍜",
        brunch: "🥞",
        dessert: "🍰",
        palace: "🏯",
        museum: "🏛️",
        tower: "🗼",
        walk: "🚶",
        shopping: "🛍️",
        market: "🧺",
        view: "🌇",
        default: "📍",
      };
      return map[type] || map.default;
    },
    hasCost(cost) {
      return cost === 0 || (typeof cost === "number" && !Number.isNaN(cost));
    },
    formatCost(cost) {
      if (cost === 0) return "Free";
      if (typeof cost === "number") return `$${cost}`;
      return "";
    },
  },
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
  width: min(560px, 92vw);
  background: #fff;
  border-radius: 16px;
  padding: 16px;
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
.alt-row {
  cursor: pointer;
}
.alt-row:hover {
  background: #fffdf8;
}

/* 버튼 공통 */
.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
}

/* 아이콘/칩 스타일 (리스트와 동일하게) */
.icon-badge.themed {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  user-select: none;
}
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
