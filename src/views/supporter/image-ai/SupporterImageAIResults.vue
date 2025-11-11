<template>
  <div class="p-4">
    <PageHeader title="Image-based Travel AI" subtitle="AI Analysis Complete" />

    <div class="card p-4 mt-3 results-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center gap-3">
          <div class="status-icon">
            <i class="bi bi-image-fill"></i>
          </div>
          <div>
            <div class="h6 mb-0">AI Analysis Complete</div>
            <div class="small text-muted">Found {{ results.length }} similar destinations</div>
          </div>
        </div>

        <div>
          <router-link class="btn btn-sm btn-outline-primary" :to="{ name: 'SupporterImageAINew' }">New Search</router-link>
        </div>
      </div>

      <h5 class="mb-3">Recommended Destinations</h5>

      <div class="results-list">
        <div
          v-for="(r, i) in results"
          :key="i"
          class="result-card card mb-3 p-3"
          :class="{ selected: selectedIndex === i }"
          @click="select(i)"
          role="button"
        >
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
        </div>
      </div>

      <div class="d-flex mt-2">
        <router-link class="btn btn-link" :to="{ name: 'SupporterImageAIType' }">Back</router-link>
        <button class="btn btn-primary ms-auto" :disabled="selectedIndex === null" @click="addPlan">
          Add Plan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'

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
    name: 'SupporterImageAIAddPlan',
    state: { item }
  })
}
</script>

<style scoped>
.results-card { background: #FFD9A6; border-radius:12px; }
.status-icon {
  width:48px;height:48px;border-radius:10px;background:#1b3b6f;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;
}
.result-card { border-radius:12px; background:#fff; border:1px solid #f3e8ff; box-shadow: none; cursor: pointer; transition: box-shadow .15s, transform .06s; }
.result-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.05); }
.result-card.selected { border-color: #A78BFA; box-shadow: 0 8px 20px rgba(167,139,255,0.08); }
.thumb-wrap { width:84px; flex:0 0 84px; }
.thumb-bg { width:84px; height:84px; background:#f7f7f9; display:flex; align-items:center; justify-content:center; border-radius:10px; overflow:hidden; border:1px solid #f0ecf8; }
.thumb { width:100%; height:100%; object-fit:cover; display:block; }
.match-badge {
  position:absolute; left:6px; top:6px; background:linear-gradient(135deg,#1b3b6f,#A78BFA); color:#fff; padding:6px 8px; font-size:12px; border-radius:999px;
  box-shadow: 0 4px 10px rgba(167,139,255,0.16);
}
.text-purple { color:#a56bff; font-weight:600; }
.card { border-radius:12px; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
</style>