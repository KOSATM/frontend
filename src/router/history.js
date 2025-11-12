// src/router/history.js
import HistoryMain from '@/views/history/0.HistoryMain.vue'
import TripDetail from '@/views/history/1.TripDetail.vue'

// 리뷰 작성 단계
import CreateTravelReview from '@/views/history/review/1.CreateTravelReview.vue'
import ReviewPhotoOrder from '@/views/history/review/2.ReviewPhotoOrder.vue'
import ReviewCaptionSelect from '@/views/history/review/3.ReviewCaptionSelect.vue'
import ReviewHashtagSelect from '@/views/history/review/4.ReviewHashtagSelect.vue'
import ReviewEditPage from '@/views/history/review/5.ReviewEditPage.vue'
import ReviewInstagramPreview from '@/views/history/review/6.ReviewInstagramPreview.vue'
import ReviewComplete from '@/views/history/review/7.ReviewComplete.vue'

export default [
  {
    path: '/history',
    name: 'HistoryMain',
    component: HistoryMain,
  },
  {
  path: '/history/:tripId',
  name: 'TripDetail',
  component: TripDetail,
  props: true,
  },
  {
    path: '/review/:tripId/:tripTitle?',
    name: 'CreateTravelReview',
    component: CreateTravelReview,
    props: true,
  },
  {
    path: '/review/:tripId/order',
    name: 'ReviewPhotoOrder',
    component: ReviewPhotoOrder,
    props: true,
  },
  {
    path: '/review/:tripId/caption',
    name: 'ReviewCaptionSelect',
    component: ReviewCaptionSelect,
    props: true,
  },
  {
    path: '/review/:tripId/hashtags',
    name: 'ReviewHashtagSelect',
    component: ReviewHashtagSelect,
    props: true,
  },
  {
    path: '/review/:tripId/edit',
    name: 'ReviewEditPage',
    component: ReviewEditPage,
    props: true,
  },
  {
    path: '/review/:tripId/preview',
    name: 'ReviewInstagramPreview',
    component: ReviewInstagramPreview,
    props: true,
  },
  {
    path: '/review/:tripId/complete',
    name: 'ReviewComplete',
    component: ReviewComplete,
    props: true,
  },
]
