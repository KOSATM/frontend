<template>
  <div class="hotel-recommendation container py-4">
    <div class="form-content bg-white rounded-4 p-4">
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
        <div class="text-center">
          <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="text-muted">호텔 추천 정보를 불러오는 중입니다...</p>
        </div>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error && hotels.length === 0" class="alert alert-warning" role="alert">
        {{ error }}
      </div>

      <!-- 정상 콘텐츠 -->
      <div v-else>
        <!-- Accommodation Budget Propertion -->
        <div class="mb-3">
          <BaseSection icon="bi-percent" title="Accommodation Budget Propertion">
            <input type="range" id="range4" class="form-range" min="0" max="100" v-model="rangeValue" />
            <output :for="'range4'" aria-hidden="true">{{ rangeValue }}% (₩{{ Math.floor(budget * rangeValue / 100 / travelDays).toLocaleString() }})</output>
          </BaseSection>
        </div>

        <!-- Filter Section -->
        <div class="filter-section mb-4">
          <!-- Accommodation Type -->
          <BaseSection icon="bi-building" title="Accommodation Type">
            <select v-model="filters.accommodationType" class="form-select rounded-pill">
              <option value="all">All Types</option>
              <option value="hotel">Hotel</option>
              <option value="guesthouse">Guesthouse</option>
              <option value="hanok">Hanok Style</option>
              <option value="other">Other</option>
            </select>
          </BaseSection>

          <!-- Number of Guests -->
          <BaseSection icon="bi-people" title="Number of Guests">
            <div class="input-group">
              <input type="number" v-model="filters.guests" class="form-control rounded-pill" min="1" max="10" />
              <span class="ms-2">Guests</span>
            </div>
          </BaseSection>
        </div>

        <!-- Hotel List -->
        <div class="hotel-list mb-4">
          <BaseSection icon="bi-buildings" title="Recommended Hotels" :subtitle="`Showing ${ filteredHotels.length} hotels for ${filters.guests} guests`">
            <div v-if="isLoading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="error" class="alert alert-warning" role="alert">
              {{ error }}
            </div>
            <div v-else class="row g-4">
              <!-- Hotel Cards -->
              <div v-for="hotel in filteredHotels" :key="hotel.id" class="col-12">
                <div :class="['card hotel-card', { 'selected': selectedHotel?.id === hotel.id }]"
                  @click="selectHotel(hotel)">
                  <div class="row g-0">
                    <div class="col-md-4">
                      <img :src="hotel.image" class="img-fluid rounded-start h-100" :alt="hotel.name"
                        style="object-fit: cover;" />
                    </div>
                    <div class="col-md-8">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 class="card-title text-secondary mb-2">{{ hotel.name }}</h5>
                            <small class="text-muted d-block mb-2">{{ hotel.roomType }}</small>
                          </div>
                          <span class="badge bg-primary">Rank #{{ hotel.rank }}</span>
                        </div>
                        <p class="card-text text-muted small mb-2">
                          <i class="bi bi-geo-alt"></i>
                          {{ hotel.location }}
                        </p>
                        <div class="hotel-info mb-2 small text-muted">
                          <div><i class="bi bi-calendar-check"></i> {{ hotel.checkInDate }} ~ {{ hotel.checkOutDate }}</div>
                          <div><i class="bi bi-moon"></i> {{ hotel.nights }} | <i class="bi bi-people"></i> {{ hotel.guests }}</div>
                        </div>
                        <div class="hotel-features mb-3">
                          <span class="badge bg-light text-secondary me-2" v-if="hotel.facilities?.WiFi">
                            <i class="bi bi-wifi me-1"></i> {{ hotel.facilities.WiFi }}
                          </span>
                          <span class="badge bg-light text-secondary me-2" v-if="hotel.breakfast">
                            <i class="bi bi-cup-hot me-1"></i> Breakfast
                          </span>
                          <span class="badge bg-light text-secondary me-2" v-if="hotel.facilities?.['24시간프론트']">
                            <i class="bi bi-clock me-1"></i> {{ hotel.facilities['24시간프론트'] }}
                          </span>
                          <span class="badge bg-light text-secondary" v-if="hotel.facilities?.['지하철']">
                            <i class="bi bi-train-lightrail me-1"></i> {{ hotel.facilities['지하철'] }}
                          </span>
                        </div>
                        <div class="d-flex justify-content-between align-items-end">
                          <div class="rating">
                            <i class="bi bi-star-fill text-warning"></i>
                            <span class="ms-1">{{ hotel.rating }}</span>
                            <span class="text-muted">({{ hotel.reviews }} reviews)</span>
                          </div>
                          <div class="price text-end">
                            <div class="fs-5 fw-bold text-primary">
                              ₩{{ hotel.price.toLocaleString() }}
                            </div>
                            <small class="text-muted">per night</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BaseSection>
        </div>

        <!-- Confirm Button -->
        <div class="text-center">
          <BaseButton :disabled="!selectedHotel" @click="confirmSelection()" variant="primary" class="w-100 py-2">Next:
            Make a Payment</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import hotelPlaceholder from '@/assets/img/hotel-logo.png';
import BaseButton from '@/components/common/button/BaseButton.vue';
import { useTravelStore } from '@/store/travelStore';
import { useAuthStore } from '@/store/authStore';
import hotelApi from '@/api/hotelApi';
import BaseSection from '@/components/common/BaseSection.vue';
import { useChatStore } from '@/store/chatStore';

const router = useRouter();
const travelStore = useTravelStore();
const authStore = useAuthStore();
const chatStore = useChatStore();

const rangeValue = ref(50);
const budget = ref(1000000);
const travelDays = ref(3);
const filters = ref({
  accommodationType: 'all',
  guests: 2
});
const selectedHotel = ref(null);
const hotels = ref([]);
const isLoading = ref(false);
const error = ref(null);

// ✅ 호텔 이미지 배열 (0001.jpg ~ 0010.jpg)
const hotelImages = ref([]);
const usedImageIndices = ref(new Set());

// ✅ 호텔 이미지 초기화
const initializeHotelImages = () => {
  const images = [];
  for (let i = 1; i <= 10; i++) {
    const imageNum = String(i).padStart(4, '0');
    try {
      images.push(require(`@/assets/img/hotel-image/${imageNum}.jpg`));
    } catch (error) {
      console.warn(`⚠️ Image not found: ${imageNum}.jpg, using placeholder`);
      images.push(hotelPlaceholder);
    }
  }
  hotelImages.value = images;
  usedImageIndices.value.clear();
  console.log('🖼️ Hotel images initialized:', hotelImages.value.length);
};

// ✅ 랜덤 이미지 선택 (중복 없음)
const getRandomHotelImage = () => {
  if (hotelImages.value.length === 0) {
    return hotelPlaceholder;
  }

  // 모든 이미지를 사용했으면 리셋
  if (usedImageIndices.value.size === hotelImages.value.length) {
    usedImageIndices.value.clear();
  }

  // 사용하지 않은 이미지 인덱스 찾기
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * hotelImages.value.length);
  } while (usedImageIndices.value.has(randomIndex));

  usedImageIndices.value.add(randomIndex);
  console.log(`Using image ${randomIndex + 1}/${hotelImages.value.length}`);
  
  return hotelImages.value[randomIndex];
};

// 마운트 시 API 호출
onMounted(async () => {
  // ✅ 호텔 이미지 초기화
  initializeHotelImages();
  
  authStore.initializeAuth();
  chatStore.planId ||= Number(localStorage.getItem("planId"));
  chatStore.dayIndex ||= Number(localStorage.getItem("dayIndex"));
  
  isLoading.value = true;
  
  try {
    const userId = authStore.userId;
    console.log('1️⃣ userId:', userId);
    
    if (userId) {
      console.log('2️⃣ API 호출 시작');
      const response = await hotelApi.recommendHotel(userId);
      console.log('3️⃣ 응답:', response);
      
      if (response?.data?.data?.hotelSummaryList?.length > 0) {
        console.log('4️⃣ 호텔 데이터 있음');
        hotels.value = response.data.data.hotelSummaryList.map((hotel) => ({
          id: hotel.hotelId || hotel.hotelName,
          name: hotel.hotelName,
          location: hotel.neighborhood,
          price: Math.ceil(hotel.pricing.roomPrice),
          totalPrice: hotel.pricing.totalPrice,
          rating: 4.5,
          reviews: 100,
          image: getRandomHotelImage(),  // ✅ 랜덤 이미지 할당
          type: 'hotel',
          checkInDate: hotel.checkInDate,
          checkOutDate: hotel.checkOutDate,
          nights: hotel.nights,
          roomType: hotel.roomTypeName,
          guests: hotel.guests,
          rank: hotel.rank,
          facilities: hotel.facilities || {},
          freeWifi: hotel.facilities?.['WiFi'] === '있음',
          breakfast: true,
          pool: false,
          spa: false
        }));
      } else {
        console.log('5️⃣ 기본값 로드');
        loadDefaultHotels();
      }
    } else {
      console.log('6️⃣ userId 없어서 기본값 로드');
      loadDefaultHotels();
    }
  } catch (err) {
    console.error('❌ 에러:', err.message);
    loadDefaultHotels();
  } finally {
    isLoading.value = false;
  }
});

const loadDefaultHotels = () => {
  // API 호출 실패 시 빈 배열로 설정
  hotels.value = [];
  error.value = '호텔 정보를 불러올 수 없습니다. 나중에 다시 시도해주세요.';
};

const filteredHotels = computed(() => {
  return hotels.value.filter(hotel => {
    if ((filters.value.accommodationType !== 'all' &&
      hotel.type !== filters.value.accommodationType) ||
      hotel.price > budget.value * rangeValue.value / 100) {
      return false;
    }
    return true;
  });
});

const selectHotel = (hotel) => {
  selectedHotel.value = hotel;
};

const confirmSelection = () => {
  if (selectedHotel.value) {
    travelStore.increaseStep();
    router.push({ name: 'payment' });
  }
};

const goBack = () => {
  router.push("/planner/edit");
};
</script>

<style scoped>
.hotel-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.selected {
    border-color: var(--bs-primary);
  }
}

.budget-details {
  border: 1px solid rgba(#ffb347, 0.2);
}

.badge {
  font-weight: 500;
}
</style>