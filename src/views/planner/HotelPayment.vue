<template>
  <div class="hotel-payment container py-4">
    <PageHeader
      title="Payment"
      subtitle="Complete your hotel booking"
      icon="bi-credit-card"
    />

    <!-- Selected Hotel Summary -->
    <div class="card mb-4">
      <div class="card-header bg-light">
        <h5 class="mb-0">Booking Summary</h5>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <img
              :src="selectedHotel.image"
              class="img-fluid rounded"
              :alt="selectedHotel.name"
              style="object-fit: cover; height: 200px; width: 100%;"
            />
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
    </div>

    <!-- Price Breakdown -->
    <div class="card mb-4">
      <div class="card-header bg-light">
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
      </div>
    </div>

    <!-- Payment Method Selection -->
    <div class="card mb-4">
      <div class="card-header bg-light">
        <h5 class="mb-0">Payment Method</h5>
      </div>
      <div class="card-body">
        <div class="payment-methods">
          <div class="form-check mb-3">
            <input
              class="form-check-input"
              type="radio"
              name="paymentMethod"
              id="creditCard"
              value="creditCard"
              v-model="paymentMethod"
            />
            <label class="form-check-label" for="creditCard">
              <i class="bi bi-credit-card me-2"></i>
              Credit Card
            </label>
          </div>
          <div class="form-check mb-3">
            <input
              class="form-check-input"
              type="radio"
              name="paymentMethod"
              id="debitCard"
              value="debitCard"
              v-model="paymentMethod"
            />
            <label class="form-check-label" for="debitCard">
              <i class="bi bi-credit-card me-2"></i>
              Debit Card
            </label>
          </div>
          <div class="form-check mb-3">
            <input
              class="form-check-input"
              type="radio"
              name="paymentMethod"
              id="bankTransfer"
              value="bankTransfer"
              v-model="paymentMethod"
            />
            <label class="form-check-label" for="bankTransfer">
              <i class="bi bi-bank me-2"></i>
              Bank Transfer
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="paymentMethod"
              id="paypal"
              value="paypal"
              v-model="paymentMethod"
            />
            <label class="form-check-label" for="paypal">
              <i class="bi bi-cash-coin me-2"></i>
              PayPal
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Card Details (shown only for card payments) -->
    <div class="card mb-4" v-if="paymentMethod === 'creditCard' || paymentMethod === 'debitCard'">
      <div class="card-header bg-light">
        <h5 class="mb-0">Card Details</h5>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="cardName" class="form-label">Cardholder Name</label>
          <input
            type="text"
            class="form-control rounded-pill"
            id="cardName"
            v-model="cardDetails.name"
            placeholder="Full Name"
          />
        </div>
        <div class="mb-3">
          <label for="cardNumber" class="form-label">Card Number</label>
          <input
            type="text"
            class="form-control rounded-pill"
            id="cardNumber"
            v-model="cardDetails.number"
            placeholder="1234 5678 9012 3456"
            maxlength="19"
          />
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="expiry" class="form-label">Expiry Date</label>
            <input
              type="text"
              class="form-control rounded-pill"
              id="expiry"
              v-model="cardDetails.expiry"
              placeholder="MM/YY"
              maxlength="5"
            />
          </div>
          <div class="col-md-6 mb-3">
            <label for="cvv" class="form-label">CVV</label>
            <input
              type="text"
              class="form-control rounded-pill"
              id="cvv"
              v-model="cardDetails.cvv"
              placeholder="123"
              maxlength="3"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Agreement -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="agreement"
            v-model="agreeToTerms"
          />
          <label class="form-check-label" for="agreement">
            I agree to the booking terms and cancellation policy
          </label>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="d-flex gap-3 justify-content-center">
      <button
        class="btn btn-outline-secondary btn-lg px-5"
        @click="goBack"
      >
        Back
      </button>
      <button
        class="btn btn-primary btn-lg px-5"
        @click="processPayment"
        :disabled="!agreeToTerms || isProcessing"
      >
        <span v-if="!isProcessing">Pay ₩{{ totalAmount.toLocaleString() }}</span>
        <span v-else>
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Processing...
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/common/PageHeader.vue';
import hotelIllust from '@/assets/img/hotel-illust.png'

export default {
  name: 'HotelPayment',
  components: {
    PageHeader
  },
  data() {
    return {
      selectedHotel: {
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
      },
      travelDays: 3,
      taxesAndFees: 47250,
      paymentMethod: 'creditCard',
      cardDetails: {
        name: '',
        number: '',
        expiry: '',
        cvv: ''
      },
      agreeToTerms: false,
      isProcessing: false
    }
  },
  computed: {
    totalAmount() {
      return (this.selectedHotel.price * this.travelDays) + this.taxesAndFees;
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    validateCardDetails() {
      if (this.paymentMethod === 'creditCard' || this.paymentMethod === 'debitCard') {
        return (
          this.cardDetails.name &&
          this.cardDetails.number &&
          this.cardDetails.expiry &&
          this.cardDetails.cvv
        );
      }
      return true;
    },
    processPayment() {
      if (!this.agreeToTerms) {
        alert('Please agree to the booking terms');
        return;
      }

      if (!this.validateCardDetails()) {
        alert('Please enter valid card information');
        return;
      }

      this.isProcessing = true;

      // Simulate payment processing
      setTimeout(() => {
        this.isProcessing = false;
        // Navigate to completion page
        this.$router.push({ name: 'paymentComplete' });
      }, 2000);
    }
  },
  mounted() {
    // Get selected hotel from route params or store if available
    // For now, using dummy data
  }
}
</script>

<style lang="scss" scoped>
.payment-methods {
  .form-check {
    padding: 12px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f8f9fa;
    }

    input[type="radio"]:checked + label {
      color: var(--bs-primary);
      font-weight: 500;
    }
  }

  .form-check-label {
    cursor: pointer;
    margin-bottom: 0;
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
