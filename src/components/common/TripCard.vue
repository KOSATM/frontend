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
  tripId: [String, Number],           // ← 가능하면 id를 같이 넘기자
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
    params: { tripId: props.tripId },
    query: { title: props.title },
  })
}
</script>

<style scoped lang="scss">
.trip-card {
  text-align: left;
  border: 1px solid #eee;
  background-color: #fff;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: $primary;
    box-shadow: 0 4px 12px rgba($primary, 0.25);
  }

  img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 0.75rem;
    margin-right: 1rem;
  }

  .trip-info {
    flex: 1;

    .trip-title {
      font-weight: 600;
      color: $secondary;
    }

    .trip-meta {
      font-size: 0.85rem;
      color: #666;
    }
  }

  .badge {
    background-color: $success;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    color: #fff;
    font-weight: 500;
  }

  .icon-chevron {
    font-size: 1.25rem;
    color: #bbb;
  }
}
</style>