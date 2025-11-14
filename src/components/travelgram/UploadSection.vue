<!-- 컴포넌트의 UI -->
<template>
    <div class="upload-section mb-4">
    <div class="upload-header d-flex justify-content-between align-items-center mb-3">
      <!-- 🔹 왼쪽: 아이콘 + 제목/부제목 -->
      <div class="upload-header-text">
        <h5 class="upload-title mb-1">
          <i :class="icon + ' me-1 text-primary'"></i>
          {{ title }}
        </h5>
        <p class="upload-subtitle mb-0">{{ subtitle }}</p>
      </div>

      <!-- 🔸 오른쪽: 액션 슬롯 (조건부) -->
      <div v-if="$slots.actions" class="upload-header-actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- 컨텐츠 영역 -->
    <div class="upload-content">
      <slot></slot>
    </div>
  </div>
</template>

<!-- 컴포넌트의 초기화 또는 이벤트 처리 -->
<script setup>
defineProps({
    title: String,
    subtitle: String,
    icon: String
})
</script>

<!-- 컴포넌트 스타일 정의 -->
<style scoped>
.upload-section {
  background-color: #f9fafc;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #eee;
  margin-bottom: 1.5rem;
}

.upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-header-text {
  display: flex;
  flex-direction: column;
}

.upload-title {
  font-weight: 700;
  color: #1b3b6f;
  margin: 0;
}

.upload-subtitle {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.upload-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.upload-content {
  margin-top: 1rem;
}
</style>