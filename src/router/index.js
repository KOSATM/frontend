import { createRouter, createWebHistory } from 'vue-router'

// 기본/공통 페이지
import Supporter from '@/views/supporter/index.vue'
import Hotel from '@/views/planner/hotel/Recommendation.vue'
import CreatePlan from '@/views/planner/CreatePlan.vue'
import Travelgram from '@/views/travelgram/index.vue'
import MyProfile from '@/views/mypage/MyProfile.vue'

// 하위 모듈 라우트
import travelgram from './travelgram'
import planner from './planner'
import supporter from './supporter'
import mypage from './mypage'
import { useTravelStore } from '@/store/travelStore'
import OAuthCallback from '@/views/auth/OAuthCallback.vue'

const routes = [
  // OAuth 콜백 (하위 라우트보다 앞에)
  { path: '/login/oauth2/code/google', component: OAuthCallback },
  
  // 기본 라우트
  { path: '/', component: CreatePlan },
  { path: '/travelgram', component: Travelgram },
  { path: '/supporter', component: Supporter },
  { path: '/mypage', component: MyProfile },
  { path: '/planner/hotel', component: Hotel },
  
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

// router.beforeEach((to, from, next) => {
//   const travelStore = useTravelStore()

//   if (to.path === '/planner/edit' && !travelStore.isTraveling) {
//     return next('/')
//   }

//   next()
// })

export default router
