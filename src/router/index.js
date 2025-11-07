import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/components/LandingPage.vue'
import PlannerPage from '@/components/PlannerPage.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/planner', component: PlannerPage },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
