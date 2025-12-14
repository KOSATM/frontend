<template>
  <div class="review-edit-page">
  <PageHeader
    title="트래벌그램"
    subtitle="당신의 지난 여행 기록들"
    icon="bi-instagram"
  />

    <StepHeader
      title="여행 후기 편집"
      :subtitle="stepSubtitle"
      step="5/6"
      @back="goBack"
    />

    <section class="review-section">
      <h6 class="section-title">
        <i class="bi bi-pencil-square me-2 text-primary"></i>
        후기 & 편집
      </h6>

      <!-- 사진 영역 -->
      <div class="photo-section">
        <div class="photo-header d-flex justify-content-between align-items-center">
          <p class="photo-count">사진 ({{ photos.length }})</p>
        </div>

        <div class="photo-container">
          <div class="photo-carousel">
            <div
              v-for="(photo, index) in photos"
              :key="photo.id"
              class="photo-item"
            >
              <img :src="photo.url" alt="photo" />

              <div
                v-if="photo.id === reviewStore.mainPhotoId"
                class="main-badge"
              >
                🌟 대표 사진
              </div>

              <div class="photo-index">
                {{ index + 1 }}/{{ photos.length }}
              </div>
            </div>
          </div>

          <button
            v-if="photos.length > 1"
            class="nav-btn nav-prev"
            @click="prevPhoto"
            :disabled="currentPhotoIndex === 0"
          >
            <i class="bi bi-chevron-left"></i>
          </button>

          <button
            v-if="photos.length > 1"
            class="nav-btn nav-next"
            @click="nextPhoto"
            :disabled="currentPhotoIndex === photos.length - 1"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- 캡션 -->
      <div class="caption-section mt-4">
        <h6 class="mb-2">내용</h6>

        <textarea
          v-model="caption"
          rows="4"
          class="caption-box"
          maxlength="2200"
        ></textarea>

        <p class="char-count" :class="{ 'text-danger': captionByteLength > 2200 }">
          {{ captionByteLength }} / 2200 (바이트)
        </p>
      </div>

      <!-- 해시태그 -->
      <div class="hashtag-section mt-4">
        <h6 class="mb-2">해시태그</h6>

        <div class="hashtag-box">
          <span
            v-for="(tag, index) in selectedHashtags"
            :key="index"
            class="tag"
          >
            #{{ tag.name }}
          </span>
        </div>

        <p class="tag-count">{{ selectedHashtags.length }} 개</p>
      </div>
    </section>

    <NavigationButtons
      backText="뒤로가기"
      nextText="다음으로"
      :isNextDisabled="!canProceed"
      @back="goBack"
      @next="goNext"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import api from '@/api/travelgramApi'

import StepHeader from '@/components/common/header/StepHeader.vue'
import PageHeader from '@/components/common/header/PageHeader.vue'
import NavigationButtons from '@/components/common/button/NavigationButtons.vue'
import { JOURNEY_SUBTITLES } from '@/constants/journeySubtitles'

const router = useRouter()
const route = useRoute()
const reviewStore = useReviewStore()

const stepSubtitle = computed(() => JOURNEY_SUBTITLES[5])

const photos = computed(() => reviewStore.photos)
const caption = ref(reviewStore.caption || '')
const selectedHashtags = computed(() => reviewStore.selectedHashtags || [])

const currentPhotoIndex = ref(0)
const isSaving = ref(false)

const canProceed = computed(() => {
  return photos.value && photos.value.length > 0 && !isSaving.value
})

/* 바이트 계산 */
const captionByteLength = computed(() => {
  let total = 0
  for (let i = 0; i < caption.value.length; i++) {
    total += caption.value.charCodeAt(i) > 127 ? 2 : 1
  }
  return total
})

watch(caption, (val) => {
  reviewStore.caption = val
})

const prevPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
    scrollToPhoto()
  }
}

const nextPhoto = () => {
  if (currentPhotoIndex.value < photos.value.length - 1) {
    currentPhotoIndex.value++
    scrollToPhoto()
  }
}

const scrollToPhoto = () => {
  const carousel = document.querySelector('.photo-carousel')
  if (!carousel) return

  const item = carousel.querySelector('.photo-item')
  if (!item) return

  const itemWidth = item.offsetWidth + 16
  carousel.scrollLeft = currentPhotoIndex.value * itemWidth
}

const goBack = () => router.push({ name: 'HashtagSelect' })

const goNext = async () => {
  isSaving.value = true
  try {
    reviewStore.setCaption(caption.value)
    if (reviewStore.reviewPostId) {
      await api.updateCaption(reviewStore.reviewPostId, caption.value)
    }
    router.push({
      name: 'InstagramPreview',
      params: { planId: route.params.planId }
    })
  } catch (e) {
    alert('저장에 실패했습니다.')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.review-edit-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 0.75rem 6rem;
}

.section-title {
  color: #1b3b6f;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* 사진 */
.photo-container {
  position: relative;
}

.photo-carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 0.5rem;
  scroll-snap-type: x mandatory;
}

.photo-carousel::-webkit-scrollbar {
  display: none;
}

.photo-item {
  position: relative;
  flex: 0 0 90%;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  aspect-ratio: 3 / 4;
  scroll-snap-align: start;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: #1b3b6f;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
}

.photo-index {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 1rem;
  padding: 0.2rem 0.5rem;
}

/* 캡션 */
.caption-box {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 1rem;
  padding: 1rem;
  background: #fff;
  resize: none;
}

.char-count {
  text-align: right;
  color: #888;
  margin-top: 0.5rem;
}

.text-danger {
  color: #dc3545 !important;
}

/* 해시태그 */
.hashtag-box {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 1rem;
  padding: 1rem;
}

.tag {
  background: #ff8c00;
  color: white;
  border-radius: 1rem;
  padding: 0.4rem 0.8rem;
}

.tag-count {
  margin-top: 0.5rem;
  color: #888;
}
</style>
