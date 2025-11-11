<template>
  <div class="p-4">
    <PageHeader title="Image-based Travel AI" subtitle="Use AI recommendation" />

    <div class="card p-4 mt-3 history-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">How would you like to use this?</h5>
        <router-link class="btn btn-sm btn-outline-primary" :to="{ name: 'SupporterImageAINew' }">New Search</router-link>
      </div>

      <div class="selected-place card p-3 mb-3 d-flex align-items-center">
        <img :src="item.thumb" class="thumb me-3" />
        <div>
          <div class="fw-medium">{{ item.name }}</div>
          <div class="small text-muted">{{ item.desc }}</div>
        </div>
        <div class="ms-auto small text-muted">{{ item.distance }}</div>
      </div>

      <ul class="list-unstyled">
        <li class="option p-3 mb-2 rounded d-flex align-items-center" @click="choose('add')">
          <div class="icon add me-3">＋</div>
          <div>
            <div class="fw-medium">Add to Itinerary</div>
            <div class="small text-muted">Add this place to your travel schedule</div>
          </div>
        </li>

        <li class="option p-3 mb-2 rounded d-flex align-items-center" @click="choose('replace')">
          <div class="icon replace me-3">↺</div>
          <div>
            <div class="fw-medium">Replace Existing</div>
            <div class="small text-muted">Replace an existing schedule item</div>
          </div>
        </li>

        <li class="option p-3 mb-2 rounded d-flex align-items-center" @click="choose('save')">
          <div class="icon save me-3">💾</div>
          <div>
            <div class="fw-medium">Save Only</div>
            <div class="small text-muted">Save for later without adding to schedule</div>
          </div>
        </li>
      </ul>

      <div class="d-flex mt-3">
        <router-link class="btn btn-link" :to="{ name: 'SupporterImageAIResults' }">Back</router-link>
        <button class="btn btn-primary ms-auto" :disabled="!selectedOption" @click="confirm">
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'

const route = useRoute()
const router = useRouter()

// get passed item from route.state (fallback to sample)
const item = route?.state?.item || {
  id: 0,
  name: 'Unknown Place',
  desc: '',
  distance: '',
  thumb: '/sample/placeholder1.jpg'
}

const selectedOption = ref(null)

const choose = (k) => {
  selectedOption.value = k
}

const confirm = () => {
  // 뼈대: 실제 일정 추가/교체 로직을 여기에 연결
  // 예시: store.dispatch('addToItinerary', { item, mode: selectedOption.value })
  router.push({ name: 'SupporterImageAIHistory' })
}
</script>

<style scoped>
.history-card { background: linear-gradient(180deg,#fff9ff,#f7eefc); border-radius:12px; }
.selected-place { border-radius:10px; background:#fff; border:1px solid #f3e8ff; }
.thumb { width:72px; height:72px; object-fit:cover; border-radius:8px; }
.option { background:#fff; border:1px solid #f3e8ff; cursor:pointer; }
.option .icon { width:48px;height:48px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:#f7f7ff;color:#6b46ff;font-weight:700;font-size:18px; }
.option:hover { box-shadow: 0 8px 20px rgba(167,139,255,0.06); transform: translateY(-2px); }
button:disabled { opacity:0.6; cursor:not-allowed; }
.card { border-radius:12px; }
</style>