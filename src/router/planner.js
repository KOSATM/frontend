import Hotel from "@/views/planner/hotel/Recommendation.vue";
import CreatePlan from "@/views/planner/CreatePlan.vue";
import EditPlan from "@/views/planner/edit/EditPlan.vue";
import Chat from "@/views/planner/edit/Chat.vue";
import PlanList from "@/views/planner/edit/PlanList.vue";
import Payment from "@/views/planner/hotel/Payment.vue";
import BookingComplete from "@/views/planner/BookingComplete.vue";
import PlannerSummary from "@/components/planner/PlannerSummary.vue";

const planner = [
  {
    path: "/planner/create",
    name: "plannercreate",
    component: CreatePlan,
    meta: { title: "새 플랜 생성" },
  },
  // {
  //   path: "/planner/travelplan",
  //   name: "travelplan",
  //   component: TravelPlanForm,
  //   meta: { title: "여행 계획 작성" },
  // },
  {
    path: "/planner/edit",
    name: "planedit",
    component: PlanList,
    meta: {
      title: "플랜 편집"
    },
  },
  {
    path: "/planner/summary",
    name: "plansummary",
    component: PlannerSummary,
    meta: { title: "플랜 요약" },
  },
  {
    path: "/planner/itinerary",
    name: "itinerary",
    components: {
      default: EditPlan,
      left: Chat,
      right: PlanList,
    },
    meta: {
      layout: "wide",
      split: true,
      title: "일정 확인",
    },
  },
  {
    path: "/planner/hotel",
    name: "hotel",
    component: Hotel,
    meta: { title: "호텔 추천" },
  },

  {
    path: "/planner/payment",
    name: "payment",
    component: Payment,
    meta: { title: "결제" },
  },

  {
    path: "/planner/booking-complete",
    name: "bookingComplete",
    component: BookingComplete,
    meta: { title: "예약 완료" },
  },
];

export default planner;
