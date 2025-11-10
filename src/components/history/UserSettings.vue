<template>
  <section class="user-settings">
    <!-- 섹션 제목 -->
    <h6 class="settings-title">Settings</h6>

    <!-- 프로필 설정 -->
    <div class="settings-item">
      <div class="settings-icon bg-light-primary">
        <i class="bi bi-person-fill text-primary"></i>
      </div>
      <div class="settings-info">
        <h6>Edit Profile</h6>
        <p>Profile & account settings</p>
      </div>
      <i class="bi bi-chevron-right text-secondary"></i>
    </div>

    <!-- 환경 설정 -->
    <div class="settings-item">
      <div class="settings-icon bg-light-secondary">
        <i class="bi bi-gear-fill text-secondary"></i>
      </div>
      <div class="settings-info">
        <h6>Preferences</h6>
        <p>Notifications, language, etc</p>
      </div>
      <i class="bi bi-chevron-right text-secondary"></i>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
/* ===============================
   ⚙️ Settings Section (Left Align Version)
   =============================== */
.user-settings {
  background-color: var(--light);
  padding: 2rem 1.5rem 3rem;
  border-top: 1px solid rgba(27, 59, 111, 0.08);
  border-radius: 0 0 1rem 1rem;
  font-family: 'Poppins', 'Noto Sans KR', sans-serif;
  text-align: left; /* ✅ 전체 왼쪽 정렬 */
}

.settings-title {
  color: var(--secondary);
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1rem;
  padding-left: 0.25rem; /* 약간 들여쓰기 */
}

/* ===============================
   🧩 Each Item
   =============================== */
.settings-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: left; /* ✅ 내부 내용 왼쪽 정렬 */
}

.settings-item:hover {
  background-color: #fff7ec;
  transform: translateY(-2px);
}

.settings-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.settings-info {
  flex: 1; /* ✅ 가운데 텍스트가 가로로 확장되도록 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.settings-info h6 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: var(--secondary);
}

.settings-info p {
  font-size: 0.8rem;
  margin: 0.2rem 0 0;
  color: #6c757d;
}

/* 오른쪽 화살표 위치 고정 */
.settings-item > i {
  flex-shrink: 0;
  margin-left: auto;
}

</style>
