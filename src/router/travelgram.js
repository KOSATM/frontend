// src/router/history.js
import TravelgramMain from '@/views/history/TravelgramMain.vue'
import TripDetail from '@/views/history/TripDetail.vue'

// 리뷰 작성 단계
import CreateTravelReview from '@/views/history/review/CreateTravelReview.vue'
import ReviewPhotoOrder from '@/views/history/review/ReviewPhotoOrder.vue'
import ReviewCaptionSelect from '@/views/history/review/ReviewCaptionSelect.vue'
import ReviewHashtagSelect from '@/views/history/review/ReviewHashtagSelect.vue'
import ReviewEditPage from '@/views/history/review/ReviewEditPage.vue'
import ReviewInstagramPreview from '@/views/history/review/ReviewInstagramPreview.vue'
import ReviewComplete from '@/views/history/review/ReviewComplete.vue'

export default [
  {
    path: '/travelgram',
    name: 'TravelgramMain',
    component: TravelgramMain,
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
