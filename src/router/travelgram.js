// src/router/travelgram.js
import TravelgramMain from '@/views/travelgram/TravelgramMain.vue'
import TripDetail from '@/views/travelgram/TripDetail.vue'

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
  path: '/travelgram/:tripId',
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
export default routes;