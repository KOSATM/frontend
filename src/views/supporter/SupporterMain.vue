<template>
  <div class="container-fms py-5">
    <PageHeader
      title="Supporter"
      subtitle="Real-time travel support and updates"
      icon="bi-chat-dots"
    />

    <!-- ✅ CHECKLIST SECTION -->
    <section class="mb-4">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h4 class="mb-1">Today's Travel Assistant</h4>
          <small class="text-muted">{{ todayString }}</small>
        </div>
        <div class="text-end">
          <small class="text-muted">{{ completedCount }}/{{ checklist.length }}</small>
        </div>
      </div>

      <div class="card shadow-sm border-0 p-3 checklist-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="d-flex align-items-center gap-2">
            <span class="fs-5">📋</span>
            <div>
              <strong>Today's Checklist</strong>
              <div class="text-muted small">Completion Rate</div>
            </div>
          </div>
          <div class="text-end">
            <div class="small text-muted">{{ completedCount }}/{{ checklist.length }}</div>
            <div class="progress progress-sm" style="width:160px;">
              <div
                class="progress-bar"
                role="progressbar"
                :class="isComplete ? 'bg-success' : 'bg-warning'"
                :style="{ width: progressWidth }"
                :aria-valuenow="completionPercent"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <div class="small text-muted mt-1">{{ completionLabel }}</div>
          </div>
        </div>

        <ul class="list-unstyled mb-0">
          <li
            v-for="(item, idx) in checklist"
            :key="idx"
            class="checklist-item d-flex align-items-center p-3 mb-2 rounded"
            :class="{ 'checked-item': item.done }"
            @click="toggleItem(idx)"
            role="button"
          >
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
      </div>
    </section>

    <!-- ✅ IMAGE-BASED TRAVEL AI (unchanged) -->
    <section class="mb-4">
      <div class="card shadow-sm border-0 p-3 image-ai-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="d-flex align-items-center gap-2">
            <div class="ai-badge"><i class="bi bi-camera-fill fs-4"></i></div>
            <div>
              <strong>Image-based Travel AI</strong>
              <div class="text-muted small">Upload photo → Get recommendations</div>
            </div>
          </div>
          <div>
            <i class="bi bi-chevron-right text-muted"></i>
          </div>
        </div>

        <div class="mb-3">
          <div class="small"><strong>How it works:</strong></div>
          <ol class="small text-muted mb-0 ps-3">
            <li>Upload your travel photo</li>
            <li>AI analyzes the image</li>
            <li>Get similar destination recommendations</li>
          </ol>
        </div>

        <label
          class="upload-area d-block mb-2"
          @dragover.prevent
          @drop.prevent="onDrop"
          for="imageInput"
          @click.prevent="goToImageAI"
        >
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

        <div class="d-grid">
          <input id="imageInput" type="file" accept="image/*" class="d-none" @change="onFileChange" />
          <button class="btn btn-primary" @click.prevent="goToImageAI">
            <i class="bi bi-camera me-2"></i> Tap to Upload & Discover
          </button>
        </div>

        <div v-if="imagePreview" class="mt-3">
          <img :src="imagePreview" alt="preview" class="img-fluid rounded" />
        </div>
      </div>
    </section>

    <!-- ✅ RESTROOM SECTION (unchanged) -->
    <section>
      <h5 class="mb-3"><i class="bi bi-people-fill me-2"></i>Nearby Public Restrooms</h5>

      <div class="card mb-3 map-card p-3 shadow-sm border-0">
        <div class="map-gradient position-relative rounded">
          <div class="gps-center d-flex flex-column align-items-center justify-content-center">
            <i class="bi bi-send fs-1 text-primary"></i>
            <div class="text-primary small mt-1">GPS Loading...</div>
          </div>

          <i
            v-for="(m, i) in mapMarkers"
            :key="i"
            class="bi bi-people-fill restroom-icon text-primary"
            :style="{ left: m.left, top: m.top }"
          ></i>
        </div>
      </div>

      <div class="list-group">
        <a
          v-for="(r, i) in restrooms"
          :key="i"
          href="#"
          class="list-group-item list-group-item-action mb-2 d-flex align-items-center rounded border-0 shadow-sm"
        >
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
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import PageHeader from '@/components/common/PageHeader.vue';

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
.container-fms {
  max-width: 980px;
  margin: 0 auto;
}

/* 카드 배경: 연노란(포스트잇) 느낌 유지 */
.checklist-card {
  background: linear-gradient(90deg, #fff9d6, #fff2a8);
  border-radius: 12px;
  padding: 1rem;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

/* subtle ruled lines on card (optional) */
.checklist-card::before{
  content: "";
  position: absolute;
  left: 0;
  top: 56px;
  width: 100%;
  height: calc(100% - 56px);
  background-image: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 28px,
    rgba(0,0,0,0.03) 29px
  );
  pointer-events: none;
  border-radius: 12px;
}

/* === Checklist items: EACH ITEM BACKGROUND IS WHITE === */
.checklist-item {
  background: #ffffff;               /* <--- 핵심: 항목 배경 흰색 */
  border: 1px solid #ececec;
  cursor: pointer;
  transition: opacity 0.28s ease, transform 0.12s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

/* checked state: fade-out via opacity, but keep white background */
.checklist-item.checked-item {
  opacity: 0.55;              /* 페이드 아웃 효과 */
  transform: scale(0.995);
  border-color: #d1fae5;      /* very subtle green border */
  background: rgba(255,255,255,0.95); /* still appears white */
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
  background: rgba(0, 0, 0, 0.6); /* green line to match check */
  transform: translateY(-50%);
}

/* circle check (green when checked) */
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
  background: linear-gradient(90deg, #34d399, #059669);
  border-color: #059669;
}
.circle-check.checked::after {
  content: "✓";
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  line-height: 1;
}

/* keep the rest of layout styling intact (image-ai, map, etc.) */
.image-ai-card { background: #fff; }
.ai-badge{
  width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#ff9ad1,#a78bff);display:flex;align-items:center;justify-content:center;color:#fff;
}
.upload-area { display:block; cursor: pointer; }
.upload-gradient {
  height:120px;
  border-radius:12px;
  background: linear-gradient(90deg,#f7d6ff,#ffd6e8);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);
}
.upload-gradient .bi-camera { opacity: 0.85; font-size: 34px; }

.map-card { background: transparent; }
.map-gradient {
  height:200px;
  background: linear-gradient(90deg,#f3fffb,#eef6ff);
  border-radius:12px;
  position:relative;
  overflow:hidden;
}
.gps-center {
  position:absolute;
  left:50%; top:50%;
  transform:translate(-50%,-50%);
  text-align:center;
}
.restroom-icon {
  position:absolute;
  transform: translate(-50%,-50%);
  font-size:22px;
  opacity:0.95;
  background: rgba(255,255,255,0.85);
  border-radius:6px;
  padding:6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}
.icon-box {
  width:56px;height:56px;border-radius:10px;background:#fff;border:1px solid #f0f0f0;
}

.progress-bar.bg-success {
  background: linear-gradient(90deg,#7dd3a6,#10b981) !important;
}
.progress-sm { height: 8px; border-radius: 4px; overflow: hidden; }
</style>
