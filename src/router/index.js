import { createRouter, createWebHistory } from 'vue-router';
import HistoryMain from '@/views/history/HistoryMain.vue';
import SupporterMain from '@/views/supporter/SupporterMain.vue';
import PlannerMain from '@/views/planner/PlannerMain.vue';
import LandingPage from '@/views/LandingPage.vue';

const routes = [
  { path: '/', component: LandingPage },
  { path: '/planner', component: PlannerMain },
  { path: '/supporter', component: SupporterMain },
  { path: '/history', component: HistoryMain }, // ✅ 여기서 연결
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
