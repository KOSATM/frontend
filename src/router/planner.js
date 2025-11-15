import HotelRecommendation from "@/views/planner/hotel/HotelRecommendation.vue";
import PlannerCreate from "@/views/planner/PlannerCreate.vue";
import TravelPlanForm from "@/views/planner/TravelPlanForm.vue";
import PlannerEdit from "@/views/planner/edit/PlannerEdit.vue";
import PlannerChat from "@/views/planner/edit/PlannerChat.vue";
import PlannerList from "@/views/planner/edit/PlannerList.vue";
import HotelPayment from "@/views/planner/hotel/HotelPayment.vue";
import BookingComplete from "@/views/planner/BookingComplete.vue";

const planner = [
  {
    path: "/planner/create",
    name: "plannercreate",
    component: PlannerCreate,
    meta: { title: "새 플랜 생성" },
  },
  {
    path: "/planner/travelplan",
    name: "travelplan",
    component: TravelPlanForm,
    meta: { title: "여행 계획 작성" },
  },
  {
    path: "/planner/edit",
    name: "planedit",
    components: {
      default: PlannerEdit,
      left: PlannerChat,
      right: PlannerList,
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
      default: PlannerEdit,
      left: PlannerChat,
      right: PlannerList,
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
