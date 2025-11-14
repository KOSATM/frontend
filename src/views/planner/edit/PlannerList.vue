<!-- src/views/planner/PlannerList.vue -->
<template>
  <section
    class="planner-right card shadow-sm rounded-4 h-100 d-flex flex-column"
  >
    <!-- 상단 요약 -->
    <div class="p-4 pb-3 border-bottom">
      <PageHeader
        title="Planner"
        subtitle="Create and manage your Seoul travel itinerary"
        icon="bi-map"
      />
      <StepHeader v-if="!travelStore.$state.isTraveling" :step="'2/4'" :title="'Check and Adjust Draft'" @back="goBack"/>
      <div class="d-flex gap-3 align-items-center mb-3">
        <div
          class="rounded-3 bg-secondary-subtle d-flex align-items-center justify-content-center"
          style="width: 46px; height: 46px"
        >
          📅
        </div>
        <div>
          <h5 class="mb-1 title">Your 7-Day Seoul Adventure</h5>
          <p class="text-muted small mb-0 sub">
            Nov 6 – Nov 12, 2025 • Seoul, Korea
          </p>
        </div>
      </div>

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
      <!-- 아직 시작 안함: 카드 전체 클릭으로 시작 -->
      <div
        v-if="!run.started"
        class="gradient-hero rounded-4 p-4 position-relative hero-clickable"
        @click="startDay(openDayId)"
      >
        <div class="text-center text-white">
          <h5 class="mb-1 title">Start Day {{ openDayId }}</h5>
          <div class="sub">{{ currentDay?.title }}</div>
          <div class="sub small">{{ currentDay?.date }}</div>
          <hr class="hero-sep" />
          <div class="hero-stats">
            {{ currentDay?.activities.length || 0 }} activities
            <span class="dot">•</span>
            ${{ currentDay?.dailyCost }}
          </div>
        </div>
      </div>

      <!-- 시작 후: 현재 진행 카드 -->
      <div
        v-else
        class="card border-0 shadow-sm rounded-4 mb-3 gradient-hero text-white"
      >
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
          <div
            class="run-panel rounded-4 px-3 py-3 mb-3"
            role="button"
            @click.stop="openCompleteForCurrent"
          >
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

          <div
            class="d-flex justify-content-between align-items-center mb-1 sub"
          >
            <span>Day {{ currentDay?.id }} Progress</span>
            <span>{{ Math.round(dayProgress) }}%</span>
          </div>
          <div
            class="progress-hero"
            role="progressbar"
            :aria-valuenow="Math.round(dayProgress)"
            aria-valuemin="0"
            aria-valuemax="100"
            @click.stop="openCompleteForCurrent"
          >
            <div
              class="progress-fill"
              :style="{ width: dayProgress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 본문 리스트 -->
    <div class="planner-scroll flex-grow-1 overflow-auto p-4 pt-3">
      <div class="d-flex flex-column gap-3">
        <div
          v-for="(day, dIdx) in days"
          :key="day.id"
          class="card border-0 shadow-sm rounded-4 overflow-hidden"
        >
          <div
            class="card-body d-flex justify-content-between align-items-center"
            :class="openDayId === day.id ? 'bg-primary text-white' : 'bg-white'"
            role="button"
            @click="toggleDay(day.id)"
          >
            <div>
              <div
                class="small fw-semibold"
                :class="openDayId !== day.id ? 'text-primary' : ''"
              >
                Day {{ day.id }}
              </div>
              <h6 class="mb-0 title">{{ day.title }}</h6>
              <div
                class="small"
                :class="openDayId !== day.id ? 'text-muted' : 'text-white-50'"
              >
                {{ day.date }}
              </div>
            </div>
            <div class="text-end">
              <div
                class="small"
                :class="openDayId === day.id ? 'text-white-50' : ''"
              >
                Daily Cost
              </div>
              <div class="fw-bold title">$ {{ day.dailyCost }}</div>
              <div class="small">
                <span
                  class="chevron"
                  :class="{ 'rotate-180': openDayId === day.id }"
                  >⌃</span
                >
              </div>
            </div>
          </div>

          <transition name="collapse">
            <div
              v-if="openDayId === day.id"
              class="list-group list-group-flush"
            >
              <div
                v-for="(act, aIdx) in day.activities"
                :key="aIdx"
                :class="[
                  'list-group-item d-flex justify-content-between align-items-center activity-row',
                  activityRowClass(dIdx, aIdx),
                ]"
                @click="openDetailsModal(dIdx, aIdx)"
              >
                <div class="d-flex align-items-start gap-3">
                  <div
                    class="icon-badge themed"
                    :class="'theme-' + (act.type || 'default')"
                  >
                    {{ act.icon || getIconForType(act.type) }}
                  </div>
                  <div class="d-flex flex-column">
                    <div class="fw-semibold small title">
                      <span v-if="act.completed" class="me-2">✅</span>
                      {{ act.title }}
                    </div>
                    <div
                      class="d-flex align-items-center gap-2 small text-muted sub"
                    >
                      <span class="soft-chip">
                        <span class="chip-emoji">⏰</span> {{ act.time }}
                      </span>
                      <span v-if="hasCost(act.cost)" class="soft-chip">
                        <span class="chip-emoji">💰</span>
                        {{ formatCost(act.cost) }}
                      </span>
                      <span v-if="act.spent != null" class="soft-chip">
                        <span class="chip-emoji">💵</span> Spent
                        {{ formatCost(act.spent) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 오른쪽 버튼 영역 -->
                <div class="d-flex align-items-center gap-2" @click.stop>
                  <!-- 완료된 일정일 때만 되돌리기 -->
                  <button
                    v-if="act.completed"
                    class="btn btn-sm btn-outline-secondary rounded-pill undo-btn"
                    title="Mark as not done"
                    @click="toggleComplete(dIdx, aIdx)"
                  >
                    ↺
                  </button>

                  <button
                    class="btn btn-sm btn-outline-danger rounded-pill delete-btn"
                    title="Delete or replace"
                    @click="openReplaceModal(dIdx, aIdx)"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <!-- ⛔ Day 하단 진행도는 제거 -->
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="p-4 pt-0 border-top bg-white">
      <BaseButton v-if="!travelStore.$state.isTraveling" @click="next()" variant="primary" class="w-100 py-2">Next: Select Accommodation</BaseButton>
      <BaseButton v-else @click="endTrip()" variant="success" class="w-100 py-2">FORCE to End Trip</BaseButton>
      <!-- <button v-else="travelStore.$state.isTraveling" class="btn btn-success w-100 rounded-3">Finish Journey</button> -->
      <!-- <button v-else class="btn btn-success w-100 rounded-3" @click="next()">Next: Select Accommodation</button> -->
    </div>
  </section>

  <!-- 모달 컴포넌트들 -->
  <PlannerReplaceModal
    :open="replaceModal.open"
    :target="replaceModal.target"
    :alternatives="replaceModal.alternatives"
    @close="closeReplaceModal"
    @preview-alt="previewAlt"
    @apply-replacement="applyReplacement"
    @delete-anyway="deleteAnyway"
  />

  <PlannerActivityDetailsModal
    :open="detailsModal.open"
    :data="detailsModal.data"
    :spend-input="detailsModal.spendInput"
    @update:spend-input="detailsModal.spendInput = $event"
    @close="closeDetailsModal"
    @save-spent="saveSpent"
    @open-replace="openReplaceFromDetails"
  />

  <PlannerActivityCompleteModal
    :open="completeModal.open"
    :title="completeModal.title"
    :spend-input="completeModal.spendInput"
    :comment="completeModal.comment"
    :quick-stats="currentQuickStats"
    @update:spend-input="completeModal.spendInput = $event"
    @update:comment="completeModal.comment = $event"
    @close="closeCompleteModal"
    @confirm="completeCurrentActivity"
  />
</template>

<script>
import PageHeader from "@/components/common/PageHeader.vue";
import StepHeader from "@/components/common/StepHeader.vue";
import PlannerReplaceModal from "@/components/planner/PlannerReplaceModal.vue";
import PlannerActivityDetailsModal from "@/components/planner/PlannerActivityDetailsModal.vue";
import PlannerActivityCompleteModal from "@/components/planner/PlannerActivityCompleteModal.vue";
import { useTravelStore } from '@/store/travelStore'
import { nextTick } from "vue";
import BaseButton from "@/components/common/BaseButton.vue";

// 간단한 더미 갤러리 (photo1/2/3)
const defaultGallery = [
  "https://placehold.co/540x320?text=Photo+1",
  "https://placehold.co/540x320?text=Photo+2",
  "https://placehold.co/540x320?text=Photo+3",
];

export default {
  name: "PlannerList",
  components: {
    BaseButton,
    PageHeader,
    StepHeader,
    PlannerReplaceModal,
    PlannerActivityDetailsModal,
    PlannerActivityCompleteModal,
  },
  data() {
    return {
      travelStore: useTravelStore(),
      openDayId: 1, // 화면에서 펼쳐진 Day
      run: {
        started: false,
        startedAt: null,
        dayId: null, // ✅ 실제 진행 중인 Day
      },
      budget: [
        { label: "Total Budget", value: "$2000", bg: "bg-warning-subtle" },
        { label: "Estimated Cost", value: "$1800", bg: "bg-info-subtle" },
        { label: "Remaining", value: "$200", bg: "bg-success-subtle" },
      ],
      // ✅ 7일 일정
      days: [
        {
          id: 1,
          title: "Arrival & Gangnam Exploration",
          date: "Nov 6, 2025",
          dailyCost: 80,
          activities: [
            {
              title: "Welcome Lunch (Gangnam)",
              time: "12:30 PM",
              type: "food",
              cost: 14,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Welcome Lunch (Gangnam)",
                cost: 14,
                address: "123 Teheran-ro, Gangnam-gu, Seoul",
                area: "Gangnam",
                hours: "11:00–15:00",
                desc: "Casual Korean restaurant in Gangnam with set menus perfect after arrival.",
                gallery: defaultGallery,
                imageQuery: "Gangnam Korean lunch restaurant",
              },
            },
            {
              title: "COEX & Starfield Library",
              time: "2:00 PM",
              type: "shopping",
              cost: 0,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "COEX & Starfield Library",
                cost: 0,
                address: "513 Yeongdong-daero, Gangnam-gu, Seoul",
                area: "COEX",
                hours: "10:00–22:00",
                desc: "Iconic mall and photogenic library with huge bookshelves.",
                gallery: defaultGallery,
                imageQuery: "COEX Starfield Library",
              },
            },
            {
              title: "Bongeunsa Temple",
              time: "4:00 PM",
              type: "walk",
              cost: 0,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Bongeunsa Temple",
                cost: 0,
                address: "531 Bongeunsa-ro, Gangnam-gu, Seoul",
                area: "Bongeunsa",
                hours: "05:00–21:00",
                desc: "Peaceful Buddhist temple across from COEX with lanterns and courtyards.",
                gallery: defaultGallery,
                imageQuery: "Bongeunsa Temple Seoul",
              },
            },
            {
              title: "Garosu-gil Stroll",
              time: "5:30 PM",
              type: "walk",
              cost: 0,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Garosu-gil Stroll",
                cost: 0,
                address: "Sinsa-dong, Gangnam-gu, Seoul",
                area: "Sinsa",
                hours: "Always open",
                desc: "Trendy street with cafes and boutiques, great for a golden-hour walk.",
                gallery: defaultGallery,
                imageQuery: "Garosu-gil Sinsa street",
              },
            },
            {
              title: "Dinner at Local Bistro",
              time: "7:00 PM",
              type: "food",
              cost: 22,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Dinner at Local Bistro",
                cost: 22,
                address: "45 Apgujeong-ro, Gangnam-gu, Seoul",
                area: "Apgujeong",
                hours: "17:00–23:00",
                desc: "Modern Korean bistro with shared plates and good drinks.",
                gallery: defaultGallery,
                imageQuery: "Apgujeong Korean bistro",
              },
            },
            {
              title: "Cheonggyecheon Night View",
              time: "9:00 PM",
              type: "view",
              cost: 0,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Cheonggyecheon Night View",
                cost: 0,
                address: "Cheonggyecheon-ro, Jongno-gu, Seoul",
                area: "City Hall",
                hours: "Always open",
                desc: "Night stroll along the stream with city lights and photo spots.",
                gallery: defaultGallery,
                imageQuery: "Cheonggyecheon night view",
              },
            },
          ],
        },
        {
          id: 2,
          title: "Palace & Hanbok Experience",
          date: "Nov 7, 2025",
          dailyCost: 62,
          activities: [
            {
              title: "Breakfast at Local Cafe",
              time: "8:30 AM",
              type: "cafe",
              cost: 8,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Breakfast at Local Cafe",
                cost: 8,
                address: "Jongno 3-ga, Jongno-gu, Seoul",
                area: "Jongno",
                hours: "08:00–18:00",
                desc: "Small neighborhood cafe with good drip coffee and pastries.",
                gallery: defaultGallery,
                imageQuery: "Jongno cafe breakfast",
              },
            },
            {
              title: "Gyeongbokgung Palace",
              time: "10:00 AM",
              type: "palace",
              cost: 0,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Gyeongbokgung Palace",
                cost: 0,
                address: "161 Sajik-ro, Jongno-gu, Seoul",
                area: "Gyeongbokgung",
                hours: "09:00–18:00 (Tue closed)",
                desc: "Main royal palace of the Joseon dynasty with grand courtyards.",
                gallery: defaultGallery,
                imageQuery: "Gyeongbokgung Palace",
              },
            },
            {
              title: "Hanbok Rental",
              time: "12:00 PM",
              type: "shopping",
              cost: 15,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Hanbok Rental",
                cost: 15,
                address: "Inside Hanbok street near Gyeongbokgung",
                area: "Hanbok Street",
                hours: "09:00–19:00",
                desc: "Rent traditional hanbok to take photos around the palace area.",
                gallery: defaultGallery,
                imageQuery: "Seoul hanbok rental",
              },
            },
            {
              title: "Bukchon Hanok Village",
              time: "2:00 PM",
              type: "walk",
              cost: 0,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Bukchon Hanok Village",
                cost: 0,
                address: "37 Gyedong-gil, Jongno-gu, Seoul",
                area: "Bukchon",
                hours: "Always open",
                desc: "Traditional Korean houses with small galleries and viewpoints.",
                gallery: defaultGallery,
                imageQuery: "Bukchon Hanok Village",
              },
            },
            {
              title: "Insadong Tea Time",
              time: "4:00 PM",
              type: "dessert",
              cost: 7,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Insadong Tea Time",
                cost: 7,
                address: "62-1 Insadong-gil, Jongno-gu, Seoul",
                area: "Insadong",
                hours: "11:00–22:00",
                desc: "Teahouse tucked inside an alley, serving Korean traditional tea.",
                gallery: defaultGallery,
                imageQuery: "Insadong traditional tea house",
              },
            },
            {
              title: "Jongno Dinner",
              time: "6:30 PM",
              type: "food",
              cost: 18,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Jongno Dinner",
                cost: 18,
                address: "Ikseon-dong, Jongno-gu, Seoul",
                area: "Ikseon-dong",
                hours: "17:00–23:30",
                desc: "Lively restaurant street with barbecue and pubs.",
                gallery: defaultGallery,
                imageQuery: "Ikseon-dong dinner street",
              },
            },
          ],
        },
        {
          id: 3,
          title: "Hongdae & Nightlife",
          date: "Nov 8, 2025",
          dailyCost: 70,
          activities: [
            {
              title: "Brunch in Hongdae",
              time: "11:00 AM",
              type: "brunch",
              cost: 15,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Brunch in Hongdae",
                cost: 15,
                address: "Hongik-ro, Mapo-gu, Seoul",
                area: "Hongdae",
                hours: "10:00–15:00",
                desc: "Trendy brunch spot popular with students.",
                gallery: defaultGallery,
                imageQuery: "Hongdae brunch cafe",
              },
            },
            {
              title: "Street Art Walk",
              time: "1:00 PM",
              type: "walk",
              cost: 0,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Street Art Walk",
                cost: 0,
                address: "Hongdae Mural Street",
                area: "Hongdae",
                hours: "Always open",
                desc: "Explore murals and small shops in backstreets.",
                gallery: defaultGallery,
                imageQuery: "Hongdae street art",
              },
            },
            {
              title: "Shopping & Cafe Hopping",
              time: "3:00 PM",
              type: "shopping",
              cost: 20,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Shopping & Cafe Hopping",
                cost: 20,
                address: "Hongdae Shopping Street",
                area: "Hongdae",
                hours: "11:00–22:00",
                desc: "Free time to shop and explore cafes.",
                gallery: defaultGallery,
                imageQuery: "Hongdae shopping street",
              },
            },
            {
              title: "Hongdae Nightlife",
              time: "8:00 PM",
              type: "view",
              cost: 35,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Hongdae Nightlife",
                cost: 35,
                address: "Hongdae Club Street",
                area: "Hongdae",
                hours: "20:00–Late",
                desc: "Bars, live music, and street performances.",
                gallery: defaultGallery,
                imageQuery: "Hongdae nightlife",
              },
            },
          ],
        },
        {
          id: 4,
          title: "Namsan & Myeongdong",
          date: "Nov 9, 2025",
          dailyCost: 65,
          activities: [
            {
              title: "Cable Car to Namsan Tower",
              time: "10:00 AM",
              type: "tower",
              cost: 14,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Cable Car to Namsan Tower",
                cost: 14,
                address: "105 Namsangongwon-gil, Yongsan-gu, Seoul",
                area: "Namsan",
                hours: "10:00–23:00",
                desc: "Ride up to Namsan Tower for views over Seoul.",
                gallery: defaultGallery,
                imageQuery: "Namsan cable car",
              },
            },
            {
              title: "Namsan Tower Observatory",
              time: "11:00 AM",
              type: "view",
              cost: 12,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Namsan Tower Observatory",
                cost: 12,
                address: "N Seoul Tower Observatory",
                area: "Namsan",
                hours: "10:00–23:00",
                desc: "Love locks and 360-degree views.",
                gallery: defaultGallery,
                imageQuery: "N Seoul Tower observatory",
              },
            },
            {
              title: "Myeongdong Street Food",
              time: "5:00 PM",
              type: "food",
              cost: 18,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Myeongdong Street Food",
                cost: 18,
                address: "Myeong-dong, Jung-gu, Seoul",
                area: "Myeongdong",
                hours: "16:00–22:00",
                desc: "Try tteokbokki, hotteok, and more.",
                gallery: defaultGallery,
                imageQuery: "Myeongdong street food",
              },
            },
          ],
        },
        {
          id: 5,
          title: "Han River Chill Day",
          date: "Nov 10, 2025",
          dailyCost: 40,
          activities: [
            {
              title: "Lazy Morning",
              time: "10:00 AM",
              type: "view",
              cost: 0,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Lazy Morning",
                cost: 0,
                address: "Your hotel",
                area: "Seoul",
                hours: "Anytime",
                desc: "Free time to rest or explore nearby.",
                gallery: defaultGallery,
                imageQuery: "Seoul hotel room morning",
              },
            },
            {
              title: "Han River Picnic",
              time: "2:00 PM",
              type: "walk",
              cost: 10,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Han River Picnic",
                cost: 10,
                address: "Yeouido Hangang Park",
                area: "Yeouido",
                hours: "Always open",
                desc: "Rent mats, order chicken, and relax by the river.",
                gallery: defaultGallery,
                imageQuery: "Yeouido Hangang Park picnic",
              },
            },
            {
              title: "Han River Night Cruise",
              time: "8:00 PM",
              type: "view",
              cost: 30,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Han River Night Cruise",
                cost: 30,
                address: "Yeouido Ferry Terminal",
                area: "Yeouido",
                hours: "19:00–22:00",
                desc: "Night cruise with city lights.",
                gallery: defaultGallery,
                imageQuery: "Han River night cruise",
              },
            },
          ],
        },
        {
          id: 6,
          title: "Gangwon Day Trip",
          date: "Nov 11, 2025",
          dailyCost: 120,
          activities: [
            {
              title: "Train to Gangneung",
              time: "8:00 AM",
              type: "view",
              cost: 40,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Train to Gangneung",
                cost: 40,
                address: "Seoul Station → Gangneung Station",
                area: "Gangwon",
                hours: "08:00–11:00",
                desc: "Scenic KTX ride to the east coast.",
                gallery: defaultGallery,
                imageQuery: "KTX train to Gangneung",
              },
            },
            {
              title: "Beach Walk",
              time: "12:00 PM",
              type: "walk",
              cost: 0,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Beach Walk",
                cost: 0,
                address: "Gyeongpo Beach",
                area: "Gangneung",
                hours: "Always open",
                desc: "Walk along the beach and take photos.",
                gallery: defaultGallery,
                imageQuery: "Gyeongpo Beach Gangneung",
              },
            },
            {
              title: "Seafood Lunch",
              time: "1:30 PM",
              type: "food",
              cost: 25,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Seafood Lunch",
                cost: 25,
                address: "Anmok Port seafood street",
                area: "Gangneung",
                hours: "11:00–20:00",
                desc: "Fresh grilled fish and sashimi.",
                gallery: defaultGallery,
                imageQuery: "Gangneung seafood restaurant",
              },
            },
          ],
        },
        {
          id: 7,
          title: "Last-minute Shopping & Departure",
          date: "Nov 12, 2025",
          dailyCost: 90,
          activities: [
            {
              title: "Packing & Checkout",
              time: "10:00 AM",
              type: "view",
              cost: 0,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Packing & Checkout",
                cost: 0,
                address: "Your hotel",
                area: "Seoul",
                hours: "Morning",
                desc: "Pack your luggage and check out.",
                gallery: defaultGallery,
                imageQuery: "Hotel packing luggage",
              },
            },
            {
              title: "Last-minute Shopping",
              time: "1:00 PM",
              type: "shopping",
              cost: 40,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Last-minute Shopping",
                cost: 40,
                address: "Lotte Department Store Myeongdong",
                area: "Myeongdong",
                hours: "10:30–20:00",
                desc: "Pick up souvenirs and snacks.",
                gallery: defaultGallery,
                imageQuery: "Lotte Department Store Myeongdong",
              },
            },
            {
              title: "Airport Transfer",
              time: "4:00 PM",
              type: "view",
              cost: 50,
              completed: false,
              spent: null,
              note: null,
              details: {
                title: "Airport Transfer",
                cost: 50,
                address: "Seoul → Incheon Airport",
                area: "Incheon Airport",
                hours: "Depends on flight",
                desc: "Move to the airport with enough buffer time.",
                gallery: defaultGallery,
                imageQuery: "Seoul to Incheon Airport limousine bus",
              },
            },
          ],
        },
      ],

      /* 교체/삭제 모달 상태 */
      replaceModal: {
        open: false,
        dayIndex: null,
        actIndex: null,
        target: null,
        alternatives: [],
      },

      /* 상세 모달 상태 */
      detailsModal: {
        open: false,
        dayIndex: null,
        actIndex: null,
        data: null,
        spendInput: null,
      },

      /* 현재 액티비티 완료 모달 상태 */
      completeModal: {
        open: false,
        dayIndex: null,
        actIndex: null,
        title: "",
        spendInput: null,
        comment: "",
      },
    };
  },
  computed: {
    // ✅ 진행 중이면 run.dayId, 아니면 openDayId 기준
    currentDay() {
      if (this.run.started && this.run.dayId != null) {
        return this.days.find((d) => d.id === this.run.dayId) || null;
      }
      return this.days.find((d) => d.id === this.openDayId) || null;
    },
    currentDayIndex() {
      const targetId =
        this.run.started && this.run.dayId != null
          ? this.run.dayId
          : this.openDayId;
      return this.days.findIndex((d) => d.id === targetId);
    },
    currentActivityIndex() {
      if (!this.currentDay) return 0;
      const idx = this.currentDay.activities.findIndex((a) => !a.completed);
      return idx === -1 ? this.currentDay.activities.length - 1 : idx;
    },
    currentActivity() {
      return this.currentDay?.activities?.[this.currentActivityIndex] || null;
    },
    dayProgress() {
      return this.progressOf(this.currentDay);
    },
    startedAtClock() {
      if (!this.run.startedAt) return "—";
      const d = new Date(this.run.startedAt);
      const mm = d.getMinutes().toString().padStart(2, "0");
      const hh24 = d.getHours();
      const ap = hh24 >= 12 ? "PM" : "AM";
      const hh = hh24 % 12 || 12;
      return `${hh}:${mm} ${ap}`;
    },
    currentDurationText() {
      if (!this.run.startedAt) return "—";
      const diffMs = Date.now() - this.run.startedAt;
      const mins = Math.max(1, Math.round(diffMs / 60000));
      return `~${mins}m`;
    },
    currentStatusText() {
      if (!this.currentActivity) return "—";
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const sched = this.parseTime(this.currentActivity.time);
      const diff = nowMin - sched;
      if (Math.abs(diff) <= 20) return "On schedule ✓";
      if (diff < -20) return "A bit early";
      return "Running late";
    },
    currentQuickStats() {
      return {
        started: this.startedAtClock,
        duration: this.currentDurationText,
        status: this.currentStatusText,
      };
    },
  },
  methods: {
    goBack() {
      this.travelStore.decreaseStep();
      this.$router.push("/planner/travelplan");
    },
    next() {
      this.travelStore.increaseStep();
      this.$router.push("/planner/hotel")
    },
    endTrip() {
      this.travelStore.endTravel();
      this.travelStore.resetStep();
      this.$router.push("/planner");
    },
    /* 공통 유틸 */
    // ✅ 항상 한 개만 열리도록
    toggleDay(id) {
      this.openDayId = id;
    },
    getIconForType(type) {
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
    },
    hasCost(cost) {
      return cost === 0 || (typeof cost === "number" && !Number.isNaN(cost));
    },
    formatCost(cost) {
      if (cost === 0) return "Free";
      if (typeof cost === "number") return `$${cost}`;
      return "";
    },
    parseTime(t) {
      const [hm, ap] = (t || "").split(" ");
      let [h, m] = (hm || "0:00").split(":").map(Number);
      if ((ap || "").toUpperCase() === "PM" && h !== 12) h += 12;
      if ((ap || "").toUpperCase() === "AM" && h === 12) h = 0;
      return h * 60 + m;
    },
    formatTime(mins) {
      let h = Math.floor(mins / 60);
      const m = mins % 60;
      const ap = h >= 12 ? "PM" : "AM";
      if (h === 0) h = 12;
      else if (h > 12) h -= 12;
      return `${h}:${m.toString().padStart(2, "0")} ${ap}`;
    },
    progressOf(day) {
      if (!day?.activities?.length) return 0;
      const total = day.activities.length;
      const done = day.activities.filter((a) => a.completed).length;
      return Math.min(100, Math.max(0, (done / total) * 100));
    },

    /* 상태 계산: 시작 전 / 진행 중 / 완료 후 */
    activityStatus(dayIndex, actIndex) {
      const day = this.days[dayIndex];
      const act = day.activities[actIndex];

      if (act.completed) return "done";

      if (
        this.run.started &&
        dayIndex === this.currentDayIndex &&
        actIndex === this.currentActivityIndex
      ) {
        return "current";
      }

      return "upcoming";
    },
    activityRowClass(dayIndex, actIndex) {
      const status = this.activityStatus(dayIndex, actIndex);
      if (status === "current") return "activity-row--current";
      if (status === "done") return "activity-row--done";
      return "activity-row--upcoming";
    },

    /* 완료 토글 (되돌리기만) */
    toggleComplete(dayIndex, actIndex) {
      const day = this.days[dayIndex];
      if (!day) return;
      const act = day.activities[actIndex];
      if (!act) return;

      if (act.completed) {
        act.completed = false;
        act.spent = null;
        act.note = null;
      }
    },

    /* 시작/진행 */
    startDay(dayId) {
      if (this.run.started) return;
      const day = this.days.find((d) => d.id === dayId);
      if (!day) return;
      this.openDayId = dayId;
      this.run.started = true;
      this.run.startedAt = Date.now();
      this.run.dayId = dayId; // ✅ 진행 중인 Day 저장
      // 모든 액티비티는 미완료 상태 그대로 → 첫 번째 일정부터 진행
    },

    /* 현재 액티비티 완료 모달 열기 */
    openCompleteForCurrent() {
      if (!this.currentDay || !this.currentActivity) return;
      const dIdx = this.currentDayIndex;
      const aIdx = this.currentActivityIndex;
      this.completeModal = {
        open: true,
        dayIndex: dIdx,
        actIndex: aIdx,
        title: this.currentActivity.title,
        spendInput: this.currentActivity.spent ?? null,
        comment: this.currentActivity.note || "",
      };
    },
    closeCompleteModal() {
      this.completeModal.open = false;
    },

    /* 상세 모달 */
    openDetailsModal(dayIndex, actIndex) {
      const act = this.days[dayIndex].activities[actIndex];
      const details = act.details || this.buildFallbackDetails(act);
      this.detailsModal = {
        open: true,
        dayIndex,
        actIndex,
        data: details,
        spendInput: act.spent ?? null,
      };
    },
    closeDetailsModal() {
      this.detailsModal.open = false;
    },
    buildFallbackDetails(act) {
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
    },

    /* 공통 완료 로직 */
    completeActivity(dayIndex, actIndex, spendInput, comment) {
      const day = this.days[dayIndex];
      if (!day) return;
      const act = day.activities[actIndex];
      if (!act) return;

      if (spendInput != null && spendInput >= 0) {
        act.spent = Number(spendInput);
      }
      if (comment) {
        act.note = comment;
      }
      act.completed = true;

      // 해당 Day 모두 끝났으면(그리고 그 Day가 실제로 run 중인 Day일 때만)
      const stillLeft = day.activities.some((a) => !a.completed);
      if (!stillLeft && this.run.dayId === day.id) {
        this.run.started = false;
        this.run.startedAt = null;
        this.run.dayId = null;

        // 다음 Day 카드 오픈
        const nextDay = this.days.find((d) => d.id > day.id);
        if (nextDay) {
          this.openDayId = nextDay.id;
        }
      }
    },

    /* 현재 액티비티 완료 모달에서 Confirm */
    completeCurrentActivity() {
      const { dayIndex, actIndex, spendInput, comment } = this.completeModal;
      if (dayIndex == null || actIndex == null) return;
      this.completeActivity(dayIndex, actIndex, spendInput, comment);
      this.closeCompleteModal();
    },

    /* 상세 모달에서 Save/Complete */
    saveSpent() {
      const { dayIndex: d, actIndex: a, spendInput: val } = this.detailsModal;
      if (d == null || a == null) return;
      this.completeActivity(d, a, val, null);
      this.closeDetailsModal();
    },
    openReplaceFromDetails() {
      const { dayIndex, actIndex } = this.detailsModal;
      if (dayIndex == null || actIndex == null) return;
      this.closeDetailsModal();
      this.openReplaceModal(dayIndex, actIndex);
    },

    /* 교체/삭제 모달 */
    openReplaceModal(dayIndex, actIndex) {
      const target = this.days[dayIndex].activities[actIndex];
      this.replaceModal = {
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
    },
    closeReplaceModal() {
      this.replaceModal.open = false;
    },

    previewAlt(alt) {
      this.applyReplacement(alt);
    },

    applyReplacement(alt) {
      const { dayIndex: d, actIndex: a } = this.replaceModal;
      if (d == null || a == null) return;
      this.days[d].activities.splice(a, 1, {
        ...alt,
        completed: false,
        spent: null,
        note: null,
        details: this.buildFallbackDetails(alt),
      });
      this.replaceModal.open = false;
    },
    deleteAnyway() {
      const { dayIndex: d, actIndex: a } = this.replaceModal;
      if (d == null || a == null) return;
      this.deleteActivity(d, a);
      this.closeReplaceModal();
    },
    deleteActivity(dayIndex, actIndex) {
      const acts = this.days[dayIndex].activities;
      acts.splice(actIndex, 1);
      const SHIFT = 30;
      for (let i = actIndex; i < acts.length; i++) {
        const cur = this.parseTime(acts[i].time);
        const newMin = Math.max(6 * 60, cur - SHIFT);
        acts[i].time = this.formatTime(newMin);
      }
      acts.sort((a, b) => this.parseTime(a.time) - this.parseTime(b.time));
    },
  },
};
</script>


<style scoped>
/* 폰트 */
.title {
  font-family: "Siganpyo", sans-serif;
}
.sub {
  font-family: "Kyobo2024", sans-serif;
}

/* 히어로/진행 카드 */
.gradient-hero {
  color: #fff;
  background: linear-gradient(135deg, #2c4672, #2e4b77 55%, #ffb25a);
  background-color: #2c4672;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  border-radius: 1rem;
}
.hero-clickable {
  cursor: pointer;
}
.hero-clickable:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
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
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.2s ease;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
.chevron {
  transition: transform 0.2s;
  display: inline-block;
}
.rotate-180 {
  transform: rotate(180deg);
}

/* 액티비티 행 hover & 버튼 */
.activity-row {
  transition: background-color 0.18s ease, box-shadow 0.18s ease,
    transform 0.12s ease;
}
.activity-row .delete-btn {
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.activity-row:hover .delete-btn {
  opacity: 1;
  transform: translateY(-1px);
}
.undo-btn {
  font-size: 12px;
  padding: 4px 10px;
  border-style: dashed;
}

/* 상태별 카드 색상 */
.activity-row--upcoming {
  background-color: #ffffff;
}
.activity-row--current {
  background-color: #e0edff;
  box-shadow: inset 4px 0 0 #2563eb, 0 4px 10px rgba(37, 99, 235, 0.18);
  transform: translateY(-1px);
}
.activity-row--current .title {
  font-weight: 700;
}
.activity-row--done {
  background-color: #f9fafb;
  box-shadow: inset 4px 0 0 #d1d5db;
}
.activity-row--done .title {
  color: #9ca3af;
  font-weight: 400;
  opacity: 0.9;
}
.activity-row--done .sub,
.activity-row--done .soft-chip {
  color: #9ca3af;
}
.activity-row--done .soft-chip {
  background: #f3f4f6;
  border-color: #e5e7eb;
}
.activity-row--done .icon-badge.themed {
  background: #e5e7eb;
  color: #6b7280;
  filter: grayscale(100%);
  opacity: 0.9;
}
.activity-row:hover {
  background-color: #fff7eb;
}

/* 아이콘 배지 */
.icon-badge.themed {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  user-select: none;
}
.theme-cafe {
  background: #fff2e6;
}
.theme-food {
  background: #ffeaea;
}
.theme-brunch {
  background: #fff7e0;
}
.theme-dessert {
  background: #ffeef7;
}
.theme-palace,
.theme-museum {
  background: #eaf3ff;
}
.theme-tower {
  background: #eef4ff;
}
.theme-walk {
  background: #eafaf1;
}
.theme-shopping {
  background: #f1f0ff;
}
.theme-market {
  background: #fff4e6;
}
.theme-view {
  background: #eaf6ff;
}
.theme-default {
  background: #f5f6f8;
}

/* 칩 */
.soft-chip {
  padding: 2px 8px;
  border-radius: 10px;
  background: #f8f9fa;
  border: 1px solid #f1f3f5;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.chip-emoji {
  font-size: 12px;
  line-height: 1;
}
</style>
