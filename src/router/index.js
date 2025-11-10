import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/components/LandingPage.vue'
import PlannerCreate from '@/views/Planner/PlannerCreate.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/planner', component: PlannerCreate }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
