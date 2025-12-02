<template>
  <div class="trip-card" @click="goToReview">
    <!-- 썸네일 -->
    <img :src="image" alt="trip image" />

    <!-- 본문 -->
    <div class="trip-info">
      <div class="d-flex align-items-center mb-1">
        <span class="badge me-2">✔ {{ status }}</span>
        <h6 class="trip-title mb-0">{{ title }}</h6>
      </div>
      <p class="trip-meta mb-1">{{ location }}</p>
      <p class="trip-meta mb-0">
        <i class="bi bi-calendar-event me-1"></i>{{ date }}<br />
        <i class="bi bi-currency-dollar me-1"></i>{{ price }}
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
  title: { type: String, required: true },
  location: String,
  date: String,
  price: String,
  image: String,
  status: { type: String, default: 'Done' }
})

const goToReview = () => {
  router.push({
    name: 'CreateTravelReview',
    params: { planId: props.planId },
    query: { title: props.title },
  })
}
</script>

<style scoped>

</style>