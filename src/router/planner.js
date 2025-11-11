import HotelRecommendation from "@/views/planner/HotelRecommendation.vue";
import PlannerCreate from "@/views/planner/PlannerCreate.vue";
import TravelPlanForm from "@/views/planner/TravelPlanForm.vue";
import TripSummary from "@/views/planner/TripSummary.vue";
import PlannerEdit from '@/views/planner/PlannerEdit.vue'
import PlannerChat from '@/views/planner/PlannerChat.vue'
import PlannerList from '@/views/planner/PlannerList.vue'

const planner = [
  {
    path: '/planner',
    name: 'planner',
    component: PlannerCreate,
  },
  {
    path: '/planner/travelplan',
    name: 'travelplan',
    component: TravelPlanForm,
  },
   {
      path: '/planner/edit',
      name: 'planedit',
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
  {
    path: '/planner/hotel',
    name: 'hotel',
    component: HotelRecommendation,
  },
  {
    path: '/planner/summary',
    name: 'summary',
    component: TripSummary,
  }

];

export default planner;
