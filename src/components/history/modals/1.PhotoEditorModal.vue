<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h5>🖼️ Arrange Photo Order</h5>
      <p class="text-muted">Reorder or select your main photo</p>

      <div v-for="(photo, index) in photos" :key="photo.id" class="photo-item">
        <img :src="photo.url" alt="photo" />
        <div class="controls">
          <button @click="moveUp(index)" :disabled="index === 0 || photos[index].id === reviewStore.mainPhotoId">↑</button>
          <button @click="moveDown(index)" :disabled="index === photos.length - 1 || photos[index].id === reviewStore.mainPhotoId">↓</button>
          <button @click="removePhoto(index)" :disabled="photos[index].id === reviewStore.mainPhotoId">✕</button>
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
  // ✅ 메인포토는 이동 불가
  if (photos.value[i].id === reviewStore.mainPhotoId) {
    alert('Main photo cannot be moved')
    return
  }
  // 메인포토 바로 아래 항목도 이동 불가
  if (i > 0 && photos.value[i - 1].id === reviewStore.mainPhotoId) {
    alert('Main photo must stay at the first position')
    return
  }
  
  if (i > 0) [photos.value[i - 1], photos.value[i]] = [photos.value[i], photos.value[i - 1]]
}

const moveDown = (i) => {
  // ✅ 메인포토는 이동 불가
  if (photos.value[i].id === reviewStore.mainPhotoId) {
    alert('Main photo cannot be moved')
    return
  }
  
  if (i < photos.value.length - 1) [photos.value[i + 1], photos.value[i]] = [photos.value[i], photos.value[i + 1]]
}

const removePhoto = (i) => {
  // ✅ 메인포토는 삭제 불가
  if (photos.value[i].id === reviewStore.mainPhotoId) {
    alert('Cannot delete main photo. Select another main photo first.')
    return
  }
  photos.value.splice(i, 1)
}

/* ✅ 메인포토 설정 - 선택 시 맨 앞으로 이동 */
const setMain = (id) => {
  // 이미 메인포토가 지정되었으면 그 사진을 원래 위치로 되돌림
  if (reviewStore.mainPhotoId && reviewStore.mainPhotoId !== id) {
    const oldMainIndex = photos.value.findIndex(p => p.id === reviewStore.mainPhotoId)
    if (oldMainIndex !== -1) {
      photos.value[oldMainIndex].isMain = false
    }
  }

  // 새 메인포토를 맨 앞으로 이동
  const newMainIndex = photos.value.findIndex(p => p.id === id)
  if (newMainIndex > 0) {
    const mainPhoto = photos.value.splice(newMainIndex, 1)[0]
    mainPhoto.isMain = true
    photos.value.unshift(mainPhoto)
  } else if (newMainIndex === 0) {
    photos.value[0].isMain = true
  }

  reviewStore.setMainPhoto(id)
}
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
