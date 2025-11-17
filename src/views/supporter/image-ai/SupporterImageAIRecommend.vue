<template>
  <StepHeader title="Image-based Travel AI" subtitle="AI Analysis Complete" step="3/4"
    @back="router.push({ name: 'SupporterImageAIType' })" />
  <BaseSection icon="bi bi-images" title="AI Analysis Complete"
    :subtitle="`Found ${results.length} similar destinations`">
    <template #actions>
      <router-link class="btn btn-sm btn-outline-primary" :to="{ name: 'SupporterImageAINew' }">New
        Search</router-link>
    </template>

    <h5 class="mb-3">Recommended Destinations</h5>
    <div class="results-list">
      <div v-for="(r, i) in results" :key="i" class="result-card card mb-3 p-3"
        :class="{ selected: selectedIndex === i }" @click="select(i)" @keyup.enter.space.prevent="select(i)"
        role="button" tabindex="0" :aria-pressed="selectedIndex === i">
        <div class="d-flex align-items-center">
          <div class="thumb-wrap me-3 position-relative">
            <div class="thumb-bg rounded">
              <img :src="r.thumb" alt="thumb" class="thumb rounded" />
            </div>
            <div class="match-badge rounded-pill">{{ r.match }}%</div>
          </div>

          <div class="flex-fill">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="fw-semibold fs-6">{{ r.name }}</div>
                <div class="small text-muted mt-1">{{ r.desc }}</div>
              </div>
              <div class="text-end small text-muted d-none d-md-block">
                <div><i class="bi bi-geo-alt me-1"></i>{{ r.distance }}</div>
                <div class="mt-1 text-purple">Match: {{ r.match }}%</div>
              </div>
            </div>

            <div class="d-flex align-items-center mt-3 small text-muted d-md-none">
              <i class="bi bi-geo-alt me-1"></i>{{ r.distance }}
              <span class="ms-3 text-purple">Match: {{ r.match }}%</span>
            </div>
          </div>
        </div>

        <!-- visual selection indicator (right side) -->
        <div v-if="selectedIndex === i" class="select-check" aria-hidden="true">✓</div>
      </div>
    </div>
  </BaseSection>

    <div class="d-flex mt-2">
      <router-link class="btn btn-link" :to="{ name: 'SupporterImageAIType' }">Back</router-link>
      <button class="btn btn-primary ms-auto" :disabled="selectedIndex === null" @click="addPlan">
        Add Plan
      </button>
    </div>

</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import StepHeader from '@/components/common/StepHeader.vue'
import BaseSection from '@/components/common/BaseSection.vue'

const router = useRouter()
const selectedIndex = ref(null)

const results = [
  {
    id: 1,
    name: 'Gyeongbokgung Palace',
    desc: 'Traditional Korean architecture with beautiful gardens',
    match: 95,
    distance: '2.5km',
    thumb: '/sample/placeholder1.jpg'
  },
  {
    id: 2,
    name: 'Bukchon Hanok Village',
    desc: 'Historic Korean traditional village',
    match: 88,
    distance: '3.2km',
    thumb: '/sample/placeholder2.jpg'
  },
  {
    id: 3,
    name: 'N Seoul Tower',
    desc: 'Iconic tower with panoramic city views',
    match: 82,
    distance: '4.1km',
    thumb: '/sample/placeholder3.jpg'
  }
]

const select = (i) => {
  selectedIndex.value = i === selectedIndex.value ? null : i
}

const addPlan = () => {
  if (selectedIndex.value === null) return
  const item = results[selectedIndex.value]
  router.push({
    name: 'SupporterImageAISelectPlan',
    state: { item }
  })
}
</script>

<style scoped>
.results-card {
  background: #fff9ff;
  border-radius: 12px;
}

/* status icon */
.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #1b3b6f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
}

/* result card base */
.result-card {
  border-radius: 12px;
  background: #fff;
  border: 1px solid #f3e8ff;
  box-shadow: none;
  cursor: pointer;
  transition: box-shadow .15s, transform .06s, border-color .12s, background .12s;
  position: relative;
  overflow: visible;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

/* selected state: 남색(#1b3b6f)로 통일 */
.result-card.selected {
  border-color: #1b3b6f;
  box-shadow: 0 10px 30px rgba(27, 59, 111, 0.08);
  background: #f3f7ff;
  transform: translateY(-4px);
}

/* select check (right side) - 남색으로 통일 */
.select-check {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: #1b3b6f;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: 0 6px 18px rgba(27, 59, 111, 0.12);
  border: 2px solid rgba(255, 255, 255, 0.6);
}

/* thumbnail area */
.thumb-wrap {
  width: 84px;
  flex: 0 0 84px;
}

.thumb-bg {
  width: 84px;
  height: 84px;
  background: #f7f7f9;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #f0ecf8;
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* match badge: solid color (no gradient) */
.match-badge {
  position: absolute;
  left: 6px;
  top: 6px;
  background: #1b3b6f;
  color: #fff;
  padding: 6px 8px;
  font-size: 12px;
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(27, 59, 111, 0.12);
}

/* 선택 텍스트 색 통일 (클래스명 유지) */
.text-purple {
  color: #1b3b6f;
  font-weight: 600;
}

/* card rounding */
.card {
  border-radius: 12px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>