<template>
  <div class="plan-card" @click="goToReview">
    <!-- 썸네일 -->
    <img src="@/assets/img/logo.png" alt="logo" />

    <!-- 본문 -->
    <div class="plan-info">
      <div class="d-flex align-items-center mb-1">
        <span class="badge me-2">✔ {{ status }}</span>
        <h6 class="plan-title mb-0">{{ title }}</h6>
      </div>
      <p class="plan-meta mb-0">
        <i class="bi bi-calendar-event me-1"></i>{{ date }}<br />
        <i class="bi bi-currency-dollar me-1"></i>{{ budget }}
      </p>
    </div>

    <!-- 오른쪽 화살표 -->
    <i class="bi bi-chevron-right icon-chevron"></i>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  planId: [String, Number],           // ← 가능하면 id를 같이 넘기자
  planTitle: { type: String, required: true },
  date: String,
  budget: String,
  image: String,
  status: { type: String, default: 'Done' }
})

const goToReview = () => {
  router.push({
    name: 'CreateTravelReview',
    params: { planId: props.planId },
    query: { title: props.planTitle },
  })
}
</script>

<style scoped>

</style>