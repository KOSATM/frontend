<!-- src/views/planner/PlannerList.vue -->
<template>
  <section
    class="planner-right card shadow-sm rounded-4 h-100 d-flex flex-column"
  >
    <!-- 상단 요약 -->
    <div class="p-4 pb-3 border-bottom">
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
    <div class="p-4 pt-3">
      <!-- 아직 시작 안함 -->
      <div
        v-if="!run.started"
        class="gradient-hero rounded-4 p-4 position-relative"
      >
        <button
          class="play-btn"
          aria-label="Start day"
          @click="startDay(openDayId)"
        >
          ▶
        </button>
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
              <div class="small opacity-75">In progress</div>
            </div>
            <span class="badge-hero">Active</span>
          </div>

          <!-- 클릭 시 상세 모달 열기 -->
          <div
            class="run-panel rounded-4 px-3 py-3 mb-3"
            role="button"
            @click.stop="openDetailsForCurrent"
          >
            <h6 class="mb-1 title">{{ currentActivity?.title || "—" }}</h6>
            <div class="sub small mb-1">
              ⏰ {{ currentActivity?.time || "—" }}
            </div>
            <div class="sub small d-flex align-items-center gap-2">
              🕒 <span>Started at {{ startedAtClock }}</span>
            </div>
          </div>

          <div
            class="d-flex justify-content-between align-items-center mb-1 sub"
          >
            <span>Day {{ openDayId }} Progress</span>
            <span>{{ Math.round(dayProgress) }}%</span>
          </div>
          <div
            class="progress-hero"
            role="progressbar"
            :aria-valuenow="Math.round(dayProgress)"
            aria-valuemin="0"
            aria-valuemax="100"
            @click.stop="openDetailsForCurrent"
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

              <!-- 펼친 상태 하단 진행도 -->
              <div class="px-3 py-3">
                <div
                  class="d-flex justify-content-between align-items-center mb-1 sub"
                >
                  <span>Day {{ day.id }} Progress</span>
                  <span>{{ Math.round(progressOf(day)) }}%</span>
                </div>
                <div
                  class="progress-hero"
                  :aria-valuenow="Math.round(progressOf(day))"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    class="progress-fill"
                    :style="{ width: progressOf(day) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="p-4 pt-0 border-top bg-white">
      <button class="btn btn-success w-100 rounded-3">
        Next: Select Hotel
      </button>
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
    :read-only="detailsModal.readOnly"
    @update:spend-input="detailsModal.spendInput = $event"
    @close="closeDetailsModal"
    @save-spent="saveSpent"
    @open-replace="openReplaceFromDetails"
    @apply-replacement-from-preview="applyReplacementFromPreview"
  />
</template>

<script>
import PlannerReplaceModal from "@/components/planner/PlannerReplaceModal.vue";
import PlannerActivityDetailsModal from "@/components/planner/PlannerActivityDetailsModal.vue";

export default {
  name: "PlannerList",
  components: {
    PlannerReplaceModal,
    PlannerActivityDetailsModal,
  },
  data() {
    return {
      openDayId: 1,
      run: { started: false, startedAt: null },
      budget: [
        { label: "Total Budget", value: "$2000", bg: "bg-warning-subtle" },
        { label: "Estimated Cost", value: "$1800", bg: "bg-info-subtle" },
        { label: "Remaining", value: "$200", bg: "bg-success-subtle" },
      ],
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
            },
            {
              title: "COEX & Starfield Library",
              time: "2:00 PM",
              type: "shopping",
              cost: 0,
              completed: false,
              spent: null,
            },
            {
              title: "Bongeunsa Temple",
              time: "4:00 PM",
              type: "walk",
              cost: 0,
              completed: false,
              spent: null,
            },
            {
              title: "Garosu-gil Stroll",
              time: "5:30 PM",
              type: "walk",
              cost: 0,
              completed: false,
              spent: null,
            },
            {
              title: "Dinner at Local Bistro",
              time: "7:00 PM",
              type: "food",
              cost: 22,
              completed: false,
              spent: null,
            },
            {
              title: "Cheonggyecheon Night View",
              time: "9:00 PM",
              type: "view",
              cost: 0,
              completed: false,
              spent: null,
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
            },
            {
              title: "Gyeongbokgung Palace",
              time: "10:00 AM",
              type: "palace",
              cost: 0,
              completed: false,
              spent: null,
            },
            {
              title: "Hanbok Rental",
              time: "12:00 PM",
              type: "shopping",
              cost: 15,
              completed: false,
              spent: null,
            },
            {
              title: "Bukchon Hanok Village",
              time: "2:00 PM",
              type: "walk",
              cost: 0,
              completed: false,
              spent: null,
            },
            {
              title: "Insadong Tea Time",
              time: "4:00 PM",
              type: "dessert",
              cost: 7,
              completed: false,
              spent: null,
            },
            {
              title: "Jongno Dinner",
              time: "6:30 PM",
              type: "food",
              cost: 18,
              completed: false,
              spent: null,
            },
          ],
        },
        // … 3~7일 추가 가능
      ],

      /* 교체/삭제 모달 상태 */
      replaceModal: {
        open: false,
        dayIndex: null,
        actIndex: null,
        target: null,
        alternatives: [],
      },

      /* 상세 모달 상태 (readOnly = 대체안 프리뷰) */
      detailsModal: {
        open: false,
        dayIndex: null,
        actIndex: null,
        data: null,
        spendInput: null,
        saved: false,
        readOnly: false,
        pendingAlt: null,
      },
    };
  },
  computed: {
    currentDay() {
      return this.days.find((d) => d.id === this.openDayId) || null;
    },
    currentDayIndex() {
      return this.days.findIndex((d) => d.id === this.openDayId);
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
  },
  methods: {
    /* 공통 유틸 */
    toggleDay(id) {
      this.openDayId = this.openDayId === id ? null : id;
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

    /* 완료 토글 (되돌리기 포함) */
    toggleComplete(dayIndex, actIndex) {
      const day = this.days[dayIndex];
      if (!day) return;
      const act = day.activities[actIndex];
      if (!act) return;

      if (act.completed) {
        // 완료 → 미완료 : 퍼센트/상태 되돌리기 + 비용도 초기화
        act.completed = false;
        act.spent = null;
      } else {
        // 미완료 → 완료
        act.completed = true;
      }
    },

    /* 시작/진행 */
    startDay(dayId) {
      if (!this.days.find((d) => d.id === dayId)) return;
      this.openDayId = dayId;
      this.run.started = true;
      this.run.startedAt = Date.now();
      const now = new Date(this.run.startedAt);
      const nowMin = now.getHours() * 60 + now.getMinutes();
      this.currentDay.activities.forEach((a) => {
        if (this.parseTime(a.time) < nowMin) a.completed = true;
      });
    },
    openDetailsForCurrent() {
      if (!this.currentDay) return;
      const dIdx = this.currentDayIndex;
      const aIdx = this.currentActivityIndex;
      if (dIdx < 0 || aIdx < 0) return;
      const act = this.days[dIdx].activities[aIdx];
      const details = this.buildDetailsFromActivity(act);
      this.detailsModal = {
        open: true,
        dayIndex: dIdx,
        actIndex: aIdx,
        data: details,
        spendInput: act.spent ?? null,
        saved: false,
        readOnly: false,
        pendingAlt: null,
      };
    },

    /* 상세 모달 */
    openDetailsModal(dayIndex, actIndex) {
      const act = this.days[dayIndex].activities[actIndex];
      const details = this.buildDetailsFromActivity(act);
      this.detailsModal = {
        open: true,
        dayIndex,
        actIndex,
        data: details,
        spendInput: act.spent ?? null,
        saved: false,
        readOnly: false,
        pendingAlt: null,
      };
    },
    closeDetailsModal() {
      this.detailsModal.open = false;
    },
    buildDetailsFromActivity(act) {
      const base = {
        title: act.title,
        address: "123 Sample-ro, Jongno-gu, Seoul",
        hours: "09:00–21:00",
        cost: act.cost,
        area: "Central Seoul",
        desc: "A cozy spot popular with locals. Good for short stops during your itinerary.",
        gallery: [
          "https://placehold.co/540x320?text=Photo+1",
          "https://placehold.co/540x320?text=Photo+2",
          "https://placehold.co/540x320?text=Photo+3",
        ],
      };
      if (act.type === "palace") {
        base.address = "161 Sajik-ro, Jongno-gu, Seoul";
        base.hours = "09:00–18:00 (Tue closed)";
        base.area = "Gyeongbokgung";
        base.desc =
          "Historic royal palace with grand architecture and spacious courtyards.";
      } else if (["cafe", "dessert", "brunch"].includes(act.type)) {
        base.desc = "Trendy cafe with good coffee and pastries.";
      } else if (["walk", "view"].includes(act.type)) {
        base.desc = "Scenic walking route and photo spots.";
        base.cost = 0;
      }
      return base;
    },
    saveSpent() {
      const { dayIndex: d, actIndex: a, spendInput: val } = this.detailsModal;
      if (d == null || a == null) return;
      if (val == null || val < 0) return;
      const act = this.days[d].activities[a];
      act.spent = Number(val);
      act.completed = true;
      this.detailsModal.saved = true;
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

    // 추천 카드 클릭 → 상세 모달(읽기 전용 프리뷰) 띄우기
    previewAlt(alt) {
      const d = this.replaceModal.dayIndex;
      const a = this.replaceModal.actIndex;
      if (d == null || a == null) return;
      const details = this.buildDetailsFromActivity(alt);
      this.replaceModal.open = false;
      this.detailsModal = {
        open: true,
        dayIndex: d,
        actIndex: a,
        data: details,
        spendInput: null,
        saved: false,
        readOnly: true,
        pendingAlt: alt,
      };
    },

    // 프리뷰 모달에서 “Use this activity” → 교체
    applyReplacementFromPreview() {
      const alt = this.detailsModal.pendingAlt;
      if (!alt) return;
      this.applyReplacement(alt);
      this.closeDetailsModal();
    },

    applyReplacement(alt) {
      const { dayIndex: d, actIndex: a } = this.replaceModal.open
        ? this.replaceModal
        : this.detailsModal;
      if (d == null || a == null) return;
      this.days[d].activities.splice(a, 1, {
        ...alt,
        completed: false,
        spent: null,
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
.play-btn {
  position: absolute;
  left: 20px;
  top: 20px;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: 0;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.play-btn:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translateY(-1px);
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
/* 시작 전: 거의 기본 */
.activity-row--upcoming {
  background-color: #ffffff;
}

/* 진행 중: 파란색 바 + 살짝 띄우기 */
.activity-row--current {
  background-color: #e0edff;
  box-shadow: inset 4px 0 0 #2563eb, 0 4px 10px rgba(37, 99, 235, 0.18);
  transform: translateY(-1px);
}
.activity-row--current .title {
  font-weight: 700;
}

/* 완료: 흑백 틴트 느낌 */
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

/* hover: 공통 */
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
