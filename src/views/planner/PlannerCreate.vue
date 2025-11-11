<template>
  <div class="planner-create">
    <!-- 플래너 탭 -->
    <div class="planner-tab px-4 py-3 bg-light">
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-map text-primary"></i>
        <span class="fw-semibold text-primary">Planner</span>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="content-wrapper px-4 py-4">


      <!-- Create Budget-Based Itinerary 버튼 -->
      <button @click="createPlan" class="btn btn-primary w-100 mb-4 py-3 d-flex align-items-center justify-content-center gap-2">
        <i class="bi bi-plus-lg"></i>
        <span class="fw-semibold">Create Budget-Based Itinerary</span>
      </button>

      <!-- AI-Recommended Places -->
      <div class="recommended-section mb-4">
        <h5 class="fw-bold mb-3">AI-Recommended Places</h5>
        
        <!-- 카드 그리드 -->
        <div class="row g-3 mb-3">
          <!-- Accommodation -->
          <div class="col-6">
            <div class="recommendation-card" @click="navigateTo('accommodation')">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500" alt="Accommodation" />
              <div class="card-overlay">
                <div class="card-icon bg-white rounded-circle p-2">
                  <i class="bi bi-building text-primary"></i>
                </div>
                <span class="card-label text-white fw-semibold">Accommodation</span>
              </div>
            </div>
          </div>

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
      <div class="travel-tip bg-white p-3 rounded-3 shadow-sm">
        <div class="d-flex gap-2 mb-2">
          <i class="bi bi-lightbulb text-warning fs-5"></i>
          <h6 class="fw-bold mb-0">Travel Tip</h6>
        </div>
        <p class="text-muted small mb-0">
          Enter your budget and AI will create a customized itinerary considering accommodation, transportation, and meals.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (category) => {
  console.log('Navigate to:', category)
}

const createPlan = () => {
  router.push(`/planner/travelplan`)
}
</script>

<style scoped lang="scss">
.planner-create {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.planner-tab {
  background-color: #e7f3ff !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

/* 검색바 스타일 */


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

/* Travel Tip */
.travel-tip {
  border: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
