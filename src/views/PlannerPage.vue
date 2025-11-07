<template>
    <div class="planner-container py-3 px-3">
        <AppHeader title="Planner" @menu-click="toggleMenu" />
        <!-- Search -->
        <div class="input-group mb-3 shadow-sm rounded-pill">
            <span class="input-group-text border-0 bg-white rounded-pill-start ps-3">
                <i class="bi bi-search text-muted"></i>
            </span>
            <input type="text" class="form-control border-0 rounded-pill" placeholder="Search destinations..." />
        </div>

        <!-- Button -->
        <button class="btn btn-warning w-100 fw-semibold rounded-4 py-3 mb-4">
            + Create Budget-Based Itinerary
        </button>

        <!-- Section Title -->
        <h6 class="fw-semibold text-start mb-3">AI-Recommended Places</h6>

        <!-- Card Grid -->
        <div class="row g-3">
            <div v-for="(item, index) in categories" :key="index" class="col-6">
                <div class="category-card position-relative rounded-4 overflow-hidden text-white" :style="{ backgroundImage: 'url(' + item.image + ')' }">
                    <div class="overlay"></div>
                    <div class="position-absolute bottom-0 start-0 p-3">
                        <i :class="item.icon"></i>
                        <span class="fw-semibold ms-2">{{ item.title }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Travel Tip -->
        <div class="mt-4 p-3 bg-light rounded-4 d-flex align-items-start">
            <i class="bi bi-lightbulb text-warning fs-4 me-3"></i>
            <p class="small mb-0 text-muted">
                Enter your budget and AI will create a customized itinerary considering
                accommodation, transportation, and meals.
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: "PlannerPage",
    data() {
        return {
            categories: [
                { title: "Accommodation", icon: "bi bi-building", image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2103b" },
                { title: "Restaurants", icon: "bi bi-egg-fried", image: "https://images.unsplash.com/photo-1600891964090-6f9e3f3a5d4d" },
                { title: "Attractions", icon: "bi bi-map", image: "https://images.unsplash.com/photo-1473187983305-f615310e7daa" },
                { title: "Photo Spots", icon: "bi bi-camera", image: "https://images.unsplash.com/photo-1582719478173-2c3c6b2d8d5d" },
                { title: "Festivals", icon: "bi bi-music-note-beamed", image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231" },
                { title: "Experiences", icon: "bi bi-calendar-event", image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d" },
            ],
        };
    },
};
</script>

<style scoped>
.planner-container {
    background: var(--background);
    color: var(--foreground);
    min-height: 100vh;
}

.category-card {
    background-size: cover;
    background-position: center;
    height: 140px;
    border: none;
}

.overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1));
}
</style>
