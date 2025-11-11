// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 공통/기본 페이지
import LandingPage from '@/views/LandingPage.vue'

// 히스토리/리뷰
import HistoryMain from '@/views/history/HistoryMain.vue'
import CreateTravelReview from '@/views/history/CreateTravelReview.vue'
import ReviewPhotoOrder from '@/views/history/ReviewPhotoOrder.vue'

// 서포터
import SupporterMain from '@/views/supporter/SupporterMain.vue'

// 플래너 관련
import PlannerMain from '@/views/planner/PlannerMain.vue'
import TravelPlanForm from '@/views/planner/TravelPlanForm.vue'
import HotelRecommendation from '@/views/planner/HotelRecommendation.vue'

// 플래너 편집(좌우 분리)용
import PlannerEdit from '@/views/planner/PlannerEdit.vue'
import PlannerChat from '@/views/planner/PlannerChat.vue'
import PlannerList from '@/views/planner/PlannerList.vue'

// 하위 라우트 묶음
import support from './supporter'
import planner from './planner'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/supporter', component: SupporterMain },
  { path: '/history', component: HistoryMain },

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

  // 플래너 기본 흐름 (기존에 쓰던 거 유지)
  // { path: '/planner', component: PlannerMain },
  // { path: '/planner', component: TravelPlanForm },
  // 필요에 따라 아래 HotelRecommendation 하나만 노출
  {
    path: '/planner',
    component: HotelRecommendation,
  },

  // 너가 이번에 만든 좌/우 분할 편집 페이지
  {
    path: '/planner/edit',
    components: {
      default: PlannerEdit, // 프레임
      left: PlannerChat,    // LLM 영역
      right: PlannerList,   // 일정 리스트
    },
    meta: {
      layout: 'wide',
      split: true,
    },
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
