<template>
  <div class="trip-detail container-fms">
    <ReviewHeader
      title="Trip Details"
      :subtitle="trip.title"
      step="—"
      @back="goBack"
    />

    <!-- 썸네일 -->
    <div class="trip-cover">
      <img :src="trip.image" alt="Trip cover" />
    </div>

    <!-- 여행 정보 -->
    <div class="trip-info">
      <h4>{{ trip.title }}</h4>
      <p><i class="bi bi-geo-alt me-1"></i>{{ trip.location }}</p>
      <p><i class="bi bi-calendar me-1"></i>{{ trip.date }}</p>
      <p><i class="bi bi-currency-dollar me-1"></i>{{ trip.price }}</p>
    </div>

    <!-- 여행 설명 -->
    <div class="trip-description">
      <h6>Notes</h6>
      <p>{{ trip.description }}</p>
    </div>

    <!-- 버튼 -->
    <div class="trip-actions">
      <button class="btn-primary w-100" @click="goToReview">
        ✍️ Write a Review
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import ReviewHeader from '@/components/history/ReviewHeader.vue'

const router = useRouter()
const route = useRoute()

// 임시 하드코딩 데이터 (나중에 API 연동 가능)
const tripId = route.params.tripId
const trip = {
  id: tripId,
  title: 'Jeju Island Healing Trip',
  location: 'Jeju Island',
  date: 'Oct 15 - Oct 18, 2024',
  price: '500',
  image: 'https://images.unsplash.com/photo-1585508889309-6c7f49f4f2b2?w=800',
  description:
    'A 3-day healing trip to Jeju filled with beaches, mountains, and fresh seafood.'
}

const goBack = () => router.back()

// ✅ 리뷰 작성 페이지로 이동
const goToReview = () => {
  router.push({
    name: 'CreateTravelReview',
    params: { tripId: trip.id },
    query: { title: trip.title }
  })
}
</script>

<style scoped>
.trip-cover img {
  width: 100%;
  height: 200px;
  border-radius: 1rem;
  object-fit: cover;
  margin-bottom: 1rem;
}

.trip-info {
  color: #1b3b6f;
  margin-bottom: 1rem;
}

.trip-description {
  background: #fffaf3;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
}

.trip-actions .btn-primary {
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 0.75rem;
  font-weight: 600;
  transition: background-color 0.3s;
}

.trip-actions .btn-primary:hover {
  background-color: #e07b00;
}
</style>
