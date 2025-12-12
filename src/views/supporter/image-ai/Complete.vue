<template>
  <div class = "supporter-page">
  <PageHeader title="서포터" subtitle="실시간으로 여행을 도와드립니다." icon="bi-chat-dots" />
  <PageHeader title="이미지 기반 여행 AI" subtitle="AI 추천을 사용해보세요." />

  <div class="complete-card card p-5 mt-4 text-center">
    <div class="check-circle mb-4">✓</div>
    <h3 class="mb-2">Action Completed!</h3>
    <p class="text-muted mb-4">Destination added to your itinerary</p>

    <div class="d-flex flex-column align-items-center gap-3">
      <router-link class="btn btn-lg btn-primary btn-wide" :to="{ name: 'CreateNewSearch' }">Search Another
        Photo</router-link>
      <router-link class="btn btn-lg btn-outline-primary btn-wide" :to="{ name: 'SupporterMain' }">Back to Travel
        Supporter</router-link>
    </div>
  </div>
  </div>\
</template>

<script setup>
import PageHeader from '@/components/common/header/PageHeader.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// optional: receive state plans if needed
const plans = route?.state?.plans || null
</script>

<style scoped>
.supporter-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem; /* App.vue 사이드바도 padding-top: 2rem 필요 */
}

.complete-wrap {
  padding-bottom: 40px;
}

.complete-card {
  max-width: 720px;
  margin: 32px auto;
  border-radius: 12px;
  background: #fff9ff;
  box-shadow: 0 8px 30px rgba(27, 59, 111, 0.06);
}

.check-circle {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #1b3b6f;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(27, 59, 111, 0.12);
}

/* buttons */
.btn-wide {
  width: 320px;
  border-radius: 12px;
  padding: 12px 18px;
}

.btn-primary {
  background: #1b3b6f;
  border-color: #1b3b6f;
  color: #fff;
}

.btn-outline-primary {
  background: #fff;
  color: #1b3b6f;
  border: 1px solid #e6eef9;
}
</style>