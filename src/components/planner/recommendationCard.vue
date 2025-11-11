<!-- 컴포넌트의 UI -->
<template>
    <div class="col-6">
        <div class="recommendation-card" @click="navigateTo('accommodation')">
            <img :src=imageSrc :alt=alt />
            <div class="card-overlay">
                <div class="card-icon bg-white rounded-circle p-2">
                    <i class="bi bi-building text-primary"></i>
                </div>
                <span class="card-label text-white fw-semibold">{{ cardLabel }}</span>
            </div>
        </div>
    </div>
</template>

<!-- 컴포넌트의 초기화 또는 이벤트 처리 -->
<script setup>
const props = defineProps({
  imageSrc: String,
  alt: String,
  cardLabel: String
})
</script>

<!-- 컴포넌트 스타일 정의 -->
<style scoped>
/* 추천 카드 스타일 */
.recommendation-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  height: 150px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 16px;
    }
  }

  .card-label {
    font-size: 14px;
  }
}
</style>