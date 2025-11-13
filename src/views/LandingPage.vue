<template>
  <div class="container text-center py-5">
    <!-- Logo -->
    <div class="mb-4">
      <img src="@/assets/img/logo.png" alt="Find My Seoul" class="logo-fms" />
    </div>

    <!-- Tagline -->
    <div class="tagline bg-secondary mb-5 shadow-sm p-3 rounded-pill">
      <h5 class="m-0 fw-semibold text-white">Your AI-Powered Seoul Travel Companion</h5>
    </div>

    <!-- Features -->
    <div class="features-container mb-5">
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="feature-card bg-white p-4 rounded-3 shadow-sm border"
      >
        <div class="d-flex align-items-center gap-3">
          <div class="icon-container bg-secondary bg-opacity-10 rounded-circle p-3">
            <i :class="feature.icon" class="text-secondary"></i>
          </div>
          <div class="text-start flex-grow-1">
            <h6 class="fw-bold mb-1 text-secondary">{{ feature.title }}</h6>
            <p class="small text-muted mb-0">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Google Sign-In -->
    <button class="btn btn-primary btn-lg rounded-pill w-75 fw-semibold d-flex align-items-center justify-content-center gap-2 text-light">
      <i class="bi bi-google"></i> Sign in with Google
    </button>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  data() {
    return {
      features: [
        {
          title: "Budget-Based Itinerary",
          desc: "AI creates the perfect Seoul itinerary based on your budget",
          icon: "bi bi-geo-alt-fill fs-4",
        },
        {
          title: "Real-Time Travel Support",
          desc: "GPS-based recommendations and weather-adaptive suggestions",
          icon: "bi bi-map-fill  fs-4",
        },
        {
          title: "Share your journey on Instagram",
          desc: "Keep track of all your Seoul adventures",
          icon: "bi bi-journal-text fs-4",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.features-container {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
  }
}

.icon-container {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn {
  margin: 0 auto;
  max-width: 400px;
}
</style>
