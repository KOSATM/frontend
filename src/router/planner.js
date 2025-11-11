import PlannerCreate from "@/views/planner/PlannerCreate.vue";
import TravelPlanForm from "@/views/planner/TravelPlanForm.vue";
import HotelRecommendation from "@/views/planner/HotelRecommendation.vue";
import TripSummary from "@/views/planner/TripSummary.vue";

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
