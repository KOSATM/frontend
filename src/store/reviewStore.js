import { defineStore } from 'pinia'

export const useReviewStore = defineStore('review', {
  state: () => ({
    tripId: null,
    tripTitle: '',
    reviewPostId: null, // 🔥 리뷰 생성(createReview)에서 받아옴
    groupId: null, // 🔥 사진 업로드에 반드시 필요

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
    // 🔥 createReview 호출 결과를 저장
    setReviewInfo(postId, groupId) {
      this.reviewPostId = postId
      this.groupId = groupId
    },

    // ✅ 구조를 { id, url, file } 로 통일
    setPhotos(photoArray) {
      this.photos = photoArray.map((p, i) => ({
        id: p.id ?? i + 1,
        url: p.url,      // ✅ 항상 url 기준
        name: p.name,
        file: p.file ?? null,
        orderIndex: p.orderIndex ?? i  // ← 순서 보존
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
      this.reviewPostId = null
      this.groupId = null

      this.photos = []
      this.mainPhotoId = null
      this.caption = ''
      this.hashtags = []
      this.step = 1
    },
  },
})
