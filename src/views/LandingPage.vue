<template>
  <div class="container text-center py-5">
    <!-- Logo -->
    <div class="mb-4">
      <img src="@/assets/logo.png" alt="Find My Seoul" class="logo-fms" />
    </div>

    <!-- Tagline -->
    <div class="tagline mb-5 shadow-sm p-3 rounded-pill">
      <h5 class="m-0 text-primary fw-semibold">Your AI-Powered Seoul Travel Companion</h5>
    </div>

    <!-- Features -->
    <div class="d-flex flex-column align-items-center gap-3 mb-5">
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="feature-box d-flex align-items-center p-3 rounded shadow-sm"
      >
        <div class="icon-box me-3">
          <i :class="feature.icon"></i>
        </div>
        <div class="text-start">
          <div class="fw-semibold text-primary">{{ feature.title }}</div>
          <div class="small text-muted">{{ feature.desc }}</div>
        </div>
      </div>
    </div>

    <!-- Google Sign-In -->
    <button class="btn btn-primary btn-lg rounded-pill w-75 fw-semibold d-flex align-items-center justify-content-center gap-2">
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
          icon: "bi bi-geo-alt-fill text-warning fs-4",
        },
        {
          title: "Real-Time Travel Support",
          desc: "GPS-based recommendations and weather-adaptive suggestions",
          icon: "bi bi-map-fill text-warning fs-4",
        },
        {
          title: "Travel History",
          desc: "Keep track of all your Seoul adventures",
          icon: "bi bi-journal-text text-warning fs-4",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.btn {
  margin-right: 10px;
}
</style>
