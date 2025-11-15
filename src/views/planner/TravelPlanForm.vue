<template>
  <!-- <BackButtonPageHeader title="Let's Plan Your Korean Adventure" subtitle="Tell us about your trip and we'll create a personalized itinerary for you.">
  </BackButtonPageHeader> -->
  <!-- <div class="travel-plan-form"> -->
  <!-- <div class="form-header mb-4">
      <router-link to="/planner" class="text-decoration-none">
        <i class="bi bi-arrow-left"></i>
        <span class="ms-2">Create Your Itinerary</span>
      </router-link>
    </div> -->
  <PageHeader
    title="Planner"
    subtitle="Create and manage your Seoul travel itinerary"
    icon="bi-map"
  />
  <div class="travel-plan-form">
    <StepHeader :step="'1/4'" :title="'Make an Outline'" @back="goBack"/>
    <div class="form-header mb-4">
      <!-- <RouterLink to="/planner" class="text-decoration-none">
        <i class="bi bi-arrow-left"></i>
        <span class="ms-2">Back</span>
      </RouterLink> -->
    </div>

    <div v-if="currentStep === 1" class="form-content bg-white rounded-4">
      <!-- <h2 class="text-primary fw-bold mb-3">Let's Plan Your Korean Adventure</h2>
      <p class="text-secondary mb-4">Tell us about your trip and we'll create a personalized itinerary for you.</p> -->

      <!-- Trip Duration Section -->
      <UploadSection icon="bi-calendar-event" title="Trip Duration">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Start Date (Excluding Flight)</label>
            <input type="date" class="form-control" v-model="tripData.startDate">
          </div>
          <div class="col-md-6">
            <label class="form-label">Number of Days</label>
            <select class="form-select" v-model="tripData.duration">
              <option v-for="n in 14" :key="n" :value="n">{{ n }} days</option>
            </select>
          </div>
        </div>
      </UploadSection>
      <!-- <section class="mb-4">
        <h3 class="section-title">
          <i class="bi bi-calendar-event text-accent me-2"></i>
          Trip Duration
        </h3>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Start Date (Excluding Flight)</label>
            <input type="date" class="form-control" v-model="tripData.startDate">
          </div>
          <div class="col-md-6">
            <label class="form-label">Number of Days</label>
            <select class="form-select" v-model="tripData.duration">
              <option v-for="n in 14" :key="n" :value="n">{{ n }} days</option>
            </select>
          </div>
        </div>
      </section> -->

      <!-- Budget Section -->
      <UploadSection icon="bi-wallet2" title="Budget">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Maximum Budget</label>
            <input type="number" class="form-control" v-model="tripData.budget">
          </div>
          <div class="col-md-6">
            <label class="form-label">Currency</label>
            <select class="form-select" v-model="tripData.currency">
              <option value="USD">USD ($)</option>
              <option value="KRW">KRW (₩)</option>
            </select>
          </div>
        </div>
        <div class="budget-info text-secondary mt-2" v-if="tripData.budget && tripData.duration">
          ≈ {{ formatBudgetPerDay() }} per day
        </div>
      </UploadSection>

      <!-- <section class="mb-4">
        <h3 class="section-title">
          <i class="bi bi-wallet2 text-accent me-2"></i>
          Budget
        </h3>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Maximum Budget</label>
            <input type="number" class="form-control" v-model="tripData.budget">
          </div>
          <div class="col-md-6">
            <label class="form-label">Currency</label>
            <select class="form-select" v-model="tripData.currency">
              <option value="USD">USD ($)</option>
              <option value="KRW">KRW (₩)</option>
            </select>
          </div>
        </div>
        <div class="budget-info text-secondary mt-2" v-if="tripData.budget && tripData.duration">
          ≈ {{ formatBudgetPerDay() }} per day
        </div>
      </section> -->

      <!-- Interests Section -->
      <UploadSection icon="bi-heart" title="What Interests You?"
        subtitle="Select all that apply. We'll tailor your itinerary based on your preferences.">
          <BaseSelection :items="interests" v-model="tripData.selectedInterests" />
      </UploadSection>
      <!-- <section class="mb-4">
        <h3 class="section-title">
          <i class="bi bi-heart text-accent me-2"></i>
          What Interests You?
        </h3>
        <p class="text-secondary mb-3">Select all that apply. We'll tailor your itinerary based on your preferences.</p>
        <div class="row g-3">
          <div class="col-6" v-for="interest in interests" :key="interest.id">
            <div class="d-flex align-items-center border rounded-3 p-3 interest-item h-100"
              :class="{ 'border-primary bg-primary text-white': tripData.selectedInterests.includes(interest.id) }"
              @click="toggleInterest(interest.id)">
              <i :class="interest.icon + ' me-2'"></i>
              <span class="text-truncate">{{ interest.name }}</span>
            </div>
          </div>
        </div>
      </section> -->

      <!-- Additional Preferences -->
      <UploadSection title="Additional Preferences (Optional)" icon="bi-chat-right-text">
        <textarea class="form-control" rows="3"
          placeholder="e.g., I prefer staying near Gangnam, I'm vegetarian, I want to visit BTS-related spots, I wake up late..."
          v-model="tripData.additionalPreferences"></textarea>
      </UploadSection>
      <!-- <section class="mb-4">
        <h3 class="section-title">
          <i class="bi bi-chat-right-text text-accent me-2"></i>
          Additional Preferences (Optional)
        </h3>
        <textarea 
          class="form-control" 
          rows="3" 
          placeholder="e.g., I prefer staying near Gangnam, I'm vegetarian, I want to visit BTS-related spots, I wake up late..."
          v-model="tripData.additionalPreferences"
        ></textarea>
      </section> -->

      <!-- <RouterLink class="btn btn-primary w-100 py-2" @click="nextStep" to="/planner/edit">
        Next: Choose Your Hotel
      </RouterLink> -->
      <BaseButton @click="next()" variant="primary" class="w-100 py-2">Next: Generate Itinerary Draft</BaseButton>
    </div>

    <!-- Hotel Recommendation Step -->
    <!-- <div v-else-if="currentStep === 2" class="form-content bg-white rounded-4 p-4">
      <HotelRecommendation :budget="tripData.budget" :travel-days="tripData.duration"
        @hotel-selected="onHotelSelected" />
    </div> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HotelRecommendation from './hotel/HotelRecommendation.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BackButtonPageHeader from '@/components/common/BackButtonPageHeader.vue'
import UploadSection from '@/components/travelgram/UploadSection.vue'
import StepHeader from '@/components/common/StepHeader.vue'
import { useRouter } from 'vue-router'
import BaseSelection from '@/components/common/BaseSelection.vue'
import { useTravelStore } from '@/store/travelStore'

const currentStep = ref(1)
const selectedHotel = ref(null)
const router = useRouter()
const travelStore = useTravelStore()

function next() {
  travelStore.increaseStep();
  router.push("/planner/edit");
}

const tripData = ref({
  startDate: new Date().toISOString().split('T')[0],
  duration: 7,
  budget: 2000,
  currency: 'USD',
  selectedInterests: [],
  additionalPreferences: ''
})

const interests = [
  { id: 'gyeongbokgung', name: '궁궐 / Gyeongbokgung', icon: 'bi bi-bank' },
  { id: 'hanbok', name: 'Hanbok Experience', icon: 'bi bi-person-standing' },
  { id: 'kpop', name: 'K-Pop', icon: 'bi bi-music-note-beamed' },
  { id: 'shopping', name: 'Shopping', icon: 'bi bi-bag' },
  { id: 'food', name: 'Korean Food', icon: 'bi bi-fork-knife' },
  { id: 'cafes', name: 'Cafes', icon: 'bi bi-cup' },
  { id: 'temples', name: 'Temples', icon: 'bi bi-yin-yang' },
  { id: 'nightlife', name: 'Nightlife', icon: 'bi bi-moon-stars' },
  { id: 'museums', name: 'Museums', icon: 'bi bi-building' },
  { id: 'nature', name: 'Nature', icon: 'bi bi-tree' },
  { id: 'kdrama', name: 'K-Drama Spots', icon: 'bi bi-camera-reels' },
  { id: 'beauty', name: 'Beauty & Skincare', icon: 'bi bi-stars' }
]

const toggleInterest = (id) => {
  const index = tripData.value.selectedInterests.indexOf(id)
  if (index === -1) {
    tripData.value.selectedInterests.push(id)
  } else {
    tripData.value.selectedInterests.splice(index, 1)
  }
}

const formatBudgetPerDay = () => {
  const amountPerDay = tripData.value.budget / tripData.value.duration
  return tripData.value.currency === 'USD'
    ? `$${amountPerDay.toFixed(2)}`
    : `₩${Math.round(amountPerDay).toLocaleString()}`
}

const goBack = () => {
  router.push("/planner")
}

const nextStep = () => {
  if (currentStep.value === 1) {
    // Validate form data if needed
    currentStep.value = 2
  }
}

const onHotelSelected = (hotel) => {
  selectedHotel.value = hotel
  // TODO: Proceed to next step or save the itinerary
  console.log('Selected hotel:', hotel)
  console.log('Complete trip data:', {
    ...tripData.value,
    hotel: selectedHotel.value
  })
}
</script>

<style scoped lang="scss">
.travel-plan-form {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;

  .form-header {
    a {
      color: var(--bs-primary);
      font-weight: 600;
      font-size: 1.1rem;

      &:hover {
        color: var(--bs-primary-dark);
      }
    }
  }

  .section-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--bs-primary);
    margin-bottom: 1rem;

    i {
      color: var(--bs-accent);
    }
  }

  .interest-item {
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(.bg-primary) {
      border-color: var(--bs-primary) !important;
    }
  }

  .form-control,
  .form-select {
    border-color: var(--bs-gray-300);

    &:focus {
      border-color: var(--bs-primary);
      box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
    }
  }

  .btn-primary {
    background-color: var(--bs-primary);
    border-color: var(--bs-primary);

    &:hover {
      background-color: var(--bs-primary-dark);
      border-color: var(--bs-primary-dark);
    }
  }
}

// Custom CSS Variables
:root {
  --bs-primary: #1a237e; // 남색
  --bs-primary-rgb: 26, 35, 126;
  --bs-primary-dark: #0d1b60;
  --bs-accent: #ff5722; // 주황색
  --bs-accent-rgb: 255, 87, 34;
}
</style>
