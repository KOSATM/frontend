<!-- src/components/planner/PlannerActivityDetailsModal.vue -->
<template>
  <teleport to="body">
    <div v-if="open" class="modal-backdrop" @click="$emit('close')">
      <div class="modal-card modal-wide" @click.stop>
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0 title">Activity Details</h5>
          <button
            class="btn btn-sm btn-light rounded-circle"
            @click="$emit('close')"
          >
            ✕
          </button>
        </div>

        <!-- 제목 -->
        <h6 class="mb-2 title">
          {{ data?.title || "Untitled Activity" }}
        </h6>

        <!-- 상단 정보 카드 -->
        <div class="info-card mb-3">
          <div class="row small">
            <div class="col-12 mb-2">
              <div class="label-row">
                <span>📍 Location</span>
              </div>
              <div class="value-row">
                {{ data?.area || "Seoul" }}<br />
                <span class="text-muted">{{ data?.address }}</span>
              </div>
            </div>
            <div class="col-md-6 col-12 mb-2">
              <div class="label-row">⏰ Hours</div>
              <div class="value-row">
                {{ data?.hours || "Check locally" }}
              </div>
            </div>
            <div class="col-md-6 col-12 mb-2">
              <div class="label-row">💰 Estimated Cost</div>
              <div class="value-row">
                {{
                  hasCost(data?.cost) ? formatCost(data?.cost) : "Free / N/A"
                }}
              </div>
            </div>
          </div>
        </div>

        <!-- 메인 그리드: 왼쪽 사진, 오른쪽 맵 -->
        <div class="grid">
          <!-- 📸 로컬 이미지 3장 스크롤 -->
          <div class="left">
            <div class="image-wrapper">
              <div class="image-strip">
                <div
                  v-for="(url, i) in localGallery"
                  :key="'local-' + i"
                  class="image-item"
                >
                  <img :src="url" :alt="`Default photo ${i + 1}`" />
                </div>
              </div>

              <!-- 점 인디케이터 -->
              <div class="carousel-dots">
                <span
                  v-for="n in localGallery.length"
                  :key="'dot-' + n"
                  class="dot"
                ></span>
              </div>
            </div>

            <!-- 🔍 구글 이미지 검색 링크 (옵션) -->
            <div v-if="data?.imageQuery" class="img-search-link-wrapper mt-1">
              <a
                :href="googleImageUrl(data.imageQuery)"
                target="_blank"
                rel="noreferrer"
                class="img-search-link"
              >
                🔍 More photos on Google Images
              </a>
            </div>
          </div>

          <!-- 🗺️ 지도 -->
          <div class="right">
            <div class="map ratio">
              <iframe
                :src="mapSrc(data)"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <!-- 맨 아래 설명 -->
        <p class="desc mt-3">
          {{ data?.desc || "No description provided yet." }}
        </p>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from "vue";
import defaultImg1 from "@/assets/planner/activity-default-1.jpg";
import defaultImg2 from "@/assets/planner/activity-default-2.jpg";
import defaultImg3 from "@/assets/planner/activity-default-3.jpg";

defineProps({
  open: { type: Boolean, default: false },
  data: { type: Object, default: null },
  spendInput: { type: Number, default: null },
});

defineEmits(["close", "save-spent", "open-replace", "update:spend-input"]);

// ✅ 무조건 이 세 장만 사용 (data.gallery는 안 씀)
const localGallery = ref([defaultImg1, defaultImg2, defaultImg3]);

const hasCost = (cost) => {
  return cost === 0 || (typeof cost === "number" && !Number.isNaN(cost));
};

const formatCost = (cost) => {
  if (cost === 0) return "Free";
  if (typeof cost === "number") return `$${cost}`;
  return "";
};

const mapSrc = (data) => {
  const q = encodeURIComponent(data?.address || data?.title || "Seoul");
  return `https://www.google.com/maps?q=${q}&output=embed`;
};

const googleImageUrl = (q) => {
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
    q || "Seoul travel"
  )}`;
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
  width: min(980px, 95vw);
  max-height: 88vh;
  overflow-y: auto;
  background: #fff;
  border-radius: 16px;
  padding: 20px 18px 18px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
  animation: pop 0.18s ease;
}
.modal-wide {
  width: min(1080px, 95vw);
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

/* 상단 정보 카드 */
.info-card {
  border-radius: 14px;
  background: #f3f4ff;
  padding: 14px 16px;
}
.label-row {
  font-weight: 600;
  margin-bottom: 4px;
}
.value-row {
  font-size: 13px;
}

/* 메인 레이아웃 */
.grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 16px;
  margin-top: 6px;
}

/* ✅ 로컬 이미지 3장 영역 */
.image-wrapper {
  border-radius: 16px;
  background: #020617;
  padding: 10px 10px 12px;
  min-height: 280px;
  display: flex;
  flex-direction: column;
}
.image-strip {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
}
.image-strip::-webkit-scrollbar {
  height: 6px;
}
.image-strip::-webkit-scrollbar-track {
  background: transparent;
}
.image-strip::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.8);
  border-radius: 999px;
}
.image-item {
  flex: 0 0 100%; /* 한 번에 한 장씩 */
  scroll-snap-align: center;
  border-radius: 12px;
  overflow: hidden;
  background: #111827;
}
.image-item img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  display: block;
}

/* 점 인디케이터 */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 6px;
}
.carousel-dots .dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.9);
}

/* 이미지 검색 링크 */
.img-search-link-wrapper {
  text-align: right;
}
.img-search-link {
  font-size: 11px;
  color: #2563eb;
  text-decoration: none;
}
.img-search-link:hover {
  text-decoration: underline;
}

/* 🗺️ 지도 */
.map.ratio {
  position: relative;
  padding-top: 70%;
  border-radius: 14px;
  overflow: hidden;
  background: #e5e7eb;
}
.map iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* 설명 (맨 아래 전체 폭) */
.desc {
  font-size: 14px;
  color: #4b5563;
  margin: 6px 2px 0;
  line-height: 1.5;
}

/* 버튼 (헤더 닫기용) */
.btn {
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
}

/* 폰트 */
.title {
  font-family: "Siganpyo", sans-serif;
}

/* 반응형 */
@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .image-item img {
    height: 220px;
  }
  .map.ratio {
    padding-top: 60%;
  }
}
</style>
