// src/router/travelgram.js
import TravelgramMain from '@/views/travelgram/TravelgramMain.vue'

// 리뷰 작성 단계
import CreateTravelReview from '@/views/travelgram/review/CreateTravelReview.vue'
import ReviewPhotoOrder from '@/views/travelgram/review/ReviewPhotoOrder.vue'
import ReviewCaptionSelect from '@/views/travelgram/review/ReviewCaptionSelect.vue'
import ReviewHashtagSelect from '@/views/travelgram/review/ReviewHashtagSelect.vue'
import ReviewEditPage from '@/views/travelgram/review/ReviewEditPage.vue'
import ReviewInstagramPreview from '@/views/travelgram/review/ReviewInstagramPreview.vue'
import ReviewComplete from '@/views/travelgram/review/ReviewComplete.vue'

const routes = [
  {
    path: '/travelgram',
    name: 'TravelgramMain',
    component: TravelgramMain,
  },
  {
    path: '/travelgram/:tripId/:tripTitle?',
    name: 'CreateTravelReview',
    component: CreateTravelReview,
    props: true,
  },
  {
    path: '/travelgram/:tripId/order',
    name: 'ReviewPhotoOrder',
    component: ReviewPhotoOrder,
    props: true,
  },
  {
    path: '/travelgram/:tripId/caption',
    name: 'ReviewCaptionSelect',
    component: ReviewCaptionSelect,
    props: true,
  },
  {
    path: '/travelgram/:tripId/hashtags',
    name: 'ReviewHashtagSelect',
    component: ReviewHashtagSelect,
    props: true,
  },
  {
    path: '/travelgram/:tripId/edit',
    name: 'ReviewEditPage',
    component: ReviewEditPage,
    props: true,
  },
  {
    path: '/travelgram/:tripId/preview',
    name: 'ReviewInstagramPreview',
    component: ReviewInstagramPreview,
    props: true,
  },
  {
    path: '/travelgram/:tripId/complete',
    name: 'ReviewComplete',
    component: ReviewComplete,
    props: true,
  },
]
export default routes;