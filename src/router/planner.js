import HotelRecommendation from "@/views/planner/HotelRecommendation.vue";
import PlannerCreate from "@/views/planner/PlannerCreate.vue";
import TravelPlanForm from "@/views/planner/TravelPlanForm.vue";
import TripSummary from "@/views/planner/TripSummary.vue";
import PlannerEdit from '@/views/planner/PlannerEdit.vue'
import PlannerItinerary from '@/views/planner/PlannerItinerary.vue'
import PlannerChat from '@/views/planner/PlannerChat.vue'
import PlannerList from '@/views/planner/PlannerList.vue'
import PlannerListItinerary from '@/views/planner/PlannerListItinerary.vue'
import PlannerMain from "@/views/planner/PlannerMain.vue";
import HotelPayment from "@/views/planner/HotelPayment.vue";
import PaymentComplete from "@/views/planner/PaymentComplete.vue";
import BookingComplete from "@/views/planner/BookingComplete.vue";

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
    path: '/planner/itinerary',
    name: 'itinerary',
    components: {
      default: PlannerItinerary, // 프레임
      left: PlannerChat,    // LLM 영역
      right: PlannerListItinerary,   // 일정 리스트 (호텔 선택 버튼 없음)
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
  },
  {
    path: '/plannermain',
    name: 'plannermain',
    component: PlannerMain,
  },
  {
    path: '/planner/payment',
    name: 'payment',
    component: HotelPayment,
  },
  {
    path: '/planner/payment-complete',
    name: 'paymentComplete',
    component: PaymentComplete,
  },
  {
    path: '/planner/booking-complete',
    name: 'bookingComplete',
    component: BookingComplete,
  }

];

export default planner;
