import HotelRecommendation from "@/views/planner/HotelRecommendation.vue";
import PlannerCreate from "@/views/planner/PlannerCreate.vue";
import TravelPlanForm from "@/views/planner/TravelPlanForm.vue";
import TripSummary from "@/views/planner/TripSummary.vue";
import PlannerEdit from '@/views/planner/PlannerEdit.vue'
import PlannerItinerary from '@/views/planner/PlannerItinerary.vue'
import PlannerChat from '@/views/planner/PlannerChat.vue'
import PlannerList from '@/views/planner/PlannerList.vue'
import PlannerListItinerary from '@/views/planner/PlannerListItinerary.vue'
import PlannerPage from "@/views/planner/PlannerPage.vue";
import HotelPayment from "@/views/planner/HotelPayment.vue";
import PaymentComplete from "@/views/planner/PaymentComplete.vue";
import BookingComplete from "@/views/planner/BookingComplete.vue";

const planner = [
  {
    path: '/planner',
    name: 'planner',
    component: PlannerPage,
    meta: { title: '플래너 메인' }
  },
  {
    path: '/planner/create',
    name: 'plannercreate',
    component: PlannerCreate,
    meta: { title: '새 플랜 생성' }
  },
  {
    path: '/planner/travelplan',
    name: 'travelplan',
    component: TravelPlanForm,
    meta: { title: '여행 계획 작성' }
  },
  {
    path: '/planner/edit',
    name: 'planedit',
    components: {
      default: PlannerEdit,
      left: PlannerChat,
      right: PlannerList,
    },
    meta: {
      layout: 'wide',
      split: true,
      title: '플랜 편집'
    },
  },
  {
    path: '/planner/itinerary',
    name: 'itinerary',
    components: {
      default: PlannerItinerary,
      left: PlannerChat,
      right: PlannerListItinerary,
    },
    meta: {
      layout: 'wide',
      split: true,
      title: '일정 확인'
    },
  },
  {
    path: '/planner/hotel',
    name: 'hotel',
    component: HotelRecommendation,
    meta: { title: '호텔 추천' }
  },
  {
    path: '/planner/summary',
    name: 'summary',
    component: TripSummary,
    meta: { title: '여행 요약' }
  },
  {
    path: '/planner/payment',
    name: 'payment',
    component: HotelPayment,
    meta: { title: '결제' }
  },
  {
    path: '/planner/payment-complete',
    name: 'paymentComplete',
    component: PaymentComplete,
    meta: { title: '결제 완료' }
  },
  {
    path: '/planner/booking-complete',
    name: 'bookingComplete',
    component: BookingComplete,
    meta: { title: '예약 완료' }
  }
];

export default planner;
