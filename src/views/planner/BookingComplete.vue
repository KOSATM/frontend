<template>
  <div class="booking-complete container py-5">
    <div class="text-center mb-4">
      <div class="check-circle mx-auto mb-3 d-inline-flex align-items-center justify-content-center">
        <i class="bi bi-check-lg text-white fs-2"></i>
      </div>
      <h2 class="fw-bold">All Set!</h2>
      <p class="text-muted">Your Seoul adventure is ready to begin</p>
    </div>

    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card mb-4 shadow-sm">
          <div class="card-header bg-primary text-white border-0 rounded-top">
            <h5 class="mb-0">Trip Summary</h5>
          </div>
          <div class="card-body">
            <dl class="row mb-3">
              <dt class="col-4 text-secondary">Duration</dt>
              <dd class="col-8">{{ duration }} days<br/><small class="text-muted">Starting {{ formattedStartDate }}</small></dd>

              <dt class="col-4 text-secondary">Total Budget</dt>
              <dd class="col-8">{{ formattedBudget }}</dd>

              <dt class="col-4 text-secondary">Accommodation</dt>
              <dd class="col-8">
                <div class="fw-semibold">{{ accommodation.name }}</div>
                <div class="text-muted small">{{ accommodation.location }}</div>
                <div class="mt-2 text-primary small">
                  {{ formattedPricePerNight }} /night • × {{ duration }} nights = {{ formattedHotelTotal }}
                </div>
              </dd>
            </dl>
          </div>
        </div>

        <div class="card mb-4 bg-light border-0 shadow-sm p-3">
          <h6 class="mb-2">What's Next?</h6>
          <ul class="mb-0 small">
            <li>Your itinerary has been saved to History</li>
            <li>You can modify your plan anytime</li>
            <li>Use the Supporter tab for real-time assistance during your trip</li>
          </ul>
        </div>

        <div class="d-grid mb-2">
          <router-link class="btn btn-primary btn-lg" :to="{ path: '/planner/itinerary' }">View Full Itinerary</router-link>
        </div>

        <p class="text-muted small mt-3">
          <i class="bi bi-pin-angle me-1"></i>
          Tip: Download offline maps and save important addresses in Korean
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const propsRoute = useRoute()

// Try to read data from route query first, otherwise fallback to sample data
const duration = Number(propsRoute.query.duration) || 7
const startDate = propsRoute.query.startDate || new Date().toISOString().split('T')[0]
const budget = Number(propsRoute.query.budget) || 2000
const currency = propsRoute.query.currency || 'USD'

const accommodation = {
  name: propsRoute.query.accName || 'Seoul Boutique Residence',
  location: propsRoute.query.accLocation || 'Itaewon, Yongsan-gu',
  pricePerNight: Number(propsRoute.query.accPrice) || 110
}

const formattedStartDate = computed(() => {
  try {
    const d = new Date(startDate)
    return d.toISOString().split('T')[0]
  } catch (e) {
    return startDate
  }
})

const formattedBudget = computed(() => {
  if (currency === 'KRW') return `₩${Math.round(budget).toLocaleString()}`
  return `$${Number(budget).toLocaleString()}`
})

const formattedPricePerNight = computed(() => {
  if (currency === 'KRW') return `₩${Math.round(accommodation.pricePerNight).toLocaleString()}`
  return `$${Number(accommodation.pricePerNight).toLocaleString()}`
})

const formattedHotelTotal = computed(() => {
  const total = accommodation.pricePerNight * duration
  if (currency === 'KRW') return `₩${Math.round(total).toLocaleString()}`
  return `$${Number(total).toLocaleString()}`
})
</script>

<style scoped lang="scss">
.booking-complete {
  max-width: 980px;
  margin: 0 auto;

  .check-circle {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #28a745; /* green */
    box-shadow: 0 6px 18px rgba(40,167,69,0.12);
  }

  .card-header.bg-primary {
    /* use CSS variables like other views; provide fallbacks */
    background: linear-gradient(90deg, var(--bs-primary, #1B3B6F) 0%, var(--bs-accent, #ff8c00) 100%);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    color: #fff;
  }

  .btn-primary {
    background-color: var(--bs-primary, #1B3B6F);
    border-color: var(--bs-primary, #1B3B6F);
    color: white;
  }

  .btn-primary:hover {
    opacity: 0.95;
  }

  .btn-outline-secondary {
    border-radius: 0.5rem;
  }
}
</style>
