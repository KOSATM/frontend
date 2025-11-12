import { defineStore } from 'pinia'

export const useReviewStore = defineStore('review', {
  state: () => ({
    tripId: null,
    tripTitle: '',
    photos: [],        // [{ id, url, file }]
    mainPhotoId: null,
    step: 1,
  }),

  actions: {
    setTripInfo(id, title) {
      this.tripId = id
      this.tripTitle = title
    },
    // ✅ 구조를 { id, url, file } 로 통일
    setPhotos(photoArray) {
      this.photos = photoArray.map((p, i) => ({
        id: p.id ?? i + 1,
        url: p.url,      // ✅ 항상 url 기준
        name: p.name,
        file: p.file ?? null
      }))
    },
    setMainPhoto(id) {
      this.mainPhotoId = id
    },
    nextStep() {
      this.step++
    },
    resetReview() {
      this.tripId = null
      this.tripTitle = ''
      this.photos = []
      this.mainPhotoId = null
      this.step = 1
    },
  },
})
