<template>
  <div class="planner-container py-3 px-3">
    <PageHeader title="Supporter" subtitle="Real-time travel support and updates" icon="bi-chat-dots" />
    <!-- ✅ CHECKLIST SECTION -->

    <UploadSection icon="bi-journal-text" title="Today's Checklist" subtitle="Completion Rate">
      <template #actions>
        <div class="text-end">
          <div class="small text-muted">{{ completedCount }}/{{ checklist.length }}</div>
          <div class="progress progress-sm" style="width:160px;">
            <div class="progress-bar" role="progressbar" :class="isComplete ? 'bg-success' : 'bg-warning'"
              :style="{ width: progressWidth }" :aria-valuenow="completionPercent" aria-valuemin="0"
              aria-valuemax="100"></div>
          </div>
          <div class="small text-muted mt-1">{{ completionLabel }}</div>
        </div>
      </template>
      <ul class="list-unstyled mb-0">
        <li v-for="(item, idx) in checklist" :key="idx"
          class="checklist-item d-flex align-items-center p-3 mb-2 rounded" :class="{ 'checked-item': item.done }"
          @click="toggleItem(idx)" role="button">
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

    <!-- ✅ IMAGE-BASED TRAVEL AI (unchanged) -->
    <UploadSection icon="bi-camera" title="Image-based Travel AI" subtitle="Upload photo → Get recommendations">
      <div class="mb-3">
        <div class="small"><strong>How it works:</strong></div>
        <ol class="small text-muted mb-0 ps-3">
          <li>Upload your travel photo</li>
          <li>AI analyzes the image</li>
          <li>Get similar destination recommendations</li>
        </ol>
      </div>
      <label class="upload-area d-block mb-2" @dragover.prevent @drop.prevent="onDrop" for="imageInput"
        @click.prevent="goToImageAI">
        <div class="upload-gradient d-flex align-items-center justify-content-center">
          <div class="text-center text-white-50">
            <template v-if="imagePreview">
              <img :src="imagePreview" alt="preview" class="preview-img rounded" />
            </template>
            <template v-else>
              <i class="bi bi-camera fs-1"></i>
              <div class="mt-2">Tap to Upload & Discover</div>
            </template>
          </div>
        </div>
      </label>
    </UploadSection>

    <!-- ✅ RESTROOM SECTION (unchanged) -->

    <UploadSection icon="bi-people-fill" title="Nearby Public Restrooms" subtitle="Find nearby public restrooms">
      <div class="card mb-3 map-card p-3 shadow-sm border-0">
        <div class="map-gradient position-relative rounded">
          <div class="gps-center d-flex flex-column align-items-center justify-content-center">
            <i class="bi bi-send fs-1 text-primary"></i>
            <div class="text-primary small mt-1">GPS Loading...</div>
          </div>

          <i v-for="(m, i) in mapMarkers" :key="i" class="bi bi-people-fill restroom-icon text-primary"
            :style="{ left: m.left, top: m.top }"></i>
        </div>
      </div>
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
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import PageHeader from '@/components/common/PageHeader.vue';
import UploadSection from '@/components/travelgram/UploadSection.vue';

const router = useRouter();
const goToImageAI = () => {
  router.push({ name: 'SupporterImageAIHistory' });
};

// checklist data
const checklist = ref([
  { title: 'Camera battery fully charged?', done: false, highlight: true },
  { title: "Today's weather: Rainy / Bring umbrella 🌂", done: false, highlight: true },
  { title: 'Portable charger packed', done: false, highlight: false },
  { title: "Today's tip: OO Park - morning visit recommended", done: false, highlight: true },
  { title: 'Check transportation card balance', done: false, highlight: false },
  { title: 'Sunscreen & sunglasses', done: false, highlight: false },
]);

const toggleItem = (idx) => (checklist.value[idx].done = !checklist.value[idx].done);

const completedCount = computed(() => checklist.value.filter((c) => c.done).length);
const completionPercent = computed(() =>
  Math.round((completedCount.value / checklist.value.length) * 100)
);

const isComplete = computed(() => completedCount.value === checklist.value.length);
const progressWidth = computed(() => (isComplete.value ? '100%' : `${completionPercent.value}%`));
const completionLabel = computed(() =>
  isComplete.value ? '100% (Complete)' : `${completionPercent.value}%`
);

const imagePreview = ref(null);

const triggerFile = () => document.getElementById('imageInput').click();

const onFileChange = (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    imagePreview.value = ev.target.result;
  };
  reader.readAsDataURL(f);
};

const onDrop = (e) => {
  const f = e.dataTransfer.files && e.dataTransfer.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    imagePreview.value = ev.target.result;
  };
  reader.readAsDataURL(f);
};

const mapMarkers = ref([
  { left: '20%', top: '25%' },
  { left: '35%', top: '60%' },
  { left: '70%', top: '30%' },
  { left: '85%', top: '55%' },
]);

const restrooms = ref([
  { name: 'Gangnam Station Public Restroom', distance: '80m away', hours: '24/7' },
  { name: 'COEX Mall Restroom (B1F)', distance: '350m away', hours: '10:00 - 22:00' },
  { name: 'Bongeunsa Temple Restroom', distance: '520m away', hours: '05:00 - 21:00' },
]);

const todayString = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
</script>

<style scoped>
.planner-container {
  background: var(--background);
  color: var(--foreground);
  min-height: 100vh;
}

.container-fms {
  max-width: 980px;
  margin: 0 auto;
}

/* 카드 배경: 그라데이션 제거 — 연한 색(#fff9d6)으로 통일 */
.checklist-card {
  background: #fff9d6;
  border-radius: 12px;
  padding: 1rem;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* ruled lines 제거 (투명으로 처리) */
.checklist-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 56px;
  width: 100%;
  height: calc(100% - 56px);
  background: none;
  pointer-events: none;
  border-radius: 12px;
}

/* === Checklist items: EACH ITEM BACKGROUND IS WHITE === */
.checklist-item {
  background: #ffffff;
  border: 1px solid #ececec;
  cursor: pointer;
  transition: opacity 0.28s ease, transform 0.12s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

/* checked state: fade-out 유지, 배경은 단색 유지 */
.checklist-item.checked-item {
  opacity: 0.55;
  transform: scale(0.995);
  border-color: #d1fae5;
  background: rgba(255, 255, 255, 0.95);
}

/* item title / strike-through center (visual) */
.item-title {
  font-size: 15px;
  color: #222;
}

/* when checked: center strike-through line */
.item-title.checkedTitle {
  position: relative;
  color: #555;
}

.item-title.checkedTitle::after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1.6px;
  background: rgba(0, 0, 0, 0.6);
  transform: translateY(-50%);
}

/* circle check (단색: 연한 색(#34d399) 사용) */
.circle-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ease;
}

.circle-check.checked {
  background: #34d399;
  /* lighter of (#34d399,#059669) */
  border-color: #34d399;
}

.circle-check.checked::after {
  content: "✓";
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  line-height: 1;
}

/* image-ai, map, etc. — 그라데이션 제거하고 연한 색으로 통일 */
.image-ai-card {
  background: #fff;
}

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

.upload-area {
  display: block;
  cursor: pointer;
}

.upload-gradient {
  height: 120px;
  border-radius: 12px;
  background: #3A5797;
  /* lighter of (#f7d6ff,#ffd6e8) */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.upload-gradient .bi-camera {
  opacity: 0.85;
  font-size: 34px;
  color: inherit;
}

.map-card {
  background: transparent;
}

.map-gradient {
  height: 200px;
  background: #f3fffb;
  /* lighter of (#f3fffb,#eef6ff) */
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.gps-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.restroom-icon {
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 22px;
  opacity: 0.95;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 6px;
  padding: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.icon-box {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #f0f0f0;
}

/* progress success 단색(연한 색 사용) */
.progress-bar.bg-success {
  background: #7dd3a6 !important;
  /* lighter of (#7dd3a6,#10b981) */
}

.progress-sm {
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}
</style>
