<!-- 컴포넌트의 UI -->
<template>
    <div class="col-6">
        <div class="recommendation-card" @click="handleCardClick">
            <img :src=imageSrc :alt=alt />
            <div class="card-overlay">
                <div class="card-icon bg-white rounded-circle p-2">
                    <i :class="['bi', icon || 'bi-building', 'text-primary']"></i>
                </div>
                <span class="card-label text-white fw-semibold">{{ cardLabel }}</span>
            </div>
        </div>
    </div>
</template>

<!-- 컴포넌트의 초기화 또는 이벤트 처리 -->
<script setup>
import { defineProps } from 'vue';

// 부모로부터 받을 데이터 정의
const props = defineProps({
  imageSrc: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Image'
  },
  cardLabel: {
    type: String,
    required: true
  },
  // 카테고리 (검색어 매핑용)
  category: {
    type: String,
    required: true
  },
  // 아이콘 (예: bi-camera, bi-music-note 등)
  icon: {
    type: String,
    default: 'bi-building'
  }
});

const handleCardClick = () => {
  // 1. 카테고리별 검색 키워드 매핑
  const keywordMap = {
    accommodation: '서울 감성 숙소 추천',
    restaurants: '서울 맛집 내돈내산',
    attractions: '서울 가볼만한곳',
    photospots: '서울 사진찍기 좋은곳',
    festivals: '서울 이번달 축제',
    experiences: '서울 이색 데이트 코스'
  };

  // 2. 검색어 선택 (매핑된 게 없으면 라벨 + 서울 여행)
  const query = keywordMap[props.category] || `서울 ${props.cardLabel} 추천`;

  // 3. 네이버 검색 새 탭 열기
  const url = `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}&where=influencer`;
  window.open(url, '_blank');
};
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