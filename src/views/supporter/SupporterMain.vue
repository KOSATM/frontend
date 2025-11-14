<template>
  <div class="planner-container py-3 px-3">
    <PageHeader title="Supporter" subtitle="Real-time travel support and updates" icon="bi-chat-dots" />

    <div class="row gx-4">
      <!-- LEFT COLUMN: checklist (top) + chat (bottom) -->
      <div class="col-md-4 d-flex flex-column gap-3">
        <div class="checklist-wrapper">
          <UploadSection title="Today's Checklist" icon="bi-journal-text" class="checklist-header">
            <template #subtitle>
              <div class="text-end" @click.stop>
                <div class="small text-muted">{{ completedCount }}/{{ checklist.length }}</div>
                <div class="progress progress-sm" style="width:300px;">
                  <div class="progress-bar" role="progressbar" :class="isComplete ? 'bg-success' : 'bg-warning'"
                    :style="{ width: progressWidth }" :aria-valuenow="completionPercent" aria-valuemin="0"
                    aria-valuemax="100"></div>
                </div>
                <div class="small text-muted mt-1">{{ completionLabel }}</div>
              </div>
            </template>

            <ul class="list-unstyled mb-0" @click.stop>
              <li v-for="(item, idx) in sortedChecklist" :key="idx"
                class="checklist-item d-flex align-items-center p-3 mb-2 rounded" :class="{ 'checked-item': item.done }"
                @click="toggleItem(checklist.indexOf(item))" role="button">
                <div class="me-3">
                  <div class="circle-check" :class="{ checked: item.done }"></div>
                </div>
                <div class="flex-fill">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="item-title" :class="{ checkedTitle: item.done }">{{ item.title }}</span>
                    <div class="text-muted small">{{ item.hint || '' }}</div>
                  </div>
                </div>
              </li>
            </ul>
          </UploadSection>
        </div>
      </div>

      <!-- RIGHT COLUMN: map (top) + detail area (bottom) -->
      <div class="col-md-8 d-flex flex-column gap-3">
        <!-- MAP wrapper: tabs + file label sit above the card to avoid overlap -->
        <div class="map-wrapper">
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

            <!-- file label moved into top row so it's not positioned over map content -->
            <div class="map-file-label small text-muted" role="button" title="Files">
              <i class="bi bi-folder2-open-fill"></i>
            </div>
          </div>

          <div class="card map-container shadow-sm border-0 p-0 position-relative">
            <div class="map-gradient position-relative rounded" style="height:380px; overflow:visible;">
              <!-- image-history markers -->
              <template v-if="currentTab === 'image'">
                <i v-for="(m, i) in imageHistoryMarkers" :key="'img-' + i"
                  class="bi bi-camera-fill map-marker marker-image" :style="{ left: m.left, top: m.top }"
                  :title="m.title"></i>
              </template>

              <!-- restroom markers -->
              <template v-if="currentTab === 'restroom'">
                <i v-for="(m, i) in mapMarkers" :key="'rest-' + i"
                  class="bi bi-people-fill restroom-icon map-marker marker-restroom"
                  :style="{ left: m.left, top: m.top }" title="Restroom"></i>
              </template>

              <div class="gps-center d-flex flex-column align-items-center justify-content-center">
                <i class="bi bi-send fs-1 text-primary"></i>
                <div class="text-primary small mt-1">GPS Loading...</div>
              </div>
            </div>
          </div>
        </div>

        <!-- BOTTOM RIGHT: detail area that switches content -->
        <div class="card shadow-sm border-0 p-3 detail-area">
          <!-- Image UI (default) -->
          <div v-show="currentTab === 'image'">
            
            <UploadSection title="Image-based Travel AI" subtitle="Upload photo → Get recommendations">
              <template #icon>
                <div class="ai-badge"><i class="bi bi-camera-fill"></i></div>
              </template>

              <div class="image-ui-row d-flex gap-3 align-items-start">
                <div class="how-works flex-fill">
                  <div class="small"><strong>How it works:</strong></div>
                  <ol class="small text-muted mb-0 ps-3">
                    <li>Upload your travel photo</li>
                    <li>AI analyzes the image</li>
                    <li>Get similar destination recommendations</li>
                  </ol>
                </div>

                <div class="right-controls d-flex flex-row align-items-center justify-content-end">
                  <label class="upload-control me-3 d-block" @dragover.prevent @drop.prevent="onDrop" for="imageInput"
                    @click.prevent="goToImageAINew" title="Open Image AI">
                    <div class="upload-gradient d-flex align-items-center justify-content-center h-100 w-100">
                      <div class="text-center text-white-50">
                        <template v-if="imagePreview">
                          <img :src="imagePreview" alt="preview" class="preview-img rounded" />
                        </template>
                        <template v-else>
                          <i class="bi bi-camera fs-1"></i>
                          <div class="mt-2 label-text">Upload & Discover</div>
                        </template>
                      </div>
                    </div>
                  </label>

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
            </UploadSection>
          </div>

          <!-- Restrooms UI -->
          <div v-show="currentTab === 'restroom'">
            <UploadSection title="Nearby Public Restrooms" subtitle="Find nearby public restrooms">
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
            </UploadSection>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import UploadSection from '@/components/travelgram/UploadSection.vue'

const router = useRouter()

// LEFT: checklist
const checklist = ref([
  { title: 'Camera battery fully charged?', done: false, highlight: true },
  { title: "Today's weather: Rainy / Bring umbrella 🌂", done: false, highlight: true },
  { title: 'Portable charger packed', done: false, highlight: false },
  { title: "Today's tip: OO Park - morning visit recommended", done: false, highlight: true },
  { title: 'Check transportation card balance', done: false, highlight: false },
  { title: 'Sunscreen & sunglasses', done: false, highlight: false },
])
const toggleItem = (idx) => (checklist.value[idx].done = !checklist.value[idx].done)
const completedCount = computed(() => checklist.value.filter((c) => c.done).length)
const completionPercent = computed(() => Math.round((completedCount.value / checklist.value.length) * 100))
const isComplete = computed(() => completedCount.value === checklist.value.length)
const progressWidth = computed(() => (isComplete.value ? '100%' : `${completionPercent.value}%`))
const completionLabel = computed(() => (isComplete.value ? '100% (Complete)' : `${completionPercent.value}%`))
const sortedChecklist = computed(() => {
  const undone = checklist.value.filter(item => !item.done)
  const done = checklist.value.filter(item => item.done)
  return [...undone, ...done]
})

// RIGHT: map markers + tabs
const currentTab = ref('image') // 'image' or 'restroom'

// sample image-history markers (these would normally come from real history data)
const imageHistoryMarkers = ref([
  { left: '18%', top: '28%', title: 'Photo: Han River' },
  { left: '40%', top: '62%', title: 'Photo: Old Town' },
  { left: '72%', top: '33%', title: 'Photo: Market' },
])

// restroom markers (existing)
const mapMarkers = ref([
  { left: '20%', top: '25%' },
  { left: '35%', top: '60%' },
  { left: '70%', top: '30%' },
  { left: '85%', top: '55%' },
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
    // optionally push a new history marker (demo)
    imageHistoryMarkers.value.push({ left: '60%', top: '45%', title: 'New Photo' })
  }
  reader.readAsDataURL(f)
}
const onDrop = (e) => {
  const f = e.dataTransfer.files && e.dataTransfer.files[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    imagePreview.value = ev.target.result
    imageHistoryMarkers.value.push({ left: '60%', top: '45%', title: 'Dropped Photo' })
  }
  reader.readAsDataURL(f)
}

// quick route helper (kept for compatibility)
const goToImageAI = () => {
  router.push({ name: 'SupporterImageAIHistory' }).catch(() => { })
}
// navigator to open new Image AI page
const goToImageAINew = () => {
  router.push({ name: 'SupporterImageAINew' })
    .then(() => {
      // ensure we are at page top after navigation
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    })
    .catch(() => { })
}

const goToImageAIHistory = () => {
  router.push({ name: 'SupporterImageAIHistory' })
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

/* UploadSection small tweaks */
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

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

/* checklist visuals (kept) */
.checklist-item {
  background: #fff;
  border: 1px solid #ececec;
  cursor: pointer;
  transition: opacity .28s ease, transform .12s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.checklist-item.checked-item {
  opacity: .55;
  transform: scale(.995);
  border-color: #d1fae5;
  background: rgba(255, 255, 255, 0.95);
}

.item-title {
  font-size: 15px;
  color: #222;
}

.item-title.checkedTitle {
  position: relative;
  color: #555;
  text-decoration: line-through;
}

.circle-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all .18s ease;
}

.circle-check.checked {
  background: #34d399;
  border-color: #34d399;
}

.circle-check.checked::after {
  content: "✓";
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  line-height: 1;
}

/* PlannerChat: allow component to manage its own layout (removed forced positioning/margin rules) */

/* MAP wrapper top row */
.map-wrapper {
  position: relative;
}

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
  min-height: 220px; /* ensure checklist area keeps consistent height */
  min-width: 0;
  /* allow proper flex overflow */
  overflow-y: auto;
}

.col-md-4.d-flex.flex-column>.flex-grow-1 {
  flex: 2 1 0;
  min-height: 360px; /* ensure chat area keeps consistent height */
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
.image-ui-row { align-items: stretch; margin-top: 8px; min-height: 230px; height: 100%; }
.image-ui-row .how-works { max-width: 56%; display: flex; flex-direction: column; justify-content: flex-end; margin-top: 25px;}

/* reduce text size to match Upload button label and tighten spacing */
.image-ui-row .how-works .small strong { font-size: 1.1rem; }
.image-ui-row .how-works ol { margin-top: 0.6rem; }
.image-ui_row .how-works ol li { font-size: 0.9rem; line-height: 1.45; margin-bottom: 6px; }

/* ensure list-group (restrooms) uses same min-height so both tabs match */
.detail-area .list-group { min-height: 230px; }

/* ensure the right side action boxes align their bottom with the left column */
.right-controls { display: flex; gap: 18px; align-items: flex-end; }

.upload-control {
  width: 160px;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  background: transparent;
}
.upload-control .upload-gradient { height: 100%; border-radius: 16px; }
.upload-control .preview-img { width: 100%; height: 100%; object-fit: cover; }
.upload-control i { font-size: 2.2rem; opacity: 0.95; }
.upload-control .label-text { font-size: 1rem; margin-top: 8px; color: rgba(255,255,255,0.95); }

/* make sure smaller screens still behave */
@media (max-width: 991px) {
  .upload-control { width: 120px; height: 120px; }
  .image-ui-row .how-works { max-width: 100%; }
}

/* ensure only history control uses the orange gradient */
.history-control .upload-gradient {
  background: #ff8c00 !important;
}
.history-control .label-text {
  color: #ffffff !important;
}
</style>