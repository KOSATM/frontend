<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h5>🖼️ Arrange Photo Order</h5>
      <p class="text-muted">Reorder or select your main photo</p>

      <div v-for="(photo, index) in photos" :key="photo.id" class="photo-item">
        <img :src="photo.url" alt="photo" />
        <div class="controls">
          <button @click="moveUp(index)" :disabled="index === 0">↑</button>
          <button @click="moveDown(index)" :disabled="index === photos.length - 1">↓</button>
          <button @click="removePhoto(index)">✕</button>
          <button :class="{ main: photo.id === reviewStore.mainPhotoId }" @click="setMain(photo.id)">★</button>
        </div>
      </div>

      <div class="btn-area">
        <button class="btn-close" @click="$emit('close')">Done</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useReviewStore } from '@/store/reviewStore'
const reviewStore = useReviewStore()
const photos = computed(() => reviewStore.photos)

const moveUp = (i) => {
  if (i > 0) [photos.value[i - 1], photos.value[i]] = [photos.value[i], photos.value[i - 1]]
}
const moveDown = (i) => {
  if (i < photos.value.length - 1) [photos.value[i + 1], photos.value[i]] = [photos.value[i], photos.value[i + 1]]
}
const removePhoto = (i) => photos.value.splice(i, 1)
const setMain = (id) => reviewStore.setMainPhoto(id)
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-content { background: #fffaf3; padding: 1.5rem; border-radius: 1rem; width: 90%; max-width: 700px; max-height: 80vh; overflow-y: auto; }
.photo-item { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; background: #fff; border-radius: .75rem; padding: .5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
.photo-item img { width: 100px; height: 80px; border-radius: .5rem; object-fit: cover; margin-right: 1rem; }
.controls button { margin: 0 .2rem; padding: .3rem .6rem; border-radius: .4rem; border: none; cursor: pointer; background: #1b3b6f; color: white; font-size: .8rem; }
.controls button.main { background: #ff8c00; }
.btn-close { background: #1b3b6f; color: white; border: none; padding: .6rem 1.2rem; border-radius: .8rem; margin-top: 1rem; float: right; }
</style>
