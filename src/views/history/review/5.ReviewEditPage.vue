<template>
  <div class="review-edit-page">
    <ReviewHeader
      title="Create Travel Review"
      :subtitle="tripTitle"
      step="5/6"
      @back="goBack"
    />

    <!-- Review Section -->
    <section class="review-section">
      <h6 class="section-title">
        <i class="bi bi-pencil-square me-2 text-primary"></i>
        Review & Edit
      </h6>

      <!-- Photos -->
      <div class="photo-section">
        <div class="photo-header d-flex justify-content-between align-items-center">
          <p class="photo-count">Photos ({{ photos.length }})</p>
          <button class="edit-btn" @click="editPhotos">Edit Photos</button>
        </div>

        <div class="photo-carousel">
          <div
            v-for="(photo, index) in photos"
            :key="photo.id"
            class="photo-item"
          >
            <img :src="photo.url" alt="photo" />
            <div v-if="photo.isMain" class="main-badge">🌟 Main Photo</div>
            <div class="photo-index">{{ index + 1 }}/{{ photos.length }}</div>
          </div>
        </div>
      </div>

      <!-- Caption -->
      <div class="caption-section mt-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6>Caption</h6>
          <button class="change-btn" @click="editCaption">Change</button>
        </div>
        <textarea
          v-model="caption"
          rows="4"
          class="caption-box"
          maxlength="2200"
        ></textarea>
        <p class="char-count">{{ caption.length }} characters</p>
      </div>

      <!-- Hashtags -->
      <div class="hashtag-section mt-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6>Hashtags</h6>
          <button class="change-btn" @click="editHashtags">Change</button>
        </div>
        <div class="hashtag-box">
          <span v-for="tag in hashtags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
        <p class="tag-count">{{ hashtags.length }} hashtag(s)</p>
      </div>
    </section>

    <!-- Bottom Navigation -->
    <div class="navigation-buttons">
      <button class="btn-back" @click="goBack">Back</button>
      <button class="btn-next" @click="goNext">Next Step</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ReviewHeader from '@/components/history/ReviewHeader.vue';

const router = useRouter();

// ✅ Mock 데이터 (실제 구현 시 store에서 가져올 예정)
const photos = ref([
  { id: 1, url: "https://images.unsplash.com/photo-1682686580458-58efc4f68b1c?w=800", isMain: true },
  { id: 2, url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800", isMain: false },
  { id: 3, url: "https://images.unsplash.com/photo-1531315630201-bb15abeb1653?w=800", isMain: false },
]);

const caption = ref("🌊 Lost in the endless blue of Jeju Island... Where the ocean meets the sky, and time stands still. Every wave whispers stories of ancient volcanoes and island dreams. 🏝️✨");

const hashtags = ref([
  "#JejuIsland",
  "#JejuTravel",
  "#Korea",
  "#TravelKorea",
  "#IslandLife",
  "#BeachVibes",
  "#NatureLovers",
  "#Wanderlust",
]);

// ✅ 이동 함수
const goBack = () => router.back();
const goNext = () => router.push({ name: "ReviewInstagramPreview" });

// ✅ 수정 버튼
const editPhotos = () => router.push({ name: "ReviewPhotoOrder" });
const editCaption = () => router.push({ name: "ReviewCaptionSelect" });
const editHashtags = () => router.push({ name: "ReviewHashtagSelect" });
</script>

<style scoped>
.review-edit-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem 6rem;
}

.section-title {
  color: #1b3b6f;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* Photo Section */
.photo-header {
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.photo-count {
  color: #1b3b6f;
}

.edit-btn,
.change-btn {
  background: none;
  border: none;
  color: #ff8c00;
  font-weight: 600;
  cursor: pointer;
}

.photo-carousel {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  scroll-behavior: smooth;
  padding-bottom: 0.5rem;
}

.photo-item {
  position: relative;
  flex: 0 0 80%;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.photo-item img {
  width: 100%;
  height: 260px;
  object-fit: cover;
}

.main-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background-color: #1b3b6f;
  color: white;
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
}

.photo-index {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.75rem;
  border-radius: 1rem;
  padding: 0.2rem 0.5rem;
}

/* Caption Section */
.caption-box {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 1rem;
  padding: 1rem;
  background: #fff;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: none;
}

.caption-box:focus {
  border-color: #ff8c00;
  outline: none;
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.25rem;
}

/* Hashtag Section */
.hashtag-box {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 1rem;
  padding: 1rem;
  gap: 0.5rem;
}

.tag {
  background: #ff8c00;
  color: #fff;
  border-radius: 1rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.tag-count {
  font-size: 0.8rem;
  color: #777;
  margin-top: 0.5rem;
}

/* Navigation */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 1rem;
  left: 0;
  width: 100%;
  padding: 0 1.25rem;
}

.btn-back,
.btn-next {
  flex: 1;
  height: 48px;
  border-radius: 1rem;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-back {
  background-color: #fff;
  color: #1b3b6f;
  border: 2px solid #1b3b6f;
  margin-right: 0.75rem;
}

.btn-next {
  background-color: #1b3b6f;
  color: #fff;
}

.btn-next:hover {
  background-color: #16305c;
}
</style>
