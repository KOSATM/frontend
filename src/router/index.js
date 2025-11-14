import { createRouter, createWebHistory } from 'vue-router'

// 기본/공통 페이지
import LandingPage from '@/views/LandingPage.vue'
import SupporterMain from '@/views/supporter/SupporterMain.vue'
import TravelPlanForm from '@/views/planner/TravelPlanForm.vue'
import HotelRecommendation from '@/views/planner/HotelRecommendation.vue'
import PlannerCreate from '@/views/planner/PlannerCreate.vue'
import TravelgramMain from '@/views/travelgram/TravelgramMain.vue'
import MyProfile from '@/views/mypage/MyProfile.vue'

// 하위 모듈 라우트
import travelgram from './travelgram'
import planner from './planner'
import supporter from './supporter'
import mypage from './mypage'
import { useTravelStore } from '@/store/travelStore'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/travelgram', component: TravelgramMain },
  { path: '/supporter', component: SupporterMain },
  { path: '/mypage', component: MyProfile },
  { path: '/planner', component: PlannerCreate },
  { path: '/planner/form', component: TravelPlanForm },
  { path: '/planner/hotel', component: HotelRecommendation },

  // 하위 모듈 라우트 확장
  ...planner,
  ...supporter,
  ...travelgram,
  ...mypage,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const travelStore = useTravelStore()

  if (to.path === '/planner' && travelStore.isTraveling) {
    // 여행 중인 경우 전체 일정 목록으로 리다이렉트
    return next('/planner/edit')
  }

  next()
})

export default router
