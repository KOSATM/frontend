<!-- src/views/planner/PlannerList.vue -->
<template>
  <section class="planner-right card shadow-sm rounded-4 h-100 d-flex flex-column">
    <!-- 상단 요약 -->
    <div class="p-4 pb-3 border-bottom">
      <!-- <StepHeader v-if="!travelStore.$state.isTraveling" :step="'2/4'" :title="'Check and Adjust Draft'" @back="goBack"/> -->
      <!-- <PageHeader title="Planner" subtitle="Create and manage your Seoul travel itinerary" icon="bi-map" />
      <StepHeader v-if="!travelStore.$state.isTraveling" :step="'2/4'" :title="'Check and Adjust Draft'"
        @back="goBack" /> -->
      <div class="d-flex gap-3 align-items-center mb-3">
        <div class="rounded-3 bg-secondary-subtle d-flex align-items-center justify-content-center"
          style="width: 46px; height: 46px">
          📅
        </div>
        <div>
          <!-- <h5 class="mb-1 title">Your 7-Day Seoul Adventure</h5> -->
          <h5 class="mb-1 title">{{ plan?.title || "Loading" }}</h5>
          <!-- <p class="text-muted small mb-0 sub">
            Nov 6 – Nov 12, 2025 • Seoul, Korea
          </p> -->
          <p class="text-muted small mb-0 sub">
            {{ plan?.startDate + " - " + plan?.endDate || "Nov 6 – Nov 12, 2025" }} • Seoul, Korea
          </p>
        </div>
      </div>

      <!-- 상단 예산 카드 -->
      <div class="row g-3">
        <div class="col-12 col-md-4" v-for="card in budget" :key="card.label">
          <div class="card border-0 shadow-sm rounded-3" :class="card.bg">
            <div class="card-body py-3">
              <p class="small text-muted mb-1 sub">{{ card.label }}</p>
              <h5 class="mb-0 title">{{ card.value }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ▶ Start Day Hero / Current Activity -->
    <div v-if="travelStore.$state.isTraveling" class="p-4 pt-3">
      <!-- 시작 전: Day 시작 화면 (클릭 가능) -->
      <div v-if="showNextDayHero" class="gradient-hero hero-clickable rounded-4 p-4 position-relative"
        :class="heroMeta.theme" @click="startDay(heroDay?.id || 1)">
        <div class="text-center hero-text">
          <h5 class="mb-1 title">Start Day {{ heroDay?.id || 1 }}</h5>

          <div class="sub">{{ heroDay?.title }}</div>
          <div class="sub small">{{ heroDay?.date }}</div>

          <hr class="hero-sep" />

          <div class="hero-stats">
            {{ heroDay?.places.length || 0 }} places
            <span class="dot">•</span>
            {{ formatCurrency(dayEstimatedCost(heroDay)) }}
          </div>
        </div>
      </div>

      <!-- 진행 중: 현재 액티비티 카드 -->
      <div v-else-if="run.started && currentDay && currentActivity"
        class="card border-0 shadow-sm rounded-4 mb-3 gradient-hero text-white" :class="heroMeta.theme">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="sub">
              <div class="fw-semibold">Current Activity</div>
              <div class="small opacity-75">
                Day {{ currentDay?.id }} • {{ currentActivity?.time }}
              </div>
            </div>
            <span class="badge-hero">Active</span>
          </div>

          <!-- 클릭 시 완료 모달 열기 -->
          <div class="run-panel rounded-4 px-3 py-3 mb-3" role="button" @click.stop="openCompleteForCurrent">
            <h6 class="mb-1 title">
              {{ currentActivity?.title || "—" }}
            </h6>
            <div class="sub small mb-1">
              ⏰ Scheduled {{ currentActivity?.time || "—" }}
            </div>
            <div class="sub small d-flex align-items-center gap-2">
              🕒 <span>Started at {{ startedAtClock }}</span>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mb-1 sub">
            <span>Day {{ currentDay?.id }} Progress</span>
            <span>{{ Math.round(dayProgress) }}%</span>
          </div>
          <div class="progress-hero" role="progressbar" :aria-valuenow="Math.round(dayProgress)" aria-valuemin="0"
            aria-valuemax="100" @click.stop="openCompleteForCurrent">
            <div class="progress-fill" :style="{ width: dayProgress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 본문 리스트 -->
    <div class="planner-scroll flex-grow-1 overflow-auto p-4 pt-3">
      <div class="d-flex flex-column gap-3">
        <DayCard v-for="(day, dIdx) in days" :key="day.id" :day="day" :dayIndex="dIdx" :openDayId="openDayId"
          :activityRowClass="activityRowClass" :getIconForType="getIconForType" :hasCost="hasCost"
          :formatCost="formatCost" @toggleDay="toggleDay(day.day.id)" @openDetails="openDetailsModal"
          @toggleComplete="toggleComplete" @openReplace="openReplaceModal" />
      </div>
    </div>

    <!-- CTA -->
    <div class="p-4 pt-0 border-top bg-white">
      <BaseButton v-if="!travelStore.$state.isTraveling" @click="next()" variant="primary" class="w-100 py-2">Next:
        Select Accommodation</BaseButton>
      <BaseButton v-else @click="endplan()" variant="success" class="w-100 py-2">FORCE to End plan</BaseButton>
    </div>
  </section>

  <!-- 모달 컴포넌트들 -->
  <ReplaceModal :open="replaceModal.open" :target="replaceModal.target" :alternatives="replaceModal.alternatives"
    @close="closeReplaceModal" @preview-alt="previewAlt" @apply-replacement="applyReplacement"
    @delete-anyway="deleteAnyway" />

  <ActivityDetailsModal :open="detailsModal.open" :data="detailsModal.data" :spend-input="detailsModal.spendInput"
    @update:spend-input="detailsModal.spendInput = $event" @close="closeDetailsModal" @save-spent="saveSpent"
    @open-replace="openReplaceFromDetails" />

  <ActivityCompleteModal :open="completeModal.open" :title="completeModal.title" :spend-input="completeModal.spendInput"
    :comment="completeModal.comment" :quick-stats="currentQuickStats"
    @update:spend-input="completeModal.spendInput = $event" @update:comment="completeModal.comment = $event"
    @close="closeCompleteModal" @confirm="completeCurrentActivity" />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import PageHeader from "@/components/common/PageHeader.vue";
import ReplaceModal from "@/components/planner/ReplaceModal.vue";
import ActivityDetailsModal from "@/components/planner/ActivityDetailsModal.vue";
import ActivityCompleteModal from "@/components/planner/ActivityCompleteModal.vue";
import { useTravelStore } from "@/store/travelStore";
import BaseButton from "@/components/common/BaseButton.vue";
import ActivityList from "@/components/planner/ActivityList.vue";
import DayCard from "@/components/planner/DayCard.vue";
import plannerApi from "@/api/plannerApi";
import { useAuthStore } from "@/store/authStore";
import { watch } from "vue";
import { useChatStore } from "@/store/chatStore";




const authStore = useAuthStore();

// 간단한 더미 갤러리 (photo1/2/3)
const defaultGallery = [
  "https://placehold.co/540x320?text=Photo+1",
  "https://placehold.co/540x320?text=Photo+2",
  "https://placehold.co/540x320?text=Photo+3",
];

const router = useRouter();
const travelStore = useTravelStore();
const chatStore = useChatStore();

const openDayId = ref(1); // 화면에서 펼쳐진 Day
const run = ref({
  started: false,
  startedAt: null,
  dayId: null, // ✅ 실제 진행 중인 Day
});

const budget = ref([
  { label: "Total Budget", value: "$2000", bg: "bg-warning-subtle" },
  { label: "Estimated Cost", value: "$1800", bg: "bg-info-subtle" },
  { label: "Remaining", value: "$200", bg: "bg-success-subtle" },
]);

const plan = ref(null);
const days = ref(null);

// ✅ 7일 일정
// const days = ref([
//   {
//     id: 1,
//     title: "Arrival & Gangnam Exploration",
//     date: "Nov 6, 2025",
//     dailyCost: 80,
//     places: [
//       {
//         title: "Welcome Lunch (Gangnam)",
//         time: "12:30 PM",
//         type: "food",
//         cost: 14,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Welcome Lunch (Gangnam)",
//           cost: 14,
//           address: "123 Teheran-ro, Gangnam-gu, Seoul",
//           area: "Gangnam",
//           hours: "11:00–15:00",
//           desc: "Casual Korean restaurant in Gangnam with set menus perfect after arrival.",
//           gallery: defaultGallery,
//           imageQuery: "Gangnam Korean lunch restaurant",
//         },
//       },
//       {
//         title: "COEX & Starfield Library",
//         time: "2:00 PM",
//         type: "shopping",
//         cost: 0,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "COEX & Starfield Library",
//           cost: 0,
//           address: "513 Yeongdong-daero, Gangnam-gu, Seoul",
//           area: "COEX",
//           hours: "10:00–22:00",
//           desc: "Iconic mall and photogenic library with huge bookshelves.",
//           gallery: defaultGallery,
//           imageQuery: "COEX Starfield Library",
//         },
//       },
//       {
//         title: "Bongeunsa Temple",
//         time: "4:00 PM",
//         type: "walk",
//         cost: 0,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Bongeunsa Temple",
//           cost: 0,
//           address: "531 Bongeunsa-ro, Gangnam-gu, Seoul",
//           area: "Bongeunsa",
//           hours: "05:00–21:00",
//           desc: "Peaceful Buddhist temple across from COEX with lanterns and courtyards.",
//           gallery: defaultGallery,
//           imageQuery: "Bongeunsa Temple Seoul",
//         },
//       },
//       {
//         title: "Garosu-gil Stroll",
//         time: "5:30 PM",
//         type: "walk",
//         cost: 0,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Garosu-gil Stroll",
//           cost: 0,
//           address: "Sinsa-dong, Gangnam-gu, Seoul",
//           area: "Sinsa",
//           hours: "Always open",
//           desc: "Trendy street with cafes and boutiques, great for a golden-hour walk.",
//           gallery: defaultGallery,
//           imageQuery: "Garosu-gil Sinsa street",
//         },
//       },
//       {
//         title: "Dinner at Local Bistro",
//         time: "7:00 PM",
//         type: "food",
//         cost: 22,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Dinner at Local Bistro",
//           cost: 22,
//           address: "45 Apgujeong-ro, Gangnam-gu, Seoul",
//           area: "Apgujeong",
//           hours: "17:00–23:00",
//           desc: "Modern Korean bistro with shared plates and good drinks.",
//           gallery: defaultGallery,
//           imageQuery: "Apgujeong Korean bistro",
//         },
//       },
//       {
//         title: "Cheonggyecheon Night View",
//         time: "9:00 PM",
//         type: "view",
//         cost: 0,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Cheonggyecheon Night View",
//           cost: 0,
//           address: "Cheonggyecheon-ro, Jongno-gu, Seoul",
//           area: "City Hall",
//           hours: "Always open",
//           desc: "Night stroll along the stream with city lights and photo spots.",
//           gallery: defaultGallery,
//           imageQuery: "Cheonggyecheon night view",
//         },
//       },
//     ],
//   },
//   {
//     id: 2,
//     title: "Palace & Hanbok Experience",
//     date: "Nov 7, 2025",
//     dailyCost: 62,
//     places: [
//       {
//         title: "Breakfast at Local Cafe",
//         time: "8:30 AM",
//         type: "cafe",
//         cost: 8,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Breakfast at Local Cafe",
//           cost: 8,
//           address: "Jongno 3-ga, Jongno-gu, Seoul",
//           area: "Jongno",
//           hours: "08:00–18:00",
//           desc: "Small neighborhood cafe with good drip coffee and pastries.",
//           gallery: defaultGallery,
//           imageQuery: "Jongno cafe breakfast",
//         },
//       },
//       {
//         title: "Gyeongbokgung Palace",
//         time: "10:00 AM",
//         type: "palace",
//         cost: 0,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Gyeongbokgung Palace",
//           cost: 0,
//           address: "161 Sajik-ro, Jongno-gu, Seoul",
//           area: "Gyeongbokgung",
//           hours: "09:00–18:00 (Tue closed)",
//           desc: "Main royal palace of the Joseon dynasty with grand courtyards.",
//           gallery: defaultGallery,
//           imageQuery: "Gyeongbokgung Palace",
//         },
//       },
//       {
//         title: "Hanbok Rental",
//         time: "12:00 PM",
//         type: "shopping",
//         cost: 15,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Hanbok Rental",
//           cost: 15,
//           address: "Inside Hanbok street near Gyeongbokgung",
//           area: "Hanbok Street",
//           hours: "09:00–19:00",
//           desc: "Rent traditional hanbok to take photos around the palace area.",
//           gallery: defaultGallery,
//           imageQuery: "Seoul hanbok rental",
//         },
//       },
//       {
//         title: "Bukchon Hanok Village",
//         time: "2:00 PM",
//         type: "walk",
//         cost: 0,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Bukchon Hanok Village",
//           cost: 0,
//           address: "37 Gyedong-gil, Jongno-gu, Seoul",
//           area: "Bukchon",
//           hours: "Always open",
//           desc: "Traditional Korean houses with small galleries and viewpoints.",
//           gallery: defaultGallery,
//           imageQuery: "Bukchon Hanok Village",
//         },
//       },
//       {
//         title: "Insadong Tea Time",
//         time: "4:00 PM",
//         type: "dessert",
//         cost: 7,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Insadong Tea Time",
//           cost: 7,
//           address: "62-1 Insadong-gil, Jongno-gu, Seoul",
//           area: "Insadong",
//           hours: "11:00–22:00",
//           desc: "Teahouse tucked inside an alley, serving Korean traditional tea.",
//           gallery: defaultGallery,
//           imageQuery: "Insadong traditional tea house",
//         },
//       },
//       {
//         title: "Jongno Dinner",
//         time: "6:30 PM",
//         type: "food",
//         cost: 18,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Jongno Dinner",
//           cost: 18,
//           address: "Ikseon-dong, Jongno-gu, Seoul",
//           area: "Ikseon-dong",
//           hours: "17:00–23:30",
//           desc: "Lively restaurant street with barbecue and pubs.",
//           gallery: defaultGallery,
//           imageQuery: "Ikseon-dong dinner street",
//         },
//       },
//     ],
//   },
//   {
//     id: 3,
//     title: "Hongdae & Nightlife",
//     date: "Nov 8, 2025",
//     dailyCost: 70,
//     places: [
//       {
//         title: "Brunch in Hongdae",
//         time: "11:00 AM",
//         type: "brunch",
//         cost: 15,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Brunch in Hongdae",
//           cost: 15,
//           address: "Hongik-ro, Mapo-gu, Seoul",
//           area: "Hongdae",
//           hours: "10:00–15:00",
//           desc: "Trendy brunch spot popular with students.",
//           gallery: defaultGallery,
//           imageQuery: "Hongdae brunch cafe",
//         },
//       },
//       {
//         title: "Street Art Walk",
//         time: "1:00 PM",
//         type: "walk",
//         cost: 0,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Street Art Walk",
//           cost: 0,
//           address: "Hongdae Mural Street",
//           area: "Hongdae",
//           hours: "Always open",
//           desc: "Explore murals and small shops in backstreets.",
//           gallery: defaultGallery,
//           imageQuery: "Hongdae street art",
//         },
//       },
//       {
//         title: "Shopping & Cafe Hopping",
//         time: "3:00 PM",
//         type: "shopping",
//         cost: 20,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Shopping & Cafe Hopping",
//           cost: 20,
//           address: "Hongdae Shopping Street",
//           area: "Hongdae",
//           hours: "11:00–22:00",
//           desc: "Free time to shop and explore cafes.",
//           gallery: defaultGallery,
//           imageQuery: "Hongdae shopping street",
//         },
//       },
//       {
//         title: "Hongdae Nightlife",
//         time: "8:00 PM",
//         type: "view",
//         cost: 35,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Hongdae Nightlife",
//           cost: 35,
//           address: "Hongdae Club Street",
//           area: "Hongdae",
//           hours: "20:00–Late",
//           desc: "Bars, live music, and street performances.",
//           gallery: defaultGallery,
//           imageQuery: "Hongdae nightlife",
//         },
//       },
//     ],
//   },
//   {
//     id: 4,
//     title: "Namsan & Myeongdong",
//     date: "Nov 9, 2025",
//     dailyCost: 65,
//     places: [
//       {
//         title: "Cable Car to Namsan Tower",
//         time: "10:00 AM",
//         type: "tower",
//         cost: 14,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Cable Car to Namsan Tower",
//           cost: 14,
//           address: "105 Namsangongwon-gil, Yongsan-gu, Seoul",
//           area: "Namsan",
//           hours: "10:00–23:00",
//           desc: "Ride up to Namsan Tower for views over Seoul.",
//           gallery: defaultGallery,
//           imageQuery: "Namsan cable car",
//         },
//       },
//       {
//         title: "Namsan Tower Observatory",
//         time: "11:00 AM",
//         type: "view",
//         cost: 12,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Namsan Tower Observatory",
//           cost: 12,
//           address: "N Seoul Tower Observatory",
//           area: "Namsan",
//           hours: "10:00–23:00",
//           desc: "Love locks and 360-degree views.",
//           gallery: defaultGallery,
//           imageQuery: "N Seoul Tower observatory",
//         },
//       },
//       {
//         title: "Myeongdong Street Food",
//         time: "5:00 PM",
//         type: "food",
//         cost: 18,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Myeongdong Street Food",
//           cost: 18,
//           address: "Myeong-dong, Jung-gu, Seoul",
//           area: "Myeongdong",
//           hours: "16:00–22:00",
//           desc: "Try tteokbokki, hotteok, and more.",
//           gallery: defaultGallery,
//           imageQuery: "Myeongdong street food",
//         },
//       },
//     ],
//   },
//   {
//     id: 5,
//     title: "Han River Chill Day",
//     date: "Nov 10, 2025",
//     dailyCost: 40,
//     places: [
//       {
//         title: "Lazy Morning",
//         time: "10:00 AM",
//         type: "view",
//         cost: 0,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Lazy Morning",
//           cost: 0,
//           address: "Your hotel",
//           area: "Seoul",
//           hours: "Anytime",
//           desc: "Free time to rest or explore nearby.",
//           gallery: defaultGallery,
//           imageQuery: "Seoul hotel room morning",
//         },
//       },
//       {
//         title: "Han River Picnic",
//         time: "2:00 PM",
//         type: "walk",
//         cost: 10,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Han River Picnic",
//           cost: 10,
//           address: "Yeouido Hangang Park",
//           area: "Yeouido",
//           hours: "Always open",
//           desc: "Rent mats, order chicken, and relax by the river.",
//           gallery: defaultGallery,
//           imageQuery: "Yeouido Hangang Park picnic",
//         },
//       },
//       {
//         title: "Han River Night Cruise",
//         time: "8:00 PM",
//         type: "view",
//         cost: 30,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Han River Night Cruise",
//           cost: 30,
//           address: "Yeouido Ferry Terminal",
//           area: "Yeouido",
//           hours: "19:00–22:00",
//           desc: "Night cruise with city lights.",
//           gallery: defaultGallery,
//           imageQuery: "Han River night cruise",
//         },
//       },
//     ],
//   },
//   {
//     id: 6,
//     title: "Gangwon Day plan",
//     date: "Nov 11, 2025",
//     dailyCost: 120,
//     places: [
//       {
//         title: "Train to Gangneung",
//         time: "8:00 AM",
//         type: "view",
//         cost: 40,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Train to Gangneung",
//           cost: 40,
//           address: "Seoul Station → Gangneung Station",
//           area: "Gangwon",
//           hours: "08:00–11:00",
//           desc: "Scenic KTX ride to the east coast.",
//           gallery: defaultGallery,
//           imageQuery: "KTX train to Gangneung",
//         },
//       },
//       {
//         title: "Beach Walk",
//         time: "12:00 PM",
//         type: "walk",
//         cost: 0,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Beach Walk",
//           cost: 0,
//           address: "Gyeongpo Beach",
//           area: "Gangneung",
//           hours: "Always open",
//           desc: "Walk along the beach and take photos.",
//           gallery: defaultGallery,
//           imageQuery: "Gyeongpo Beach Gangneung",
//         },
//       },
//       {
//         title: "Seafood Lunch",
//         time: "1:30 PM",
//         type: "food",
//         cost: 25,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Seafood Lunch",
//           cost: 25,
//           address: "Anmok Port seafood street",
//           area: "Gangneung",
//           hours: "11:00–20:00",
//           desc: "Fresh grilled fish and sashimi.",
//           gallery: defaultGallery,
//           imageQuery: "Gangneung seafood restaurant",
//         },
//       },
//     ],
//   },
//   {
//     id: 7,
//     title: "Last-minute Shopping & Departure",
//     date: "Nov 12, 2025",
//     dailyCost: 90,
//     places: [
//       {
//         title: "Packing & Checkout",
//         time: "10:00 AM",
//         type: "view",
//         cost: 0,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Packing & Checkout",
//           cost: 0,
//           address: "Your hotel",
//           area: "Seoul",
//           hours: "Morning",
//           desc: "Pack your luggage and check out.",
//           gallery: defaultGallery,
//           imageQuery: "Hotel packing luggage",
//         },
//       },
//       {
//         title: "Last-minute Shopping",
//         time: "1:00 PM",
//         type: "shopping",
//         cost: 40,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Last-minute Shopping",
//           cost: 40,
//           address: "Lotte Department Store Myeongdong",
//           area: "Myeongdong",
//           hours: "10:30–20:00",
//           desc: "Pick up souvenirs and snacks.",
//           gallery: defaultGallery,
//           imageQuery: "Lotte Department Store Myeongdong",
//         },
//       },
//       {
//         title: "Airport Transfer",
//         time: "4:00 PM",
//         type: "view",
//         cost: 50,
//         completed: false,
//         spent: null,
//         note: null,
//         details: {
//           title: "Airport Transfer",
//           cost: 50,
//           address: "Seoul → Incheon Airport",
//           area: "Incheon Airport",
//           hours: "Depends on flight",
//           desc: "Move to the airport with enough buffer time.",
//           gallery: defaultGallery,
//           imageQuery: "Seoul to Incheon Airport limousine bus",
//         },
//       },
//     ],
//   },
// ]);

/* 교체/삭제 모달 상태 */
const replaceModal = ref({
  open: false,
  dayIndex: null,
  actIndex: null,
  target: null,
  alternatives: [],
});

/* 상세 모달 상태 */
const detailsModal = ref({
  open: false,
  dayIndex: null,
  actIndex: null,
  data: null,
  spendInput: null,
});

/* 현재 액티비티 완료 모달 상태 */
const completeModal = ref({
  open: false,
  dayIndex: null,
  actIndex: null,
  title: "",
  spendInput: null,
  comment: "",
});

// ✅ 실제 진행 중인 Day만 추적 (openDayId와 무관)
const currentDay = computed(() => {
  if (run.value.started && run.value.dayId != null) {
    return days.value.find((d) => d.day.id === run.value.dayId) || null;
  }
  return null; // 진행 중이 아니면 null
});

const currentDayIndex = computed(() => {
  if (run.value.started && run.value.dayId != null) {
    return days.value.findIndex((d) => d.day.id === run.value.dayId);
  }
  return -1; // 진행 중이 아니면 -1
});

const currentActivityIndex = computed(() => {
  if (!currentDay.value) return 0;
  const idx = currentDay.value.places.findIndex((a) => !a.completed);
  return idx === -1 ? currentDay.value.places.length - 1 : idx;
});

const currentActivity = computed(() => {
  return currentDay.value?.places?.[currentActivityIndex.value] || null;
});

const dayProgress = computed(() => {
  return progressOf(currentDay.value);
});

const startedAtClock = computed(() => {
  if (!run.value.startedAt) return "—";
  const d = new Date(run.value.startedAt);
  const mm = d.getMinutes().toString().padStart(2, "0");
  const hh24 = d.getHours();
  const ap = hh24 >= 12 ? "PM" : "AM";
  const hh = hh24 % 12 || 12;
  return `${hh}:${mm} ${ap}`;
});

const currentDurationText = computed(() => {
  if (!run.value.startedAt) return "—";
  const diffMs = Date.now() - run.value.startedAt;
  const mins = Math.max(1, Math.round(diffMs / 60000));
  return `~${mins}m`;
});

const currentStatusText = computed(() => {
  if (!currentActivity.value) return "—";
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const sched = parseTime(currentActivity.value.time);
  const diff = nowMin - sched;
  if (Math.abs(diff) <= 20) return "On schedule ✓";
  if (diff < -20) return "A bit early";
  return "Running late";
});

const currentQuickStats = computed(() => {
  return {
    started: startedAtClock.value,
    duration: currentDurationText.value,
    status: currentStatusText.value,
  };
});

// Hero Day (다음 시작할 Day)
const heroDay = computed(() => {
  // 다음 시작할 Day (미완료 액티비티가 있는 첫 번째 Day)
  return (
    days.value.find((d) => d.places.some((a) => new Date(a.endAt) > new Date())) ||
    days.value[0]
  );
});

// Day 시작 화면 표시 여부
const showNextDayHero = computed(() => {
  if (!travelStore.$state.isTraveling) return false;

  // 아직 여행을 시작하지 않았거나
  if (!run.value.started) return true;

  // 진행 중인 Day의 모든 액티비티가 완료되었을 때
  if (run.value.started && currentDay.value) {
    const allCompleted = currentDay.value.places.every((a) => a.completed);
    return allCompleted;
  }

  return false;
});

// Cost calculation functions
const dayEstimatedCost = (day) => {
  if (!day?.places) return 0;
  return day.places.reduce((sum, a) => sum + (a.cost || 0), 0);
};

const dayActualCost = (day) => {
  if (!day?.places) return 0;
  return day.places.reduce((sum, a) => {
    const spent = typeof a.spent === "number" ? a.spent : 0;
    return sum + spent;
  }, 0);
};

const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "$0";
  return `$${amount.toFixed(0)}`;
};

// Methods
const goBack = () => {
  travelStore.decreaseStep();
  router.push("/planner/travelplan");
};

const next = () => {
  travelStore.increaseStep();
  router.push("/planner/hotel");
};

const endplan = () => {
  travelStore.endTravel();
  travelStore.resetStep();
  router.push("/planner");
};

const renderPlan = async () => {
  const res = await plannerApi.getActivePlan(authStore.userId);
  console.log(res.data);
  plan.value = res.data.data.plan;
  days.value = res.data.data.days;
  days.value = days.value.sort((a, b) => new Date(a.day.planDate) - new Date(b.day.planDate))
  console.log(plan.value);
  console.log(days.value);

  // 현재 여행 여부를 판단하고 store에 정보 저장
  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);
  const dateString = year + '-' + month + '-' + day;

  const startDate = plan.value.startDate;
  const endDate = plan.value.endDate;

  if (today >= new Date(startDate) && today <= new Date(endDate)) {
    travelStore.isTraveling = true;
  } else {
    travelStore.isTraveling = false;
  }

  const diffTime = today - new Date(startDate);
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  travelStore.setPlanInfo(plan.value.id, Math.min(7, Math.max(0, Math.ceil(diffDays))), dateString);
}

/* 공통 유틸 */
// ✅ 아코디언 토글: 같은 카드 클릭 시 닫기 가능
const toggleDay = (id) => {
  console.log("id", id)
  console.log("openDayId", openDayId.value)
  if (openDayId.value === id) {
    openDayId.value = null; // 같은 카드 클릭 시 닫기
  } else {
    openDayId.value = id; // 다른 카드 열기
  }
};

const getIconForType = (type) => {
  const map = {
    cafe: "☕",
    food: "🍜",
    brunch: "🥞",
    dessert: "🍰",
    palace: "🏯",
    museum: "🏛️",
    tower: "🗼",
    walk: "🚶",
    shopping: "🛍️",
    market: "🧺",
    view: "🌇",
    default: "📍",
  };
  return map[type] || map.default;
};

const hasCost = (cost) => {
  return cost === 0 || (typeof cost === "number" && !Number.isNaN(cost));
};

const formatCost = (cost) => {
  if (cost === 0) return "Free";
  if (typeof cost === "number") return `$${cost}`;
  return "";
};

const parseTime = (t) => {
  const [hm, ap] = (t || "").split(" ");
  let [h, m] = (hm || "0:00").split(":").map(Number);
  if ((ap || "").toUpperCase() === "PM" && h !== 12) h += 12;
  if ((ap || "").toUpperCase() === "AM" && h === 12) h = 0;
  return h * 60 + m;
};

const formatTime = (mins) => {
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  const ap = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ap}`;
};

const progressOf = (day) => {
  if (!day?.places?.length) return 0;
  const total = day.places.length;
  const done = day.places.filter((a) => a.completed).length;
  return Math.min(100, Math.max(0, (done / total) * 100));
};

/* 상태 계산: 시작 전 / 진행 중 / 완료 후 */
const activityStatus = (dayIndex, actIndex) => {
  console.log("dayIndex", dayIndex);
  console.log("days", days.value);
  const day = days.value[dayIndex];
  const act = day.places[actIndex];

  if (act.completed) return "done";

  if (
    run.value.started &&
    dayIndex === currentDayIndex.value &&
    actIndex === currentActivityIndex.value
  ) {
    return "current";
  }

  return "upcoming";
};

const activityRowClass = (dayIndex, actIndex) => {
  const status = activityStatus(dayIndex, actIndex);
  if (status === "current") return "activity-row--current";
  if (status === "done") return "activity-row--done";
  return "activity-row--upcoming";
};

/* 완료 토글 (되돌리기만) */
const toggleComplete = (dayIndex, actIndex) => {
  const day = days.value[dayIndex];
  if (!day) return;
  const act = day.places[actIndex];
  if (!act) return;

  if (act.completed) {
    act.completed = false;
    act.spent = null;
    act.note = null;
  }
};

/* 시작/진행 */
const startDay = (dayId) => {
  console.log("heroDay", heroDay)
  console.log("run", run.value);
  if (run.value.started) return;
  const day = days.value.find((d) => d.day.id === dayId);
  console.log("days", days);
  console.log("day", day);
  console.log("dayId", dayId);
  if (!day) return;
  openDayId.value = dayId;
  run.value.started = true;
  run.value.startedAt = Date.now();
  run.value.dayId = dayId; // ✅ 진행 중인 Day 저장
  // 모든 액티비티는 미완료 상태 그대로 → 첫 번째 일정부터 진행
};

/* 현재 액티비티 완료 모달 열기 */
const openCompleteForCurrent = () => {
  if (!currentDay.value || !currentActivity.value) return;
  const dIdx = currentDayIndex.value;
  const aIdx = currentActivityIndex.value;
  completeModal.value = {
    open: true,
    dayIndex: dIdx,
    actIndex: aIdx,
    title: currentActivity.value.title,
    spendInput: currentActivity.value.spent ?? null,
    comment: currentActivity.value.note || "",
  };
};

const closeCompleteModal = () => {
  completeModal.value.open = false;
};

/* 상세 모달 */
const openDetailsModal = (dayIndex, actIndex) => {
  const act = days.value[dayIndex].places[actIndex];
  const details = act.details || buildFallbackDetails(act);
  detailsModal.value = {
    open: true,
    dayIndex,
    actIndex,
    data: details,
    spendInput: act.spent ?? null,
  };
};

const closeDetailsModal = () => {
  detailsModal.value.open = false;
};

const buildFallbackDetails = (act) => {
  return {
    title: act.title,
    address: act.title + ", Seoul",
    hours: "09:00–21:00",
    area: "Seoul",
    cost: act.cost,
    desc: "A cozy spot popular with locals. Good for short stops during your itinerary.",
    gallery: defaultGallery,
    imageQuery: act.title + " Seoul",
  };
};

/* 공통 완료 로직 */
const completeActivity = (dayIndex, actIndex, spendInput, comment) => {
  const day = days.value[dayIndex];
  if (!day) return;
  const act = day.places[actIndex];
  if (!act) return;

  if (spendInput != null && spendInput >= 0) {
    act.spent = Number(spendInput);
  }
  if (comment) {
    act.note = comment;
  }
  act.completed = true;

  // 해당 Day 모두 끝났으면 Hero 화면 표시 (다음 Day 시작 대기)
  const stillLeft = day.places.some((a) => new Date(a.endAt) > new Date());
  console.log("stillLeft", stillLeft);
  if (!stillLeft && run.value.dayId === day.day.id) {
    // ✅ Day 완료 시 Hero 화면이 표시되도록 상태만 초기화
    const nextDay = days.value.find((d) => d.day.id > day.day.id);
    console.log("nextDay", nextDay)
    if (nextDay) {
      // 다음 Day 카드 열기 (Hero 화면 표시됨)
      openDayId.value = nextDay.day.id;
      // run 상태 초기화 (Hero 화면에서 다시 시작 버튼 클릭 대기)
      run.value.started = false;
      run.value.startedAt = null;
      run.value.dayId = null;
    } else {
      // 모든 Day 완료
      run.value.started = false;
      run.value.startedAt = null;
      run.value.dayId = null;
    }
  }
};

/* 현재 액티비티 완료 모달에서 Confirm */
const completeCurrentActivity = () => {
  const { dayIndex, actIndex, spendInput, comment } = completeModal.value;
  if (dayIndex == null || actIndex == null) return;
  completeActivity(dayIndex, actIndex, spendInput, comment);
  closeCompleteModal();
};

/* 상세 모달에서 Save/Complete */
const saveSpent = () => {
  const { dayIndex: d, actIndex: a, spendInput: val } = detailsModal.value;
  if (d == null || a == null) return;
  completeActivity(d, a, val, null);
  closeDetailsModal();
};

const openReplaceFromDetails = () => {
  const { dayIndex, actIndex } = detailsModal.value;
  if (dayIndex == null || actIndex == null) return;
  closeDetailsModal();
  openReplaceModal(dayIndex, actIndex);
};

/* 교체/삭제 모달 */
const openReplaceModal = (dayIndex, actIndex) => {
  const target = days.value[dayIndex].places[actIndex];
  replaceModal.value = {
    open: true,
    dayIndex,
    actIndex,
    target,
    alternatives: [
      {
        title: "Cafe Onion Anguk",
        time: target.time,
        type: "cafe",
        cost: 8,
      },
      {
        title: "Seoul Wave Coffee",
        time: target.time,
        type: "cafe",
        cost: 10,
      },
      {
        title: "Ikseon Hanok Cafe",
        time: target.time,
        type: "dessert",
        cost: 9,
      },
    ],
  };
};

const closeReplaceModal = () => {
  replaceModal.value.open = false;
};

const previewAlt = (alt) => {
  applyReplacement(alt);
};

const applyReplacement = (alt) => {
  const { dayIndex: d, actIndex: a } = replaceModal.value;
  if (d == null || a == null) return;
  days.value[d].places.splice(a, 1, {
    ...alt,
    completed: false,
    spent: null,
    note: null,
    details: buildFallbackDetails(alt),
  });
  replaceModal.value.open = false;
};

const deleteAnyway = () => {
  const { dayIndex: d, actIndex: a } = replaceModal.value;
  if (d == null || a == null) return;
  deleteActivity(d, a);
  closeReplaceModal();
};

const deleteActivity = (dayIndex, actIndex) => {
  const acts = days.value[dayIndex].places;
  acts.splice(actIndex, 1);
  const SHIFT = 30;
  for (let i = actIndex; i < acts.length; i++) {
    const cur = parseTime(acts[i].time);
    const newMin = Math.max(6 * 60, cur - SHIFT);
    acts[i].time = formatTime(newMin);
  }
  acts.sort((a, b) => parseTime(a.time) - parseTime(b.time));
};

/* ------------------------------------------------------
   HERO TIME THEME TABLE
   시간대별 (테마 + 아이콘 + CSS 클래스)
------------------------------------------------------ */
const HERO_THEMES = [
  { key: "morning", start: 5, end: 11, theme: "hero--morning" },
  { key: "day", start: 11, end: 16, theme: "hero--day" },
  { key: "sunset", start: 16, end: 20, theme: "hero--sunset" },
  { key: "night", start: 20, end: 24, theme: "hero--night" },
  { key: "late-night", start: 0, end: 5, theme: "hero--night" },
];

// const heroMeta = computed(() => {
//   const hour = new Date().getHours();
//   return (
//     HERO_THEMES.find((t) => hour >= t.start && hour < t.end) || HERO_THEMES[0]
//   );
// });
// 랜덤 테마 선택
const heroMeta = computed(() => {
  const randomIndex = Math.floor(Math.random() * 4); // 0-3 (4가지 테마)
  return HERO_THEMES[randomIndex];
});


watch(
  () => chatStore.livePlanFromChat,
  (payload) => {
    if (!payload) return;

    // ✅ plan 정보 갱신
    plan.value = {
      id: payload.planId,
      startDate: payload.startDate,
      endDate: payload.endDate,
      title: "AI Generated Plan",
    };

    days.value = payload.days.map((d) => ({
      day: {
        id: d.dayIndex,
        dayIndex: d.dayIndex,
        planDate: d.date,
        title: `Day ${d.dayIndex}`,
      },
      places: d.schedules.map((s) => ({
        title: s.title,
        startAt: s.startAt,
        endAt: s.endAt,
        expectedCost: s.expectedCost,
        completed: false,
        spent: null,
        type: s.type ?? "default",
        icon: null,
        placeName: s.placeName,
        address: s.address,
      })),
      dailyCost: d.schedules.reduce(
        (sum, s) => sum + (s.expectedCost ?? 0),
        0
      ),
    }));

    // ✅ Day 1 자동 오픈 같은 UX도 가능
    openDayId.value = days.value[0]?.day.id ?? 1;
  },
  { deep: true }
);


onMounted(async () => {
  authStore.initializeAuth();
  await renderPlan();
  console.log("run", run.value);
})
</script>

<style scoped>
/* 폰트 */
.title {
  font-family: "Siganpyo", sans-serif;
}

.sub {
  font-family: "Kyobo2024", sans-serif;
}

/* -------------------------------
   기본 Hero 공통 스타일
-------------------------------- */
.gradient-hero {
  border-radius: 1.3rem;
  transition: background 0.6s ease, box-shadow 0.5s ease, filter 0.4s ease;
}

.hero-clickable {
  cursor: pointer;
  transition: transform 0.35s ease, box-shadow 0.5s ease, filter 0.4s ease;
}

.hero-text h5,
.hero-text .sub,
.hero-stats {
  color: #fff !important;
  /* 기본적으로 글씨는 흰색 */
}

/* -------------------------------
   시간대별 테마
-------------------------------- */

/* -------------------------------
   MORNING — 차분한 오렌지
-------------------------------- */
.hero--morning {
  background: linear-gradient(135deg, #ffd7a3 0%, #ffc48c 45%, #ffb07a 100%);
  box-shadow: 0 4px 12px rgba(255, 180, 120, 0.22);
}

.hero--morning.hero-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(255, 200, 160, 0.35),
    0 0 40px rgba(255, 180, 140, 0.45);
  filter: brightness(1.06);
}

/* -------------------------------
   DAY — 파스텔 블루
-------------------------------- */
.hero--day {
  background: linear-gradient(135deg, #88b8ff 0%, #6ea2ff 45%, #568bff 100%);
  box-shadow: 0 4px 12px rgba(120, 150, 255, 0.22);
}

.hero--day.hero-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(140, 170, 255, 0.35),
    0 0 40px rgba(110, 150, 255, 0.45);
  filter: brightness(1.07);
}

/* -------------------------------
   SUNSET — 부드러운 주황
-------------------------------- */
.hero--sunset {
  background: linear-gradient(135deg, #ffb36b 0%, #ff944d 45%, #ff7a3c 100%);
  box-shadow: 0 4px 12px rgba(255, 140, 90, 0.22);
}

.hero--sunset.hero-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(255, 140, 90, 0.35),
    0 0 40px rgba(255, 110, 70, 0.45);
  filter: brightness(1.07);
}

/* -------------------------------
   NIGHT — 딥블루 + 텍스트 더 선명하게
-------------------------------- */
.hero--night {
  background: linear-gradient(135deg, #1f2937 0%, #27324a 45%, #1c2535 100%);
  box-shadow: 0 4px 12px rgba(40, 60, 90, 0.22);
}

/* Night에서 텍스트가 너무 안 보임 → Glow 효과 추가 */
.hero--night .hero-text h5,
.hero--night .hero-text .sub,
.hero--night .hero-stats {
  color: #ffffff !important;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.35);
}

/* Night Hover */
.hero--night.hero-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(120, 140, 255, 0.25),
    0 0 40px rgba(90, 110, 255, 0.35);
  filter: brightness(1.06);
}

.hero-sep {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
  margin: 14px 0 10px;
}

.hero-stats {
  font-weight: 600;
}

.hero-stats .dot {
  padding: 0 0.5rem;
  opacity: 0.8;
}

.run-panel {
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.75rem;
  cursor: pointer;
}

.badge-hero {
  background: #3ac569;
  color: #fff;
  font-weight: 700;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 진행도 바 */
.progress-hero {
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.35);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ff8c00 0%, #ffd27a 100%);
  transition: width 0.35s ease;
}

/* 리스트 & 전환 */
.planner-right {
  min-height: 0;
}

.planner-scroll {
  min-height: 0;
}
</style>
