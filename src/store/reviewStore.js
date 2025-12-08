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

    // AI 관련 State
    generatedOptions: [], // 백엔드에서 받은 4가지 스타일 전체 데이터 ({style, hashtags})
    
    // 👇 선택된 정보들
    reviewStyleId: null, // [중요] 사용자가 선택한 스타일의 ID (DB 저장용)
    caption: '', // 선택된 캡션 (화면 표시용)
    selectedHashtags: [],  // ✅ 사용자가 최종 선택한 태그들

    step: 1,
  }),

  actions: {
    setplanInfo(id, title) {
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
    setGeneratedOptions(options) {
      this.generatedOptions = options
    },

    // [수정] 캡션 선택 시 캡션과 해시태그를 동시에 세팅
    selectStyleOption(option) {

      // 스타일 ID 저장 (나중에 DB 업데이트할 때 필수!)
      this.reviewStyleId = option.style.id
      // 캡션 저장
      this.caption = option.style.caption
      
      // 해당 스타일의 해시태그들을 초기 선택값으로 저장
      // (백엔드 구조: hashtags: [{name: 'food', ...}, ...])
      // 화면 표시를 위해 문자열 배열이나 객체 배열 그대로 저장
      this.selectedHashtags = option.hashtags
    },
    setHashtags(tags) {
      this.selectedHashtags = tags
    },
    nextStep() {
      this.step++
    },
    resetReview() {
      this.planId = null
      this.planTitle = ''
      this.reviewPostId = null
      this.groupId = null
      this.reviewStyleId = null
      this.photos = []
      this.mainPhotoId = null
      this.caption = ''
      this.selectedHashtags = []
      this.step = 1
    },
  },
})
