<template>
  <div class="container-fms py-4">
    <div class="mb-4 border-bottom pb-2">
      <h6 class="text-primary fw-semibold mb-0">
        <i class="bi bi-clock-history me-1"></i> History
      </h6>
    </div>

    <!-- 프로필 -->
    <div class="text-center mb-4">
      <div class="circle-avatar mb-2">{{ user.initials }}</div>
      <h6 class="fw-bold mb-0">{{ user.name }}</h6>
      <p class="text-muted small">{{ user.role }}</p>
    </div>

    <!-- 통계 -->
    <div class="d-flex justify-content-around text-center mb-4">
      <div>
        <h5 class="text-primary fw-bold mb-0">{{ user.stats.totalTrips }}</h5>
        <p class="small text-muted mb-0">Total Trips</p>
      </div>
      <div>
        <h5 class="text-primary fw-bold mb-0">{{ user.stats.travelDays }}</h5>
        <p class="small text-muted mb-0">Travel Days</p>
      </div>
      <div>
        <h5 class="text-primary fw-bold mb-0">{{ user.stats.completed }}</h5>
        <p class="small text-muted mb-0">Completed</p>
      </div>
    </div>

    <!-- 공통 TripCard 재사용 -->
    <section class="completed-section mb-5">
      <h6 class="fw-bold text-secondary mb-3">Completed Travel Plans</h6>
      <TripCard
        v-for="(trip, index) in completedTrips"
        :key="index"
        :title="trip.title"
        :location="trip.location"
        :date="trip.date"
        :price="trip.price"
        :image="trip.image"
        status="Done"
      />
    </section>

    <!-- 로그아웃 -->
    <div class="text-center mt-5">
      <button class="btn btn-outline-primary rounded-pill px-4 fw-semibold">
        <i class="bi bi-box-arrow-right me-2"></i> Log Out
      </button>
    </div>
  </div>
</template>

<script setup>
import TripCard from "@/components/common/TripCard.vue";

const user = {
  initials: "JH",
  name: "Jessica Han",
  role: "Travel Enthusiast",
  stats: {
    totalTrips: 12,
    travelDays: 28,
    completed: 3,
  },
};

const completedTrips = [
  {
    title: "Jeju Island Healing Trip",
    location: "Jeju Island",
    date: "Oct 15 – Oct 18, 2024",
    price: "$500",
    image: "/assets/trips/jeju.jpg",
  },
  {
    title: "Tokyo Food Tour",
    location: "Tokyo, Japan",
    date: "Sep 20 – Sep 25, 2024",
    price: "$1,200",
    image: "/assets/trips/tokyo.jpg",
  },
  {
    title: "Busan City Escape",
    location: "Busan",
    date: "Aug 10 – Aug 12, 2024",
    price: "$300",
    image: "/assets/trips/busan.jpg",
  },
];
</script>

<style scoped lang="scss">
.circle-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: $primary;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0 auto;
}
</style>
