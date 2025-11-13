<template>
  <div class="profile-card shadow-sm">
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
  </div>
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
.profile-card {
  background: #ffffff;
  padding: 1.75rem 1.5rem;
  border-radius: 20px;
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  text-align: center;
  transition: all 0.25s ease;
  border: 1px solid rgba(0,0,0,0.06);
  margin-top: 2rem; /* 🔥 필요하면 1.5rem~3rem 사이 조절 */
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  }
}

.profile-avatar .avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 999px;
  background: #ffe5d1;
  color: #ff7a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  margin: 0 auto;
}

.profile-name {
  font-weight: 700;
  color: #2b2b2b;
}

.profile-bio {
  font-size: 0.9rem;
  color: #666;
}

.profile-stats {
  margin-top: 1rem;

  .stat-item {
    padding: 0 1rem;

    h6 {
      font-weight: 700;
      color: #1b3b6f;
      margin-bottom: 0.25rem;
    }

    p {
      font-size: 0.8rem;
      color: #888;
      margin-bottom: 0;
    }
  }
}

</style>
