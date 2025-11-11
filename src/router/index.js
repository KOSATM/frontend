// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 공통/기본 페이지
import LandingPage from '@/views/LandingPage.vue'
import SupporterMain from '@/views/supporter/SupporterMain.vue'
import HistoryMain from '@/views/history/HistoryMain.vue'

// 플래너 기본 흐름
// 필요하면 TravelPlanForm로 바꿔도 됨
import HotelRecommendation from '@/views/planner/HotelRecommendation.vue'

// 플래너 편집(좌우 분리)용
import PlannerEdit from '@/views/planner/PlannerEdit.vue'
import PlannerChat from '@/views/planner/PlannerChat.vue'
import PlannerList from '@/views/planner/PlannerList.vue'

const routes = [
  {
    path: '/',
    component: LandingPage,
    meta: { layout: 'default' },
  },
  {
    path: '/supporter',
    component: SupporterMain,
  },
  {
    path: '/history',
    component: HistoryMain,
  },
  // 일반 플래너 페이지 (기존 /planner 유지)
  {
    path: '/planner',
    component: HotelRecommendation,
  },
  // 좌/우로 나뉜 편집 페이지
  {
    path: '/planner/edit',
    components: {
      default: PlannerEdit, // 프레임
      left: PlannerChat,    // LLM
      right: PlannerList,   // 일정
    },
    meta: {
      layout: 'wide',
      split: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
