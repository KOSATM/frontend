<template>
  <div class="hotel-recommendation container py-4">
    <PageHeader title="Planner" subtitle="Create and manage your Seoul travel itinerary" icon="bi-map" />
    <StepHeader :step="'3/4'" :title="'Select an Accommodation'" @back="goBack"/>

    <!-- <div class="form-header mx-2 my-4">
      <RouterLink to="/planner/edit" class="text-decoration-none">
        <i class="bi bi-arrow-left"></i>
        <span class="ms-2">Back: Revise Itinerary Draft</span>
      </RouterLink>
    </div> -->

    <div class="form-content bg-white rounded-4 p-4">

      <!-- Budget Display -->
      <div class="budget-section mb-4">
        <h2 class="text-secondary mb-3">Recommended Hotels for Your Stay</h2>
        <p class="text-muted">
          based on your {{ travelDays }}-day trip with ₩{{ budget.toLocaleString() }} budget
        </p>
        <div class="d-flex justify-content-between align-items-center budget-details p-3 bg-light rounded-pill">
          <span>Budget per night</span>
          <span class="fs-5 fw-bold text-primary">₩{{ (budget / travelDays).toLocaleString() }}</span>
        </div>
      </div>

      <!-- Accommodation Budget Propertion -->
      <div class="mb-3">
        <label for="range4" class="form-label">Accommodation Budget Propertion</label>
        <input type="range" id="range4" class="form-range" min="0" max="100" v-model="rangeValue" />
        <output :for="'range4'" aria-hidden="true">{{ rangeValue }}% (₩{{ this.budget * this.rangeValue / 100 / this.travelDays }})</output>
      </div>

      <!-- Filter Section -->
      <div class="filter-section mb-4">
        <!-- Accommodation Type -->
        <div class="mb-3">
          <label class="form-label d-flex align-items-center">
            <i class="bi bi-building me-2"></i>
            Accommodation Type
          </label>
          <select v-model="filters.accommodationType" class="form-select rounded-pill">
            <option value="all">All Types</option>
            <option value="hotel">Hotel</option>
            <option value="guesthouse">Guesthouse</option>
            <option value="hanok">Hanok Style</option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- Number of Guests -->
        <div class="mb-3">
          <label class="form-label d-flex align-items-center">
            <i class="bi bi-people me-2"></i>
            Number of Guests
          </label>
          <div class="input-group">
            <input type="number" v-model="filters.guests" class="form-control rounded-pill" min="1" max="10" />
            <span class="ms-2">Guests</span>
          </div>
        </div>
      </div>

      <!-- Hotel List -->
      <div class="hotel-list mb-4">
        <p class="text-muted mb-3">
          Showing {{ filteredHotels.length }} hotels for {{ filters.guests }} guests
        </p>

        <!-- Hotel Cards -->
        <div class="row g-4">
          <div v-for="hotel in filteredHotels" :key="hotel.id" class="col-12">
            <div :class="['card hotel-card', { 'selected': selectedHotel?.id === hotel.id }]" @click="selectHotel(hotel)">
              <div class="row g-0">
                <div class="col-md-4">
                  <img :src="hotel.image" class="img-fluid rounded-start h-100" :alt="hotel.name" style="object-fit: cover;" />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                      <h5 class="card-title text-secondary mb-2">{{ hotel.name }}</h5>
                      <span class="badge bg-primary">Best Price!</span>
                    </div>
                    <p class="card-text text-muted small mb-2">
                      <i class="bi bi-geo-alt"></i>
                      {{ hotel.location }}
                    </p>
                    <div class="hotel-features mb-3">
                      <span class="badge bg-light text-secondary me-2" v-if="hotel.freeWifi">
                        <i class="bi bi-wifi me-1"></i> Free WiFi
                      </span>
                      <span class="badge bg-light text-secondary me-2" v-if="hotel.breakfast">
                        <i class="bi bi-cup-hot me-1"></i> Breakfast
                      </span>
                      <span class="badge bg-light text-secondary me-2" v-if="hotel.pool">
                        <i class="bi bi-water me-1"></i> Pool
                      </span>
                      <span class="badge bg-light text-secondary" v-if="hotel.spa">
                        <i class="bi bi-heart-pulse me-1"></i> Spa
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
      </div>

      <!-- Confirm Button -->
      <div class="text-center">
        <!-- <RouterLink class="btn btn-primary btn-lg px-5" :disabled="!selectedHotel" @click="confirmSelection" to="/planner/payment">
          Make a Payment
        </RouterLink> -->
        <BaseButton :disabled="!selectedHotel" @click="confirmSelection()" variant="primary" class="w-100 py-2">Next: Make a Payment</BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/common/PageHeader.vue';
import hotelIllust from '@/assets/img/hotel-logo.png'
import { ref } from 'vue'
import StepHeader from '@/components/common/StepHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { useTravelStore } from '@/store/travelStore'

export default {
  name: 'HotelRecommendation',
  components: {
    BaseButton,
    PageHeader,
    StepHeader
  },
  data() {
    return {
      travelStore: useTravelStore(),
      rangeValue: 50,
      budget: 300000, // This should come from TravelPlanForm
      travelDays: 3,  // This should come from TravelPlanForm
      filters: {
        accommodationType: 'all',
        guests: 2
      },
      selectedHotel: null,
      hotels: [
        {
          id: 1,
          name: 'Four Seasons Hotel Seoul',
          location: 'Gwanghwamun, Jongno-gu',
          price: 315000,
          rating: 4.8,
          reviews: 234,
          image: hotelIllust,
          type: 'hotel',
          freeWifi: true,
          breakfast: true,
          pool: true,
          spa: true
        },
        {
          id: 2,
          name: 'The Shilla Seoul',
          location: 'Jung-gu, Central Seoul',
          price: 285000,
          rating: 4.7,
          reviews: 189,
          image: hotelIllust,
          type: 'hotel',
          freeWifi: true,
          breakfast: true,
          pool: true,
          spa: true
        },
        {
          id: 3,
          name: 'Lotte World Hotel',
          location: 'Songpa-gu, Jamsil',
          price: 320000,
          rating: 4.6,
          reviews: 156,
          image: hotelIllust,
          type: 'hotel',
          freeWifi: true,
          breakfast: true,
          pool: true,
          spa: false
        },
        {
          id: 4,
          name: 'Seoul Plaza Hotel',
          location: 'Jung-gu, City Hall',
          price: 195000,
          rating: 4.3,
          reviews: 98,
          image: hotelIllust,
          type: 'hotel',
          freeWifi: true,
          breakfast: false,
          pool: false,
          spa: false
        },
        {
          id: 5,
          name: 'Korea House Guesthouse',
          location: 'Jongno-gu, Bukchon',
          price: 95000,
          rating: 4.5,
          reviews: 287,
          image: hotelIllust,
          type: 'guesthouse',
          freeWifi: true,
          breakfast: true,
          pool: false,
          spa: false
        },
        {
          id: 6,
          name: 'Myeongdong Tourist Hotel',
          location: 'Jung-gu, Myeongdong',
          price: 165000,
          rating: 4.2,
          reviews: 142,
          image: hotelIllust,
          type: 'hotel',
          freeWifi: true,
          breakfast: false,
          pool: false,
          spa: true
        },
        {
          id: 7,
          name: 'Gangnam Station Residence',
          location: 'Gangnam-gu, Apgujeong',
          price: 250000,
          rating: 4.4,
          reviews: 178,
          image: hotelIllust,
          type: 'guesthouse',
          freeWifi: true,
          breakfast: true,
          pool: true,
          spa: false
        },
        {
          id: 8,
          name: 'Insadong Hanok Stay',
          location: 'Jongno-gu, Insadong',
          price: 135000,
          rating: 4.7,
          reviews: 223,
          image: hotelIllust,
          type: 'hanok',
          freeWifi: true,
          breakfast: true,
          pool: false,
          spa: true
        },
        {
          id: 9,
          name: 'Gangbuk Boutique Hotel',
          location: 'Seongbuk-gu, Gireum',
          price: 175000,
          rating: 4.3,
          reviews: 89,
          image: hotelIllust,
          type: 'hotel',
          freeWifi: true,
          breakfast: true,
          pool: false,
          spa: true
        },
        {
          id: 10,
          name: 'Itaewon Global House',
          location: 'Yongsan-gu, Itaewon',
          price: 120000,
          rating: 4.6,
          reviews: 211,
          image: hotelIllust,
          type: 'other',
          freeWifi: true,
          breakfast: false,
          pool: false,
          spa: false
        }
      ]
    }
  },
  computed: {
    filteredHotels() {
      return this.hotels.filter(hotel => {
        if ((this.filters.accommodationType !== 'all' &&
          hotel.type !== this.filters.accommodationType) || hotel.price > this.budget * this.rangeValue / 100) {
          return false
        }
        // Add more filters as needed
        return true
      })
    }
  },
  methods: {
    selectHotel(hotel) {
      this.selectedHotel = hotel
    },
    confirmSelection() {
      if (this.selectedHotel) {
        // Emit event with selected hotel data
        this.$emit('hotel-selected', this.selectedHotel)
        this.travelStore.increaseStep()
        // Navigate to payment page
        this.$router.push({ name: 'payment' })
      }
    },
    goBack() {
      this.$router.push("/planner/edit")
    },
  }
}
</script>

<style lang="scss" scoped>
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
  border: 1px solid rgba($primary, 0.2);
}

.badge {
  font-weight: 500;
}
</style>