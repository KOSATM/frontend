<template>
  <div class="planner-container py-3 px-3">
    <PageHeader title="Supporter" subtitle="Real-time travel support and updates" icon="bi-chat-dots" />
    <!-- Weather component -->
    <div class="m-4">
      <!-- <WeatherCard /> -->
    </div>

    <!-- MAP wrapper: full width at top -->
    <div class="map-wrapper-full mb-4">
      <div class="map-top-row d-flex align-items-start justify-content-between mb-2">
        <nav class="browser-tabs" role="tablist" aria-label="Map tabs">
          <button role="tab" :aria-selected="currentTab === 'image'"
            :class="['tab-btn', { active: currentTab === 'image' }]" @click="currentTab = 'image'">
            Image-based Travel AI
          </button>
          <button role="tab" :aria-selected="currentTab === 'restroom'"
            :class="['tab-btn', { active: currentTab === 'restroom' }]" @click="currentTab = 'restroom'">
            Restrooms
          </button>
        </nav>

        <div class="map-file-label small text-muted" role="button" title="Files">
          <i class="bi bi-folder2-open-fill"></i>
        </div>
      </div>

      <div class="card map-container shadow-sm border-0 p-0 position-relative">
        <!-- Image 탭 지도 -->
        <NaverMap
          v-if="currentTab === 'image'"
          :markers="historyMarkers"
          :initialCenter="{ lat: 37.45, lng: 127.05 }"
          :initialZoom="11"
          :fitBoundsMode="true"
        />
        <!-- Restroom 탭 지도 -->
        <NaverMap 
          v-if="currentTab === 'restroom'"
          :markers="restroomMarkers"
          :initialCenter="{ lat: 37.365, lng: 127.105 }"
          :initialZoom="15"
          :fitBoundsMode="false"
        />
      </div>
    </div>

    <div class="row gx-4">
      <!-- LEFT COLUMN: weather + checklist -->

      <!-- Image UI (default) -->
      <div v-show="currentTab === 'image'">

        <BaseSection title="Image-based Travel AI" subtitle="Upload photo → Get recommendations">
          <template #icon>
            <div class="ai-badge"><i class="bi bi-camera-fill"></i></div>
          </template>

          <div class="image-ui-row d-flex gap-3 align-items-start">
            <div class="col how-works">
              <div class="small"><strong>How it works:</strong></div>
              <ol class="small text-muted mb-0 ps-3">
                <li>Upload your travel photo</li>
                <li>AI analyzes the image</li>
                <li>Get similar destination recommendations</li>
              </ol>
            </div>

            <div class="col upload-column d-flex">
              <label class="upload-control d-block" @dragover.prevent @drop.prevent="onDrop" for="imageInput"
                @click.prevent="goToImageAINew" title="Open Image AI">
                <div class="upload-gradient d-flex align-items-center justify-content-center h-100 w-100">
                  <div class="text-center text-white-50">
                    <template v-if="imagePreview">
                      <img :src="imagePreview" alt="preview" class="preview-img rounded" />
                    </template>
                    <template v-else>
                      <i class="bi bi-camera fs-1"></i>
                      <div class="mt-2 label-text">Upload</div>
                    </template>
                  </div>
                </div>
              </label>
            </div>

            <div class="col history-column d-flex">
              <label class="upload-control history-control d-block" @click.prevent="goToImageAIHistory" title="History">
                <div class="upload-gradient d-flex align-items-center justify-content-center h-100 w-100">
                  <div class="text-center text-white-50">
                    <i class="bi bi-clock-history fs-1"></i>
                    <div class="mt-2 label-text">History</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <input id="imageInput" type="file" accept="image/*" class="d-none" @change="onFileChange" />
          <div v-if="imagePreview" class="mt-3">
            <img :src="imagePreview" alt="preview" class="img-fluid rounded" />
          </div>
        </BaseSection>
      </div>

      <!-- Restrooms UI -->
      <div v-show="currentTab === 'restroom'">
        <BaseSection title="Nearby Public Restrooms" subtitle="Find nearby public restrooms">
          <template #icon>
            <div class="ai-badge"><i class="bi bi-people-fill"></i></div>
          </template>

          <div class="list-group">
            <a v-for="(r, i) in restrooms" :key="i" href="#"
              class="list-group-item list-group-item-action mb-2 d-flex align-items-center rounded border-0 shadow-sm">
              <div class="me-3 icon-box d-flex align-items-center justify-content-center">
                <i class="bi bi-people-fill text-primary fs-4"></i>
              </div>
              <div class="flex-fill">
                <div class="fw-medium">{{ r.name }}</div>
                <div class="small text-muted">
                  <i class="bi bi-geo-alt me-1"></i> {{ r.distance }} &nbsp; • &nbsp;
                  <i class="bi bi-clock me-1"></i> {{ r.hours }}
                </div>
              </div>
              <div class="ms-3 text-muted"><i class="bi bi-chevron-right"></i></div>
            </a>
          </div>
        </BaseSection>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseSection from '@/components/common/BaseSection.vue'
import WeatherCard from '@/components/supporter/WeatherCard.vue'
import NaverMap from '@/components/supporter/NaverMap.vue'

const router = useRouter()

// Map-related state
const currentTab = ref('image')

// 히스토리 마커 (Image 탭)
const historyMarkers = ref([
  { lat: 37.3595704, lng: 127.105399, title: '강남역' },
  { lat: 37.4979, lng: 127.0276, title: '서울역' },
  { lat: 37.5665, lng: 126.9780, title: '경복궁' },
  { lat: 37.5502, lng: 126.9754, title: '덕수궁' }
])

// 화장실 마커 (Restroom 탭)
const restroomMarkers = ref([
  { lat: 37.3595704, lng: 127.105399, title: 'Gangnam Station' },
  { lat: 37.3610, lng: 127.1070, title: 'COEX Mall' },
  { lat: 37.3680, lng: 127.1120, title: 'Bongeunsa Temple' }
])

const restrooms = ref([
  { name: 'Gangnam Station Public Restroom', distance: '80m away', hours: '24/7' },
  { name: 'COEX Mall Restroom (B1F)', distance: '350m away', hours: '10:00 - 22:00' },
  { name: 'Bongeunsa Temple Restroom', distance: '520m away', hours: '05:00 - 21:00' },
])

// image upload handling (for image-ui content)
const imagePreview = ref(null)
const triggerFile = () => document.getElementById('imageInput')?.click()
const onFileChange = (e) => {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    imagePreview.value = ev.target.result
  }
  reader.readAsDataURL(f)
}
const onDrop = (e) => {
  const f = e.dataTransfer.files && e.dataTransfer.files[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    imagePreview.value = ev.target.result
  }
  reader.readAsDataURL(f)
}

// quick route helper (kept for compatibility)
const goToImageAI = () => {
  router.push({ name: 'History' }).catch(() => { })
}
// navigator to open new Image AI page
const goToImageAINew = () => {
  router.push({ name: 'New' })
    .then(() => {
      // ensure we are at page top after navigation
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    })
    .catch(() => { })
}

const goToImageAIHistory = () => {
  router.push({ name: 'History' })
    .then(() => {
      // ensure we are at page top after navigation
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    })
    .catch(() => { })
}
</script>

<style scoped>
.planner-container {
  color: var(--foreground);
}

/* Weather card */
.weather-strip {
  margin-bottom: 16px;
}

.weather-card {
  border-radius: 8px;
  overflow: hidden;
}

.weather-top {
  background: #2f79b8;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.weather-top .weather-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}

.weather-top .temp-value {
  font-size: 36px;
  font-weight: 700;
}

.weather-top .temp-unit {
  font-size: 18px;
  margin-bottom: 6px;
}

.weather-top .desc {
  font-size: 14px;
  opacity: 0.95;
}

.weather-top .location {
  font-size: 12px;
  opacity: 0.85;
}

.weather-bottom {
  display: flex;
  background: #fff;
}

.weather-bottom .stat {
  padding: 12px 16px;
}

.weather-bottom .stat .stat-icon {
  font-size: 18px;
  color: #4b5563;
}

.weather-bottom .stat .stat-value {
  font-size: 16px;
  margin-top: 4px;
}

.weather-bottom .stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.weather-bottom .border-start {
  border-left: 1px solid rgba(0, 0, 0, 0.06);
}

.weather-bottom .border-end {
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.weather-strip .card {
  padding: 10px;
}

.weather-top {
  background: #3A5797;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 16px;
}

.weather-icon {
  /* icon size and positioning */
  font-size: 2.5rem;
  line-height: 1;
}

.temp-value {
  font-size: 2.5rem;
  line-height: 1;
  margin-right: 4px;
}

.desc {
  font-size: 0.9rem;
  opacity: 0.9;
}

.location {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* two-column spacing handled by Bootstrap .row/.col */

/* collapse animation for checklist */
/* (collapse styles removed) */

/* map card */
.map-container {
  min-height: 380px;
  overflow: visible;
  border-radius: 12px;
}

.map-gradient {
  height: 100%;
  background: #f3fffb;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

/* ensure map top bar (tabs) sits above map content */
.map-top-bar {
  z-index: 250;
  pointer-events: auto;
}

.map-top-bar .tab-btn {
  pointer-events: auto;
}

/* browser-style tabs (segmented control) placed above the map */
.browser-tabs {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.tab-btn {
  background: #fff;
  border: 1px solid rgba(2, 6, 23, 0.06);
  padding: 6px 12px;
  font-size: 0.9rem;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  box-shadow: 0 6px 14px rgba(6, 95, 70, 0.04);
  cursor: pointer;
  color: #374151;
  transition: transform .08s ease, box-shadow .12s ease;
}

.tab-btn.active {
  color: #0d6efd;
  font-weight: 600;
  transform: translateY(-4px);
  box-shadow: 0 14px 28px rgba(13, 110, 253, 0.08);
}

.tab-btn:focus {
  outline: 2px solid rgba(13, 110, 253, 0.12);
}

/* marker base */
.map-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 20px;
  z-index: 5;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* image marker style */
.marker-image {
  color: #fff;
  background: rgba(58, 87, 151, 0.95);
}

/* restroom marker overridden (keeps existing look) */
.marker-restroom {
  color: #0d6efd;
  background: rgba(255, 255, 255, 0.9);
}

/* gps center */
.gps-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
}

/* detail area */
.detail-area {
  min-height: 360px;
  border-radius: 12px;
}

/* BaseSection small tweaks */
.ai-badge {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #3A5797;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.upload-gradient {
  height: 120px;
  border-radius: 12px;
  background: #3A5797;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

/* history box: use site orange and ensure white icons/text */
.image-ui-row .history-column .upload-gradient {
  background: linear-gradient(180deg, #ff8c00 0%, #ff7a00 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.image-ui-row .history-column .upload-gradient .text-white-50,
.image-ui-row .history-column .upload-gradient i,
.image-ui-row .history-column .label-text {
  color: #ffffff !important;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

/* checklist wrapper styling */
.checklist-wrapper {
  cursor: pointer;
  user-select: none;
}

.checklist-wrapper :deep(.upload-header) {
  cursor: pointer;
  user-select: none;
}

.checklist-wrapper :deep(.upload-header):hover {
  opacity: 0.9;
}

.map-top-row {
  position: relative;
  z-index: 80;
}

.map-file-label {
  z-index: 85;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 10px;
  border-radius: 8px;
}

/* ensure map card is lower in stacking context than top row */
.map-container {
  position: relative;
  z-index: 10;
}

/* left column layout: make checklist : chat = 1 : 2 */
.col-md-4.d-flex.flex-column {
  /* total height approximates map (380) + detail (220) + gaps; adjust if your layout changes */
  min-height: 640px;
}

.col-md-4.d-flex.flex-column>.checklist-wrapper {
  flex: 1 1 0;
  min-height: 220px;
  /* ensure checklist area keeps consistent height */
  min-width: 0;
  /* allow proper flex overflow */
  overflow-y: auto;
}

.col-md-4.d-flex.flex-column>.flex-grow-1 {
  flex: 2 1 0;
  min-height: 360px;
  /* ensure chat area keeps consistent height */
  min-width: 0;
  overflow-y: auto;
}

.checklist-wrapper::-webkit-scrollbar {
  width: 8px;
}

.checklist-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.checklist-wrapper::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 4px;
}

/* memo-style background for checklist only */
.checklist-wrapper .upload-section {
  background: #fff9d6;
  /* pale paper yellow */
  border-color: rgba(0, 0, 0, 0.04);
  box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.03);
}

/* responsive adjustments */
@media (max-width: 991px) {

  .col-md-4,
  .col-md-8 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .map-gradient {
    height: 280px;
  }
}

/* Image UI layout tweaks */
@media (min-width: 0) {
  .image-ui-row {
    align-items: stretch;
    margin-top: 8px;
    min-height: 140px;
    height: 100%;
    display: flex;
  }

  /* explicit 2:1:1 ratio */
  .image-ui-row .how-works {
    flex: 2 2 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 0;
    gap: 8px;
    padding-right: 12px;
  }

  .image-ui-row .upload-column,
  .image-ui-row .history-column {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    align-items: stretch;
    justify-content: center;
  }

  .image-ui-row .col {
    min-width: 0;
  }

  /* make each column a column flex container so children can stretch to full height */
  .image-ui-row .col {
    display: flex;
    flex-direction: column;
  }

  /* ensure upload and history controls fill their column equally */
  .image-ui-row .upload-column .upload-control,
  .image-ui-row .history-column .upload-control {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
  }

  .image-ui-row .upload-column .upload-gradient,
  .image-ui-row .history-column .upload-gradient {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 140px;
    /* ensure both boxes have enough height and match */
  }
}
</style>