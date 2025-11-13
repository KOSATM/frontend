<template>
  <div class="payment-complete container py-4">
    <div class="text-center py-5">
      <!-- Success Icon -->
      <div class="success-icon mb-4">
        <i class="bi bi-check-circle text-success" style="font-size: 80px;"></i>
      </div>

      <!-- Success Message -->
      <h1 class="display-5 fw-bold mb-3 text-secondary">Payment Complete!</h1>
      <p class="fs-5 text-muted mb-4">Your hotel reservation has been successfully completed.</p>

      <!-- Booking Details -->
      <div class="card mx-auto" style="max-width: 500px;">
        <div class="card-body">
          <div class="mb-3">
            <small class="text-muted d-block">Booking Number</small>
            <h6 class="fw-bold">{{ bookingNumber }}</h6>
          </div>
          <hr />
          <div class="mb-3">
            <small class="text-muted d-block">Hotel Name</small>
            <h6 class="fw-bold">{{ hotelName }}</h6>
          </div>
          <hr />
          <div class="mb-3">
            <small class="text-muted d-block">Payment Amount</small>
            <h6 class="fw-bold text-primary">₩{{ totalAmount.toLocaleString() }}</h6>
          </div>
          <hr />
          <div>
            <small class="text-muted d-block">Payment Date</small>
            <h6 class="fw-bold">{{ paymentDate }}</h6>
          </div>
        </div>
      </div>

      <!-- Confirmation Message -->
      <div class="alert alert-info mt-4" role="alert">
        <i class="bi bi-info-circle me-2"></i>
        A confirmation email has been sent to you.
      </div>

      <!-- Action Buttons -->
      <div class="text-center mt-5">
        <button
          class="btn btn-primary btn-lg px-5"
          @click="goToBookingComplete"
        >
          Check Trip Summary
          <i class="bi bi-arrow-right ms-2"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentComplete',
  data() {
    return {
      bookingNumber: 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      hotelName: 'Four Seasons Hotel Seoul',
      totalAmount: 1047250,
      paymentDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      }) + ' at ' + new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  methods: {
    goToBookingComplete() {
      this.$router.push({ name: 'bookingComplete' });
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-complete {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon {
  animation: popIn 0.6s ease-out;
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
}

:root {
  --bs-primary: #ff8c00;
}
</style>
