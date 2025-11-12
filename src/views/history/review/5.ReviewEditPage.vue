<template>
  <div class="review-edit-page">
    <ReviewHeader
      title="Create Travel Review"
      :subtitle="reviewStore.tripTitle"
      step="5/6"
      @back="goBack"
    />

    <section class="review-section">
      <h6 class="section-title">
        <i class="bi bi-pencil-square me-2 text-primary"></i>
        Review & Edit
      </h6>

      <!-- 📸 Photos -->
      <div class="photo-section">
        <div class="photo-header d-flex justify-content-between align-items-center">
          <p class="photo-count">Photos ({{ photos.length }})</p>
          <button class="edit-btn" @click="showPhotoEditor = true">Edit Photos</button>
        </div>
        <div class="photo-carousel">
          <div v-for="(photo, index) in photos" :key="photo.id" class="photo-item">
            <img :src="photo.url" alt="photo" />
            <div v-if="photo.id === reviewStore.mainPhotoId" class="main-badge">🌟 Main Photo</div>
            <div class="photo-index">{{ index + 1 }}/{{ photos.length }}</div>
          </div>
        </div>
      </div>

      <!-- ✍️ Caption -->
      <div class="caption-section mt-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6>Caption</h6>
          <button class="change-btn" @click="showCaptionEditor = true">Change</button>
        </div>
        <textarea v-model="caption" rows="4" class="caption-box" maxlength="2200"></textarea>
        <p class="char-count">{{ caption.length }} characters</p>
      </div>

      <!-- 🏷️ Hashtags -->
      <div class="hashtag-section mt-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6>Hashtags</h6>
          <button class="change-btn" @click="showHashtagEditor = true">Change</button>
        </div>
        <div class="hashtag-box">
          <span v-for="tag in hashtags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <p class="tag-count">{{ hashtags.length }} hashtag(s)</p>
      </div>
    </section>

    <!-- 하단 버튼 -->
    <div class="navigation-buttons">
      <button class="btn-back" @click="goBack">Back</button>
      <button class="btn-next" @click="goNext">Next Step</button>
    </div>

    <!-- 🔶 모달 컴포넌트 -->
    <PhotoEditorModal v-if="showPhotoEditor" @close="showPhotoEditor = false" />
    <CaptionEditorModal v-if="showCaptionEditor" @close="showCaptionEditor = false" />
    <HashtagEditorModal v-if="showHashtagEditor" @close="showHashtagEditor = false" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useReviewStore } from "@/store/reviewStore";
import ReviewHeader from '@/components/common/DetailHeader.vue';
import PhotoEditorModal from '@/components/history/modals/1.PhotoEditorModal.vue';
import CaptionEditorModal from '@/components/history/modals/2.CaptionEditorModal.vue';
import HashtagEditorModal from '@/components/history/modals/3.HashtagEditorModal.vue';

const route = useRoute();
const router = useRouter();
const reviewStore = useReviewStore();

// store 데이터
const photos = computed(() => reviewStore.photos);
const caption = ref(reviewStore.caption || "");
const hashtags = computed(() => reviewStore.hashtags || []);

// 모달 상태
const showPhotoEditor = ref(false);
const showCaptionEditor = ref(false);
const showHashtagEditor = ref(false);

// 반응형 저장
watch(caption, (val) => reviewStore.caption = val);

const goBack = () => router.back();
const goNext = () => {
  reviewStore.setCaption(caption.value);
  router.push({ name: 'ReviewInstagramPreview', params: { tripId: route.params.tripId } });
};
</script>

<style scoped>
.review-edit-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 0.75rem 6rem; /* ✅ 좌우 padding 축소 */
}
.section-title { color: #1b3b6f; font-weight: 600; margin-bottom: 1rem; }
.edit-btn, .change-btn {
  background: none; border: none; color: #ff8c00; font-weight: 600; cursor: pointer;
}
.photo-carousel { 
  display: flex; 
  overflow-x: auto; 
  overflow-y: hidden;
  gap: 1rem; 
  scroll-behavior: smooth;
  padding-bottom: 0.5rem;
  margin: 0 -0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.photo-item { 
  position: relative; 
  flex: 0 0 90%; /* ✅ 75% → 90%로 증가하여 더 큼 */
  border-radius: 1rem; 
  overflow: hidden; 
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  aspect-ratio: 3 / 4; /* ✅ 세로 비율 추가 (반잘림 방지) */
}
.photo-item img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; /* ✅ contain에서 cover로 변경 */
}
.main-badge {
  position: absolute; top: .75rem; left: .75rem; background: #1b3b6f; color: #fff;
  font-size: .75rem; padding: .3rem .6rem; border-radius: .5rem;
}
.photo-index {
  position: absolute; top: .75rem; right: .75rem; background: rgba(0,0,0,0.6);
  color: white; font-size: .75rem; border-radius: 1rem; padding: .2rem .5rem;
}
.caption-box {
  width: 100%; border: 1px solid #ddd; border-radius: 1rem; padding: 1rem; background: #fff;
  font-size: 0.9rem; line-height: 1.5; resize: none; font-family: 'Kyobo2024', sans-serif;
}
.hashtag-box { display: flex; flex-wrap: wrap; background: #fff; border: 1px solid #ddd; border-radius: 1rem; padding: 1rem; gap: 0.5rem; }
.tag { background: #ff8c00; color: #fff; border-radius: 1rem; padding: 0.4rem 0.8rem; font-size: 0.85rem; }
.navigation-buttons {
  display: flex; justify-content: space-between; position: fixed; bottom: 1rem; left: 0; width: 100%; padding: 0 1.25rem;
}
.btn-back, .btn-next { flex: 1; height: 48px; border-radius: 1rem; border: none; font-weight: 600; font-size: 1rem; }
.btn-back { background: #fff; color: #1b3b6f; border: 2px solid #1b3b6f; margin-right: .75rem; }
.btn-next { background: #1b3b6f; color: #fff; }
</style>
