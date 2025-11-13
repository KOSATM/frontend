<template>
  <section class="profile-summary text-center py-4">
    <!-- 프로필 이미지 -->
    <div class="profile-avatar mx-auto mb-2">
      <div class="avatar-circle">{{ initials }}</div>
    </div>

    <!-- 이름 및 소개 -->
    <h5 class="profile-name mb-1">{{ name }}</h5>
    <p class="profile-bio mb-3">{{ bio }}</p>

    <!-- 통계 -->
    <div class="profile-stats d-flex justify-content-center text-center">
      <div class="stat-item">
        <h6>{{ totalTrips }}</h6>
        <p>Total Trips</p>
      </div>
      <div class="stat-item">
        <h6>{{ travelDays }}</h6>
        <p>Travel Days</p>
      </div>
      <div class="stat-item">
        <h6>{{ completed }}</h6>
        <p>Completed</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  initials: { type: String, default: "JH" },
  totalTrips: { type: Number, default: 0 },
  travelDays: { type: Number, default: 0 },
  completed: { type: Number, default: 0 },
});
</script>

<style scoped>
/* ===============================
   👤 Profile Summary
   =============================== */
.profile-summary {
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.5rem;
  padding: 2rem 1.5rem;
}

.avatar-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #ff8c00;
  color: #fff;
  font-weight: 600;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.profile-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1b3b6f;
}

.profile-bio {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 1rem;
}

.stat-item h6 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ff8c00;
  margin-bottom: 0.25rem;
}

.stat-item p {
  font-size: 0.8rem;
  color: #6c757d;
  margin: 0;
}
</style>
