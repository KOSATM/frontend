import { createRouter, createWebHistory } from 'vue-router'

// 기본/공통 페이지
import LandingPage from '@/views/LandingPage.vue'
import SupporterMain from '@/views/supporter/SupporterMain.vue'
import TravelPlanForm from '@/views/planner/TravelPlanForm.vue'
import HotelRecommendation from '@/views/planner/HotelRecommendation.vue'
import PlannerCreate from '@/views/planner/PlannerCreate.vue'

// 하위 라우트 모듈
import history from './history'
import planner from './planner'
import supporter from './supporter'
import EditProfile from '@/views/history/EditProfile.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/supporter', component: SupporterMain },
  { path: '/planner', component: PlannerCreate },
  { path: '/planner/form', component: TravelPlanForm },
  { path: '/planner/hotel', component: HotelRecommendation },
  { path: '/profile/edit', component: EditProfile },

  // 하위 모듈 라우트 확장
  ...history,
  ...planner,
  ...supporter,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
