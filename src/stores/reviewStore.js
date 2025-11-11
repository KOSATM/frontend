import { defineStore } from 'pinia'

export const useReviewStore = defineStore('review', {
  state: () => ({
    tripId: null,
    tripTitle: '',
    photos: [],         // [{ id, src }]
    mainPhotoId: null,
    step: 1
  }),

  actions: {
    setTripInfo(id, title) {
      this.tripId = id
      this.tripTitle = title
    },
    setPhotos(photoArray) {
      this.photos = photoArray
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
    }
  }
})
