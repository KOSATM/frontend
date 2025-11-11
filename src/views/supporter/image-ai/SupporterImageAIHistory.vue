// filepath: c:\kosa-course\userProject\ATM\projects\frontend\src\views\supporter\image-ai\SupporterImageAIHistory.vue
<template>
  <div class="p-4">
    <PageHeader title="Image-based Travel AI" subtitle="Find destinations from your photos" />
    <div class="card p-4 mt-3 history-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">AI Recommendation History</h5>
        <router-link class="btn btn-sm btn-primary" :to="{ name: 'SupporterImageAINew' }">+ New Search</router-link>
      </div>

      <div class="history-list">
        <div v-for="(h, i) in history" :key="i" class="history-item card p-3 mb-3">
          <div class="d-flex">
            <img :src="h.thumb" class="thumb me-3" />
            <div class="flex-fill">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="small text-muted">{{ h.date }}</div>
                  <div class="fw-medium mt-1">{{ h.title }}</div>
                  <div class="small text-muted mt-1">{{ h.note }}</div>
                </div>
                <div>
                  <span v-if="h.status" class="badge status-badge">{{ h.status }}</span>
                </div>
              </div>

              <div class="mt-3">
                <div class="small text-muted mb-1">AI Recommendations ({{ h.recommendations.length }})</div>
                <div class="d-flex gap-2">
                  <img v-for="(r, idx) in h.recommendations" :key="idx" :src="r.thumb" class="rec-thumb" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="history.length === 0" class="text-center text-muted py-5">
          No AI history yet. Try "+ New Search" or upload a photo from Supporter main.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PageHeader from '@/components/common/PageHeader.vue'
const history = [
  {
    date: '2025.11.06',
    title: 'Food Photo',
    note: '→ Recommended: Jongro Kim\'s Samgyeopsal',
    status: 'Replaced',
    thumb: '/sample/food-main.jpg',
    recommendations: [
      { thumb: '/sample/rec1.jpg' },
      { thumb: '/sample/rec2.jpg' },
      { thumb: '/sample/rec3.jpg' }
    ]
  },
  {
    date: '2025.11.05',
    title: 'Food Photo',
    note: '',
    status: 'Saved only',
    thumb: '/sample/food-main.jpg',
    recommendations: [
      { thumb: '/sample/rec1.jpg' },
      { thumb: '/sample/rec2.jpg' },
      { thumb: '/sample/rec3.jpg' }
    ]
  }
]
</script>

<style scoped>
.history-card { background: #FFD9A6; border-radius:12px; }
.history-item { border-radius:12px; background:#fff; border:1px solid #f3e8ff; }
.thumb { width:72px; height:72px; border-radius:10px; object-fit:cover; }
.rec-thumb { width:64px; height:64px; border-radius:8px; object-fit:cover; border:2px solid rgba(167,139,255,0.15); }
.status-badge { background: #1b3b6f; color:#fff; padding:6px 10px; border-radius:999px; font-size:12px; }
</style>