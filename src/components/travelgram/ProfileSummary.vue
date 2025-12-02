<template>
  <div class="profile-card shadow-sm">
    <!-- 프로필 이미지 -->
    <div class="profile-avatar mx-auto mb-2">
      <img :src="profileImage" :alt="name" class="avatar-img" />
    </div>

    <!-- 이름 및 소개 -->
    <h5 class="profile-name mb-1">{{ name }}</h5>
    <p class="profile-bio mb-3">{{ bio }}</p>

    <!-- 통계 -->
    <div class="profile-stats d-flex justify-content-center text-center">
      <div class="stat-item">
        <h6>{{ totalplans }}</h6>
        <p>Total plans</p>
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
import defaultProfileImg from '@/assets/img/profile-logo.png'

defineProps({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  profileImage: { type: String, default: defaultProfileImg },
  totalplans: { type: Number, default: 0 },
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
  border: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: 2rem; /* 🔥 필요하면 1.5rem~3rem 사이 조절 */
}

.profile-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.profile-avatar .avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto;
  border: 3px solid #e9ecef;
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
}

.stat-item {
  padding: 0 1rem;
}

.stat-item h6 {
  font-weight: 700;
  color: #1b3b6f;
  margin-bottom: 0.25rem;
}

.stat-item p {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0;
}
</style>
