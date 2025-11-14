<template>
  <div class="planner-create">
    <!-- 플래너 탭 -->
    <PageHeader title="Planner" subtitle="Create and manage your Seoul travel itinerary" icon="bi-map" />

    <!-- 메인 컨텐츠 -->  
    <div class="content-wrapper px-4 py-4">


      <!-- Create Budget-Based Itinerary 버튼 -->
      <BaseButton variant="primary" 
      class="w-100 mb-4 py-3 d-flex align-items-center justify-content-center gap-2"
      @click="next()"><i class="bi bi-plus-lg"></i>
        <span class="fw-semibold">Create Budget-Based Itinerary</span>
      </BaseButton>

      <!-- AI-Recommended Places -->
      <div class="recommended-section mb-4">
        <h5 class="fw-bold">AI-Recommended Places</h5>

        <!-- 카드 그리드 -->
        <div class="row g-3 mb-3">
          <!-- Accommodation -->
          <RecommendationCard imageSrc="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"
            alt="Accommodation" cardLabel="Accommodation" />

          <!-- Restaurants -->
          <div class="col-6">
            <div class="recommendation-card" @click="navigateTo('restaurants')">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500" alt="Restaurants" />
              <div class="card-overlay">
                <div class="card-icon bg-white rounded-circle p-2">
                  <i class="bi bi-cup-hot text-warning"></i>
                </div>
                <span class="card-label text-white fw-semibold">Restaurants</span>
              </div>
            </div>
          </div>

          <!-- Attractions -->
          <div class="col-6">
            <div class="recommendation-card" @click="navigateTo('attractions')">
              <img src="https://images.unsplash.com/photo-1553603227-2358aabe821e?w=500" alt="Attractions" />
              <div class="card-overlay">
                <div class="card-icon bg-white rounded-circle p-2">
                  <i class="bi bi-compass text-success"></i>
                </div>
                <span class="card-label text-white fw-semibold">Attractions</span>
              </div>
            </div>
          </div>

          <!-- Photo Spots -->
          <div class="col-6">
            <div class="recommendation-card" @click="navigateTo('photospots')">
              <img src="https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=500" alt="Photo Spots" />
              <div class="card-overlay">
                <div class="card-icon bg-white rounded-circle p-2">
                  <i class="bi bi-camera text-danger"></i>
                </div>
                <span class="card-label text-white fw-semibold">Photo Spots</span>
              </div>
            </div>
          </div>

          <!-- Festivals -->
          <div class="col-6">
            <div class="recommendation-card" @click="navigateTo('festivals')">
              <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500" alt="Festivals" />
              <div class="card-overlay">
                <div class="card-icon bg-white rounded-circle p-2">
                  <i class="bi bi-music-note text-info"></i>
                </div>
                <span class="card-label text-white fw-semibold">Festivals</span>
              </div>
            </div>
          </div>

          <!-- Experiences -->
          <div class="col-6">
            <div class="recommendation-card" @click="navigateTo('experiences')">
              <img src="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=500" alt="Experiences" />
              <div class="card-overlay">
                <div class="card-icon bg-white rounded-circle p-2">
                  <i class="bi bi-calendar-event text-warning"></i>
                </div>
                <span class="card-label text-white fw-semibold">Experiences</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Travel Tip -->
      <TipBox name="Travel Tip" description="Enter your budget and AI will create a customized itinerary considering accommodation, transportation, and
            meals." />
    </div>
  </div>
</template>

<script setup>
import BaseButton from "@/components/common/BaseButton.vue";
import PageHeader from "@/components/common/PageHeader.vue";
import TipBox from "@/components/common/TipBox.vue";
import RecommendationCard from "@/components/planner/RecommendationCard.vue";
import { RouterLink } from "vue-router";
import { useTravelStore } from '@/store/travelStore'
import router from "@/router";

const travelStore = useTravelStore()

function next() {
  travelStore.increaseStep();
  router.push("/planner/travelplan");
}

</script>

<style scoped lang="scss">
// 공용 스타일 임포트
@import '@/assets/styles/theme';

.planner-create {
  min-height: 100vh;
  background-color: $body-bg; // 테마의 베이지 배경
  font-family: 'Kyobo2024', sans-serif; // 타이포그래피 적용
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

/* AI-Recommended Places 제목 - 타이포그래피 스타일 적용 */
.recommended-section h5 {
  font-family: 'Siganpyo', sans-serif;
  color: $secondary;
  font-weight: 700;
  margin-bottom: 1.5rem !important;
}

/* 추천 카드 스타일 - 컴포넌트 스타일 적용 */
.recommendation-card {
  position: relative;
  border-radius: $border-radius-lg;
  overflow: hidden;
  cursor: pointer;
  height: 150px;
  box-shadow: $card-box-shadow;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid $card-border-color;
  background-color: $card-bg;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(255, 140, 0, 0.2);
    border-color: rgba($primary, 0.3);
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
    background-color: rgba(255, 255, 255, 0.95) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    i {
      font-size: 16px;
    }
  }

  .card-label {
    font-size: 14px;
    font-weight: 600;
    font-family: 'Siganpyo', sans-serif;
  }
}

/* 버튼 스타일 - BaseButton이 있지만 추가 커스텀 */
:deep(.btn-primary) {
  background: linear-gradient(90deg, $primary 0%, lighten($primary, 10%) 100%);
  border: none;
  color: #fff;
  font-weight: 500;
  border-radius: $border-radius-pill;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba($primary, 0.4);
  }
}

/* 그리드 간격 조정 */
.row.g-3 {
  margin: 0 -0.75rem;
  
  > .col-6 {
    padding: 0 0.75rem;
    margin-bottom: 1rem;
  }
}

/* 레이아웃 스타일 적용 - 모바일 반응형 */
@media (max-width: 576px) {
  .content-wrapper {
    padding: 1rem !important;
    margin: 4rem auto 2rem;
    border-radius: 0.75rem;
  }
  
  .recommendation-card {
    height: 120px;
    
    .card-icon {
      width: 28px;
      height: 28px;
      
      i {
        font-size: 14px;
      }
    }
    
    .card-label {
      font-size: 12px;
    }
    
    .card-overlay {
      padding: 8px;
    }
  }
  
  .recommended-section h5 {
    font-size: 1.1rem;
  }
}
</style>
