<template>
  <teleport to="body">
    <div v-if="open" class="modal-backdrop" @click="$emit('close')">
      <div class="modal-card" @click.stop>
        <!-- Header -->
        <div class="modal-header">
          <h3 class="modal-title">Delete Activity?</h3>
          <button class="icon-close" @click="$emit('close')">✕</button>
        </div>

        <!-- Description -->
        <p class="modal-desc">
          정말
          <strong>{{ target?.title || "this activity" }}</strong
          >을/를 삭제하시겠습니까?
        </p>

        <p class="modal-subdesc">
          저희가 유사한 장소를 추천해드릴게요
        </p>

        <!-- Alternatives -->
        <div class="alt-list">
          <div
            v-for="(alt, i) in alternatives"
            :key="'alt-' + i"
            class="alt-card"
            @click="$emit('preview-alt', alt)"
          >
            <div class="alt-row">
              <!-- Thumbnail -->
              <div class="alt-thumb">
                <img
                  v-if="alt.image || alt.thumbnail"
                  :src="alt.image || alt.thumbnail"
                  alt="place thumbnail"
                />
                <div v-else class="alt-thumb-fallback">📍</div>
              </div>

              <!-- Body -->
              <div class="alt-body">
                <div class="alt-title">{{ alt.title }}</div>

                <!-- 👇 장소 한줄 설명 -->
                <div class="alt-desc">
                  {{ alt.shortDesc || alt.desc || "Recommended nearby place" }}
                </div>
              </div>
            </div>

            <!-- CTA -->
            <button
              class="replace-cta"
              @click.stop="$emit('apply-replacement', alt)"
            >
              해당 장소로 대체
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn-cancel" @click="$emit('close')">취소</button>
          <button class="btn-delete" @click="$emit('delete-anyway')">
            그래도 삭제
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>


<script setup>
defineProps({
  open: { type: Boolean, default: false },
  target: { type: Object, default: null },
  alternatives: { type: Array, default: () => [] },
});

defineEmits(["close", "preview-alt", "apply-replacement", "delete-anyway"]);

const hasCost = (cost) => {
  return cost === 0 || (typeof cost === "number" && !Number.isNaN(cost));
};

const formatCost = (cost) => {
  if (cost === 0) return "Free";
  if (typeof cost === "number") return `$${cost}`;
  return "";
};
</script>

<style scoped>
/* ===============================
   Overlay
=============================== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 7vh 16px;
  z-index: 10000;
}

/* ===============================
   Modal Card
=============================== */
.modal-card {
  width: min(560px, 94vw);
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 22px 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
  animation: pop 0.18s ease;
}

@keyframes pop {
  from {
    transform: translateY(-8px);
    opacity: 0.9;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ===============================
   Header
=============================== */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.modal-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  color: #0f172a;
}

.icon-close {
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  color: #94a3b8;
  padding: 6px;
}

.icon-close:hover {
  color: #64748b;
}

/* ===============================
   Copy Text
=============================== */
.modal-desc {
  margin: 0 0 12px;
  color: #334155;
  font-size: 15px;
  line-height: 1.6;
}

.modal-subdesc {
  margin: 0 0 18px;
  color: #64748b;
  font-size: 14.5px;
}

/* ===============================
   Alternatives List
=============================== */
.alt-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.alt-card {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  background: #ffffff;
  cursor: pointer;
}

.alt-card:hover {
  background: #fafafa;
}

/* ===============================
   Alternative Row
=============================== */
.alt-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

/* ===============================
   Thumbnail (Image)
=============================== */
.alt-thumb {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  overflow: hidden;
  background: #f1f5f9;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alt-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.alt-thumb-fallback {
  font-size: 22px;
  color: #64748b;
}

/* ===============================
   Body Text
=============================== */
.alt-body {
  flex: 1;
  min-width: 0;
}

.alt-title {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
}

.alt-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.55;
}

/* ===============================
   Replace CTA
=============================== */
.replace-cta {
  width: 100%;
  margin-top: 14px;
  border: none;
  border-radius: 14px;
  padding: 14px;
  font-weight: 700;
  font-size: 14.5px;
  cursor: pointer;
  background: #eef6ff;
  color: #2563eb;
}

.replace-cta:hover {
  background: #e6f0ff;
}

/* ===============================
   Footer Buttons
=============================== */
.modal-footer {
  display: flex;
  gap: 16px;
  margin-top: 22px;
}

.btn-cancel,
.btn-delete {
  flex: 1;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-weight: 800;
  cursor: pointer;
  font-size: 15px;
}

.btn-cancel {
  background: #f3f4f6;
  color: #334155;
}

.btn-cancel:hover {
  background: #eceef2;
}

.btn-delete {
  background: #ffecec;
  color: #ef4444;
}

.btn-delete:hover {
  background: #ffe2e2;
}

</style>
