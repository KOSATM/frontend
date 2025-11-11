import { createRouter, createWebHistory } from 'vue-router';
import HistoryMain from '@/views/history/HistoryMain.vue';
import CreateTravelReview from "@/views/history/CreateTravelReview.vue";
import ReviewPhotoOrder from '@/views/history/ReviewPhotoOrder.vue';
import SupporterMain from '@/views/supporter/SupporterMain.vue';
import PlannerMain from '@/views/planner/PlannerMain.vue';
import LandingPage from '@/views/LandingPage.vue';
import TravelPlanForm from '@/views/planner/TravelPlanForm.vue';
import HotelRecommendation from '@/views/planner/HotelRecommendation.vue';
import support from './supporter'
import planner from './planner';

const routes = [
  { path: '/', component: LandingPage },
  // { path: '/planner', component: PlannerMain },
  { path: '/supporter', component: SupporterMain },
  { path: '/history', component: HistoryMain }, // ✅ 여기서 연결
  {
    path: '/review/:tripId/:tripTitle?', // ✅ ? 붙이면 선택적
    name: "CreateTravelReview",
    component: CreateTravelReview,
    props: true, // ✅ props로 파라미터 전달
  },
  {
  path: '/review/:tripId/order',
  name: 'ReviewPhotoOrder',
  component: ReviewPhotoOrder,
  props: true
},
  // { path: '/planner', component: TravelPlanForm },
  // { path: '/planner', component: HotelRecommendation },
  ...support,
  ...planner
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
