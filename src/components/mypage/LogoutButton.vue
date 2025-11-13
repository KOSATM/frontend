<template>
<!-- 로그아웃 -->
<div class="logout-section text-center">
    <button class="btn-logout">
    <i class="bi bi-box-arrow-right me-2"></i>
    Log Out
    </button>
    <p class="app-version mt-2">Find My Seoul v1.0.0</p>
</div>
</template>


<script setup>
</script>

<style scoped>
/* ===============================
   🚪 로그아웃 영역
   =============================== */
.logout-section {
  margin-top: 2rem;
}

.btn-logout {
  background-color: transparent;
  border: 1.5px solid #e74c3c;
  color: #e74c3c;
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: 8px;
  padding: 0.6rem 1.25rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* 🔥 Hover 시 효과 */
.btn-logout:hover {
  background-color: #e74c3c; /* 빨간 배경 */
  color: #ffffff; /* 글자 흰색 */
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(231, 76, 60, 0.3);
}

.app-version {
  color: rgba(27, 59, 111, 0.5);
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
</style>