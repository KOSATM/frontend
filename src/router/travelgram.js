// src/router/travelgram.js
import TravelgramMain from '@/views/travelgram/TravelgramMain.vue'

// 리뷰 작성 단계
import CreateTravelReview from '@/views/travelgram/review/CreateTravelReview.vue'
import PhotoOrder from '@/views/travelgram/review/PhotoOrder.vue'
import CaptionSelect from '@/views/travelgram/review/CaptionSelect.vue'
import HashtagSelect from '@/views/travelgram/review/HashtagSelect.vue'
import EditPage from '@/views/travelgram/review/EditPage.vue'
import InstagramPreview from '@/views/travelgram/review/InstagramPreview.vue'
import Complete from '@/views/travelgram/review/Complete.vue'

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
    name: 'PhotoOrder',
    component: PhotoOrder,
    props: true,
  },
  {
    path: '/travelgram/:tripId/caption',
    name: 'CaptionSelect',
    component: CaptionSelect,
    props: true,
  },
  {
    path: '/travelgram/:tripId/hashtags',
    name: 'ReviewHashtagSelect',
    component: HashtagSelect,
    props: true,
  },
  {
    path: '/travelgram/:tripId/edit',
    name: 'ReviewEditPage',
    component: EditPage,
    props: true,
  },
  {
    path: '/travelgram/:tripId/preview',
    name: 'ReviewInstagramPreview',
    component: InstagramPreview,
    props: true,
  },
  {
    path: '/travelgram/:tripId/complete',
    name: 'ReviewComplete',
    component: Complete,
    props: true,
  },
]
export default routes;