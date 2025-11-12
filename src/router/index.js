// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 공통/기본 페이지
import LandingPage from '@/views/LandingPage.vue'

// 히스토리/리뷰
import HistoryMain from '@/views/history/HistoryMain.vue'
import EditProfile from '@/views/history/EditProfile.vue'
import CreateTravelReview from '@/views/history/CreateTravelReview.vue'
import ReviewPhotoOrder from '@/views/history/ReviewPhotoOrder.vue'

// 서포터
import SupporterMain from '@/views/supporter/SupporterMain.vue'

// 플래너 관련
import PlannerMain from '@/views/planner/PlannerMain.vue'
import TravelPlanForm from '@/views/planner/TravelPlanForm.vue'
import HotelRecommendation from '@/views/planner/HotelRecommendation.vue'



// 하위 라우트 묶음
import support from './supporter'
import planner from './planner'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/supporter', component: SupporterMain },
  { path: '/history', component: HistoryMain },
  
  // 프로필 편집
  { 
    path: '/profile/edit', 
    name: 'EditProfile',
    component: EditProfile 
  },

  // 여행 후기 작성
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

  // 나머지 묶음 라우트
  ...support,
  ...planner,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
