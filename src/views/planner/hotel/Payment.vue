<template>
  <div class="hotel-payment container py-4">
    <!-- <PageHeader title="Planner" subtitle="Create and manage your Seoul travel itinerary" icon="bi-map" /> -->
    <!-- <StepHeader :step="'4/4'" :title="'Make a Payment for the Stay'" @back="goBack"/> -->

    <!-- Selected Hotel Summary -->
      <BaseSection icon="bi-building" title="Booking Summary">
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-4">
              <img :src="selectedHotel.image" class="img-fluid rounded" :alt="selectedHotel.name"
                style="object-fit: cover; height: 200px; width: 100%;" />
            </div>
            <div class="col-md-8">
              <h5 class="card-title">{{ selectedHotel.name }}</h5>
              <p class="card-text text-muted">
                <i class="bi bi-geo-alt"></i>
                {{ selectedHotel.location }}
              </p>
              <div class="mb-3">
                <span class="badge bg-light text-secondary me-2" v-if="selectedHotel.freeWifi">
                  <i class="bi bi-wifi me-1"></i> Free WiFi
                </span>
                <span class="badge bg-light text-secondary me-2" v-if="selectedHotel.breakfast">
                  <i class="bi bi-cup-hot me-1"></i> Breakfast
                </span>
                <span class="badge bg-light text-secondary me-2" v-if="selectedHotel.pool">
                  <i class="bi bi-water me-1"></i> Pool
                </span>
                <span class="badge bg-light text-secondary" v-if="selectedHotel.spa">
                  <i class="bi bi-heart-pulse me-1"></i> Spa
                </span>
              </div>
              <div class="rating">
                <i class="bi bi-star-fill text-warning"></i>
                <span class="ms-1">{{ selectedHotel.rating }}</span>
                <span class="text-muted">({{ selectedHotel.reviews }} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </BaseSection>


      <!-- <div class="card-header bg-light">
        <h5 class="mb-0">Booking Summary</h5>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <img :src="selectedHotel.image" class="img-fluid rounded" :alt="selectedHotel.name"
              style="object-fit: cover; height: 200px; width: 100%;" />
          </div>
          <div class="col-md-8">
            <h5 class="card-title">{{ selectedHotel.name }}</h5>
            <p class="card-text text-muted">
              <i class="bi bi-geo-alt"></i>
              {{ selectedHotel.location }}
            </p>
            <div class="mb-3">
              <span class="badge bg-light text-secondary me-2" v-if="selectedHotel.freeWifi">
                <i class="bi bi-wifi me-1"></i> Free WiFi
              </span>
              <span class="badge bg-light text-secondary me-2" v-if="selectedHotel.breakfast">
                <i class="bi bi-cup-hot me-1"></i> Breakfast
              </span>
              <span class="badge bg-light text-secondary me-2" v-if="selectedHotel.pool">
                <i class="bi bi-water me-1"></i> Pool
              </span>
              <span class="badge bg-light text-secondary" v-if="selectedHotel.spa">
                <i class="bi bi-heart-pulse me-1"></i> Spa
              </span>
            </div>
            <div class="rating">
              <i class="bi bi-star-fill text-warning"></i>
              <span class="ms-1">{{ selectedHotel.rating }}</span>
              <span class="text-muted">({{ selectedHotel.reviews }} reviews)</span>
            </div>
          </div>
        </div>
      </div> -->

    <!-- Price Breakdown -->
      <BaseSection icon="bi-receipt" title="Price Breakdown">
        <div class="card-body">
          <div class="d-flex justify-content-between mb-2">
            <span>{{ travelDays }} nights × ₩{{ selectedHotel.price.toLocaleString() }}/night</span>
            <span class="fw-bold">₩{{ (selectedHotel.price * travelDays).toLocaleString() }}</span>
          </div>
          <div class="d-flex justify-content-between mb-2">
            <span>Taxes & Fees</span>
            <span class="fw-bold">₩{{ taxesAndFees.toLocaleString() }}</span>
          </div>
          <hr />
          <div class="d-flex justify-content-between">
            <span class="fs-5 fw-bold">Total Amount</span>
            <span class="fs-5 fw-bold text-primary">₩{{ totalAmount.toLocaleString() }}</span>
          </div>
        </div>
      </BaseSection>
      <!-- <div class="card-header bg-light">
        <h5 class="mb-0">Price Breakdown</h5>
      </div>
      <div class="card-body">
        <div class="d-flex justify-content-between mb-2">
          <span>{{ travelDays }} nights × ₩{{ selectedHotel.price.toLocaleString() }}/night</span>
          <span class="fw-bold">₩{{ (selectedHotel.price * travelDays).toLocaleString() }}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <span>Taxes & Fees</span>
          <span class="fw-bold">₩{{ taxesAndFees.toLocaleString() }}</span>
        </div>
        <hr />
        <div class="d-flex justify-content-between">
          <span class="fs-5 fw-bold">Total Amount</span>
          <span class="fs-5 fw-bold text-primary">₩{{ totalAmount.toLocaleString() }}</span>
        </div>
      </div> -->

    <!-- Payment Method Selection -->
      <BaseSection icon="bi-credit-card-2-front" title="Payment Method">
        <div class="row g-3">
          <div class="col-6">
            <div class="payment-item" :class="{ active: paymentMethod === 'creditCard' }"
              @click="paymentMethod = 'creditCard'">
              <i class="bi bi-credit-card me-2"></i>
              <span>Credit Card</span>
            </div>
          </div>
          <div class="col-6">
            <div class="payment-item" :class="{ active: paymentMethod === 'debitCard' }"
              @click="paymentMethod = 'debitCard'">
              <i class="bi bi-credit-card me-2"></i>
              <span>Debit Card</span>
            </div>
          </div>
          <div class="col-6">
            <div class="payment-item" :class="{ active: paymentMethod === 'bankTransfer' }"
              @click="paymentMethod = 'bankTransfer'">
              <i class="bi bi-bank me-2"></i>
              <span>Bank Transfer</span>
            </div>
          </div>
          <div class="col-6">
            <div class="payment-item" :class="{ active: paymentMethod === 'paypal' }" @click="paymentMethod = 'paypal'">
              <i class="bi bi-cash-coin me-2"></i>
              <span>PayPal</span>
            </div>
          </div>
        </div>
      </BaseSection>

    <!-- Card Details (shown only for card payments) -->
    <BaseSection v-if="paymentMethod === 'creditCard' || paymentMethod === 'debitCard'" icon="bi-credit-card-2-back" title="Card Details"> 
        <div class="mb-3">
          <label for="cardName" class="form-label">Cardholder Name</label>
          <input type="text" class="form-control rounded-pill" id="cardName" v-model="cardDetails.name"
            placeholder="Full Name" />
        </div>
        <div class="mb-3">
          <label for="cardNumber" class="form-label">Card Number</label>
          <input type="text" class="form-control rounded-pill" id="cardNumber" v-model="cardDetails.number"
            placeholder="1234 5678 9012 3456" maxlength="19" />
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="expiry" class="form-label">Expiry Date</label>
            <input type="text" class="form-control rounded-pill" id="expiry" v-model="cardDetails.expiry"
              placeholder="MM/YY" maxlength="5" />
          </div>
          <div class="col-md-6">
            <label for="cvv" class="form-label">CVV</label>
            <input type="text" class="form-control rounded-pill" id="cvv" v-model="cardDetails.cvv" placeholder="123"
              maxlength="3" />
          </div>
        </div>
      </BaseSection>
      <!-- <div class="card-header bg-light">
        <h5 class="mb-0">Card Details</h5>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="cardName" class="form-label">Cardholder Name</label>
          <input type="text" class="form-control rounded-pill" id="cardName" v-model="cardDetails.name"
            placeholder="Full Name" />
        </div>
        <div class="mb-3">
          <label for="cardNumber" class="form-label">Card Number</label>
          <input type="text" class="form-control rounded-pill" id="cardNumber" v-model="cardDetails.number"
            placeholder="1234 5678 9012 3456" maxlength="19" />
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="expiry" class="form-label">Expiry Date</label>
            <input type="text" class="form-control rounded-pill" id="expiry" v-model="cardDetails.expiry"
              placeholder="MM/YY" maxlength="5" />
          </div>
          <div class="col-md-6 mb-3">
            <label for="cvv" class="form-label">CVV</label>
            <input type="text" class="form-control rounded-pill" id="cvv" v-model="cardDetails.cvv" placeholder="123"
              maxlength="3" />
          </div>
        </div>
      </div> -->
    

    <!-- Booking Agreement -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="agreement" v-model="agreeToTerms" />
          <label class="form-check-label" for="agreement">
            I agree to the booking terms and cancellation policy
          </label>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="d-flex gap-3 justify-content-center">
      <button class="btn btn-outline-secondary btn-lg px-5" @click="goBack">
        뒤로가기
      </button>
      <!-- <button
        class="btn btn-primary btn-lg px-5"
        @click="processPayment"
        :disabled="!agreeToTerms || isProcessing"
      >
        <span v-if="!isProcessing">Pay ₩{{ totalAmount.toLocaleString() }}</span>
        <span v-else>
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Processing...
        </span>
      </button> -->
      <BaseButton class="btn btn-primary btn-lg px-5" @click="processPayment" :disabled="!agreeToTerms || isProcessing">
        <span v-if="!isProcessing">Pay ₩{{ totalAmount.toLocaleString() }}</span>
        <span v-else>
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          처리 중...
        </span>
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import PageHeader from '@/components/common/header/PageHeader.vue';
import hotelIllust from '@/assets/img/hotel-logo.png';
import StepHeader from '@/components/common/header/StepHeader.vue';
import BaseButton from '@/components/common/button/BaseButton.vue';
import { useTravelStore } from '@/store/travelStore';
import BaseSection from '@/components/common/BaseSection.vue';

const router = useRouter();
const travelStore = useTravelStore();

const selectedHotel = ref({
  id: 1,
  name: 'Four Seasons Hotel Seoul',
  location: 'Gwanghwamun, Jongno-gu',
  price: 315000,
  rating: 4.8,
  reviews: 234,
  image: hotelIllust,
  freeWifi: true,
  breakfast: true,
  pool: true,
  spa: true
});

const travelDays = ref(3);
const taxesAndFees = ref(47250);
const paymentMethod = ref('creditCard');
const cardDetails = ref({
  name: '',
  number: '',
  expiry: '',
  cvv: ''
});
const agreeToTerms = ref(false);
const isProcessing = ref(false);

const totalAmount = computed(() => {
  return (selectedHotel.value.price * travelDays.value) + taxesAndFees.value;
});

const goBack = () => {
  router.back("/planner/hotel");
};

const validateCardDetails = () => {
  if (paymentMethod.value === 'creditCard' || paymentMethod.value === 'debitCard') {
    return (
      cardDetails.value.name &&
      cardDetails.value.number &&
      cardDetails.value.expiry &&
      cardDetails.value.cvv
    );
  }
  return true;
};

const processPayment = () => {
  if (!agreeToTerms.value) {
    alert('Please agree to the booking terms');
    return;
  }

  if (!validateCardDetails()) {
    alert('Please enter valid card information');
    return;
  }

  isProcessing.value = true;

  // Simulate payment processing
  setTimeout(() => {
    isProcessing.value = false;
    // Navigate to completion page
    router.push({ name: 'bookingComplete' });
  }, 2000);
};
</script>

<style scoped>
.payment-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #d0d5dd;
  border-radius: 0.75rem;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  min-width: fit-content;
  height: 100%;

  &:hover {
    border-color: #ff8c00;
    background-color: #fef8f2;
  }

  &.active {
    border-color: #ff8c00;
    background-color: #ff8c00;
    color: white;
  }

  i {
    font-size: 1rem;
  }
}

.card {
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  border-bottom: 1px solid #e9ecef;
}

:root {
  --bs-primary: #ff8c00;
}
</style>
