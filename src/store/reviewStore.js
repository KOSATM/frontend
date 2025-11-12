import { defineStore } from 'pinia'

export const useReviewStore = defineStore('review', {
  state: () => ({
    tripId: null,
    tripTitle: '',
    photos: [],        // [{ id, url, file }]
    mainPhotoId: null,
    caption: '',
    hashtags: [],
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
    setCaption(text) {
      this.caption = text
    },
    setHashtags(tags) {
      this.hashtags = tags
    },
    nextStep() {
      this.step++
    },
    resetReview() {
      this.tripId = null
      this.tripTitle = ''
      this.photos = []
      this.mainPhotoId = null
      this.caption = ''
      this.hashtags = []
      this.step = 1
    },
  },
})
