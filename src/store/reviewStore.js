import { defineStore } from 'pinia'

export const useReviewStore = defineStore('review', {
  state: () => ({
    planId: null,
    planTitle: '',
    reviewPostId: null, // 🔥 리뷰 생성(createReview)에서 받아옴
    photoGroupId: null, // 🔥 사진 업로드에 반드시 필요
    hashtagGroupId: null,

    photos: [],        // [{ id, url, file }]
    mainPhotoId: null,

    styleId: null,
    caption: '',

    aiHashtags: [],        // ✅ AI가 제안해 준 태그들
    selectedHashtags: [],  // ✅ 사용자가 최종 선택한 태그들
    step: 1,
  }),

  actions: {
    setTripInfo(id, title) {
      this.planId = id
      this.planTitle = title
    },
    // 🔥 createReview 호출 결과를 저장
    setReviewInfo(postId, pGroupId, hGroupId) {
      this.reviewPostId = postId
      this.photoGroupId = pGroupId
      this.hashtagGroupId = hGroupId
    },

    // ✅ 구조를 { id, url, file } 로 통일
    setPhotos(photoArray) {
      this.photos = photoArray.map((p, i) => ({
        id: p.id ?? i + 1,
        url: p.url,      // ✅ 항상 url 기준
        name: p.name,
        file: p.file ?? null,
        orderIndex: p.orderIndex ?? i,  // ← 순서 보존
        isMain: p.isMain ?? false,   // 🔥 추가
      }))
    },
    setMainPhoto(id) {
      this.mainPhotoId = id
    },
    setCaption(text) {
      this.caption = text
    },
    setAiHashtags(list) {
      this.aiHashtags = list
    },
    setHashtags(list) {
      this.selectedHashtags = list
    },
    nextStep() {
      this.step++
    },
    resetReview() {
      this.planId = null
      this.planTitle = ''
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
