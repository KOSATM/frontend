<template>
  <div class="modal-backdrop" @click="$emit('close')">
    <div class="modal-card modal-wide" @click.stop>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="mb-0">{{ data?.title || "Activity details" }}</h6>
        <button class="btn btn-sm btn-light rounded-circle" @click="$emit('close')">✕</button>
      </div>

      <!-- 상단: 지도 + 이미지 -->
      <div class="details-hero mb-3">
        <div class="hero-map">
          <div class="map-placeholder">🗺️ Map Preview</div>
        </div>
        <div class="hero-gallery">
          <div class="gallery-strip">
            <img v-for="(src, i) in data?.gallery || []" :key="'img-' + i" :src="src" alt="place" />
            <div v-if="!data?.gallery?.length" class="img-ph">No images</div>
          </div>
        </div>
      </div>

      <!-- 정보 -->
      <div class="row g-3">
        <div class="col-12 col-md-7">
          <div class="mb-2">
            <div class="small text-muted">Address</div>
            <div>{{ data?.address || "—" }}</div>
          </div>
          <div class="d-flex flex-wrap gap-2 mb-2">
            <span class="soft-chip"><span class="chip-emoji">⏰</span> {{ data?.hours || "Hours not available" }}</span>
            <span v-if="hasCost(data?.cost)" class="soft-chip"><span class="chip-emoji">💰</span> {{ formatCost(data?.cost) }}</span>
            <span class="soft-chip"><span class="chip-emoji">📍</span> {{ data?.area || "Seoul" }}</span>
          </div>
          <p class="small text-muted mb-0">{{ data?.desc || "Short description is not provided yet." }}</p>
        </div>

        <!-- 실제 지출 입력: 읽기 전용이면 숨김 -->
        <div class="col-12 col-md-5" v-if="!readOnly">
          <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body">
              <label class="form-label small text-muted">Record your spend</label>
              <div class="input-group mb-2">
                <span class="input-group-text">$</span>
                <input type="number" min="0" step="1" class="form-control" v-model.number="localSpend" />
              </div>
              <button class="btn btn-primary w-100" @click="save">Save Spent</button>
              <div v-if="saved" class="text-success small mt-2">Saved ✔</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단 액션 -->
      <div class="d-flex justify-content-end gap-2 mt-3">
        <button class="btn btn-light" @click="$emit('close')">Close</button>
        <button class="btn btn-outline-danger" v-if="!readOnly" @click="$emit('open-replace')">Delete / Replace</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActivityDetailsModal",
  props: {
    data: Object,
    spendInput: Number,
    saved: Boolean,
    readOnly: { type: Boolean, default: false },
  },
  emits: ["close", "save-spent", "open-replace"],
  data() {
    return { localSpend: this.spendInput ?? null };
  },
  watch: {
    spendInput(v) {
      this.localSpend = v ?? null;
    },
  },
  methods: {
    save() {
      this.$emit("save-spent", this.localSpend);
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
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 8vh 14px;
  z-index: 1050;
}
.modal-card {
  width: min(560px, 92vw);
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  animation: pop 0.2s ease;
}
.modal-card.modal-wide {
  width: min(980px, 96vw);
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

.details-hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 12px;
}
.hero-map {
  border-radius: 12px;
  overflow: hidden;
  background: #eef3ff;
  min-height: 220px;
}
.map-placeholder {
  width: 100%;
  height: 100%;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b5bdb;
  font-weight: 600;
  background: repeating-linear-gradient(-45deg, #eef3ff, #eef3ff 10px, #f6f9ff 10px, #f6f9ff 20px);
}
.hero-gallery {
  border-radius: 12px;
  overflow: hidden;
  background: #fafbfc;
}
.gallery-strip {
  display: flex;
  gap: 8px;
  padding: 8px;
  overflow: auto;
}
.gallery-strip img {
  height: 220px;
  border-radius: 10px;
  display: block;
}
.img-ph {
  height: 220px;
  border-radius: 10px;
  background: #f1f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #868e96;
  padding: 0 16px;
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
