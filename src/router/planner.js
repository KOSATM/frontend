import PlannerCreate from "@/views/planner/PlannerCreate.vue";
import TravelPlanForm from "@/views/planner/TravelPlanForm.vue";


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
  }

];

export default planner;
