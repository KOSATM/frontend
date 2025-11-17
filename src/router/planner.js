import HotelRecommendation from "@/views/planner/hotel/HotelRecommendation.vue";
import CreatePlan from "@/views/planner/CreatePlan.vue";
import EditPlan from "@/views/planner/edit/EditPlan.vue";
import Chat from "@/views/planner/edit/Chat.vue";
import PlanList from "@/views/planner/edit/PlanList.vue";
import HotelPayment from "@/views/planner/hotel/HotelPayment.vue";
import BookingComplete from "@/views/planner/BookingComplete.vue";

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
    components: {
      default: EditPlan,
      left: Chat,
      right: PlanList,
    },
    meta: {
      layout: "wide",
      split: true,
      title: "플랜 편집",
    },
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
    component: HotelRecommendation,
    meta: { title: "호텔 추천" },
  },
  
  {
    path: "/planner/payment",
    name: "payment",
    component: HotelPayment,
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
