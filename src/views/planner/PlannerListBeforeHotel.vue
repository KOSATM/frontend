<!-- src/views/planner/PlannerList.vue -->
<template>
  <section class="planner-right card shadow-sm rounded-4 h-100 d-flex flex-column">
    <!-- 상단 요약 -->
    <div class="p-4 pb-3 border-bottom">
      <div class="d-flex gap-3 align-items-center mb-3">
        <div class="rounded-3 bg-secondary-subtle d-flex align-items-center justify-content-center" style="width: 46px; height: 46px">📅</div>
        <div>
          <h5 class="mb-1" style="font-family: 'Siganpyo', sans-serif">Your 7-Day Seoul Adventure</h5>
          <p class="text-muted small mb-0" style="font-family: 'Kyobo2024', sans-serif">Nov 6 – Nov 12, 2025 • Seoul, Korea</p>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-md-4" v-for="card in budget" :key="card.label">
          <div class="card border-0 shadow-sm rounded-3" :class="card.bg">
            <div class="card-body py-3">
              <p class="small text-muted mb-1" style="font-family: 'Kyobo2024', sans-serif">{{ card.label }}</p>
              <h5 class="mb-0" style="font-family: 'Siganpyo', sans-serif">{{ card.value }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 본문: 1~7일 동일 카드 리스트 (호텔 없음) -->
    <div class="planner-scroll flex-grow-1 overflow-auto p-4 pt-3">
      <div class="d-flex flex-column gap-3">
        <div v-for="(day, dIdx) in days" :key="day.id" class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div
            class="card-body d-flex justify-content-between align-items-center"
            :class="openDayId === day.id ? 'bg-primary text-white' : 'bg-white'"
            role="button"
            @click="toggleDay(day.id)"
          >
            <div>
              <div class="small fw-semibold" :class="openDayId !== day.id ? 'text-primary' : ''" style="font-family: 'Siganpyo', sans-serif">
                Day {{ day.id }}
              </div>
              <h6 class="mb-0" style="font-family: 'Siganpyo', sans-serif">{{ day.title }}</h6>
              <div class="small" :class="openDayId !== day.id ? 'text-muted' : 'text-white-50'" style="font-family: 'Kyobo2024', sans-serif">
                {{ day.date }}
              </div>
            </div>

            <div class="text-end">
              <div class="small" :class="openDayId === day.id ? 'text-white-50' : ''" style="font-family: 'Kyobo2024', sans-serif">Daily Cost</div>
              <div class="fw-bold" style="font-family: 'Siganpyo', sans-serif">$ {{ day.dailyCost }}</div>
              <div class="small"><span class="chevron" :class="{ 'rotate-180': openDayId === day.id }">⌃</span></div>
            </div>
          </div>

          <transition name="collapse">
            <div v-if="openDayId === day.id" class="list-group list-group-flush">
              <!-- 액티비티 한 줄 -->
              <div v-for="(act, aIdx) in day.activities" :key="aIdx" class="list-group-item d-flex justify-content-between align-items-center activity-row">
                <div class="d-flex align-items-start gap-3">
                  <!-- 테마 아이콘 -->
                  <div class="icon-badge themed" :class="'theme-' + (act.type || 'default')">
                    {{ act.icon || getIconForType(act.type) }}
                  </div>

                  <div class="d-flex flex-column">
                    <div class="fw-semibold small" style="font-family: 'Siganpyo', sans-serif">{{ act.title }}</div>

                    <div class="d-flex align-items-center gap-2 small text-muted" style="font-family: 'Kyobo2024', sans-serif">
                      <!-- 귀여운 시계칩 -->
                      <span class="soft-chip"><span class="chip-emoji">⏰</span> {{ act.time }}</span>
                      <!-- 비용칩: 0→Free, null/undefined→감춤, 숫자→$n -->
                      <span v-if="hasCost(act.cost)" class="soft-chip"> <span class="chip-emoji">💰</span> {{ formatCost(act.cost) }} </span>
                    </div>
                  </div>
                </div>

                <div class="d-flex align-items-center gap-2">
                  <!-- 삭제 버튼: hover 시만 보임 -->
                  <button class="btn btn-sm btn-outline-danger rounded-pill delete-btn" title="Delete this activity" @click.stop="openReplaceModal(dIdx, aIdx)">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="p-4 pt-0 border-top bg-white">
      <button class="btn btn-success w-100 rounded-3">Next: Select Hotel</button>
    </div>
  </section>

  <!-- 대안 추천 모달 (하드코딩) -->
  <div v-if="replaceModal.open" class="modal-backdrop" @click="closeReplaceModal">
    <div class="modal-card" @click.stop>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="mb-0">Replace</h6>
        <button class="btn btn-sm btn-light rounded-circle" @click="closeReplaceModal">✕</button>
      </div>

      <p class="small text-muted mb-3">
        Choose a replacement for <strong>{{ replaceModal.target?.title }}</strong>
      </p>

      <div class="list-group">
        <div v-for="(alt, i) in replaceModal.alternatives" :key="'alt-' + i" class="list-group-item border-0 shadow-sm rounded-3 mb-2">
          <div class="d-flex align-items-center gap-3">
            <div class="icon-badge themed" :class="'theme-' + (alt.type || 'default')">
              {{ alt.icon || getIconForType(alt.type) }}
            </div>
            <div class="flex-grow-1">
              <div class="fw-semibold small">{{ alt.title }}</div>
              <div class="d-flex align-items-center gap-2 small text-muted">
                <span class="soft-chip"><span class="chip-emoji">⏰</span> {{ alt.time }}</span>
                <span v-if="hasCost(alt.cost)" class="soft-chip"><span class="chip-emoji">💰</span> {{ formatCost(alt.cost) }}</span>
              </div>
            </div>
            <button class="btn btn-sm btn-outline-primary rounded-pill" @click="applyReplacement(alt)">Replace</button>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between mt-3">
        <button class="btn btn-light" @click="closeReplaceModal">Cancel</button>
        <button class="btn btn-danger" @click="deleteAnyway">Delete anyway</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlannerList",
  data() {
    return {
      openDayId: 1,
      // 상단 카드
      budget: [
        { label: "Total Budget", value: "$2000", bg: "bg-warning-subtle" },
        { label: "Estimated Cost", value: "$1800", bg: "bg-info-subtle" },
        { label: "Remaining", value: "$200", bg: "bg-success-subtle" },
      ],
      // 1~7일 하드코딩 (호텔 없음 / 일정 6개 이상)
      days: [
        {
          id: 1,
          title: "Arrival & Gangnam Exploration",
          date: "Nov 6, 2025",
          dailyCost: 80,
          activities: [
            { title: "Welcome Lunch (Gangnam)", time: "12:30 PM", type: "food", cost: 14 },
            { title: "COEX & Starfield Library", time: "2:00 PM", type: "shopping", cost: 0 },
            { title: "Bongeunsa Temple", time: "4:00 PM", type: "walk", cost: 0 },
            { title: "Garosu-gil Stroll", time: "5:30 PM", type: "walk", cost: 0 },
            { title: "Dinner at Local Bistro", time: "7:00 PM", type: "food", cost: 22 },
            { title: "Cheonggyecheon Night View", time: "9:00 PM", type: "view", cost: 0 },
          ],
        },
        {
          id: 2,
          title: "Palace & Hanbok Experience",
          date: "Nov 7, 2025",
          dailyCost: 62,
          activities: [
            { title: "Breakfast at Local Cafe", time: "8:30 AM", type: "cafe", cost: 8 },
            { title: "Gyeongbokgung Palace", time: "10:00 AM", type: "palace", cost: 0 },
            { title: "Hanbok Rental", time: "12:00 PM", type: "shopping", cost: 15 },
            { title: "Bukchon Hanok Village", time: "2:00 PM", type: "walk", cost: 0 },
            { title: "Insadong Tea Time", time: "4:00 PM", type: "dessert", cost: 7 },
            { title: "Jongno Dinner", time: "6:30 PM", type: "food", cost: 18 },
          ],
        },
        {
          id: 3,
          title: "N Seoul Tower & Hongdae",
          date: "Nov 8, 2025",
          dailyCost: 137,
          activities: [
            { title: "Brunch in Myeongdong", time: "10:00 AM", type: "brunch", cost: 12 },
            { title: "Myeongdong Shopping", time: "11:30 AM", type: "shopping", cost: 0 },
            { title: "Street Snacks", time: "1:00 PM", type: "food", cost: 6 },
            { title: "N Seoul Tower (Sunset)", time: "5:30 PM", type: "tower", cost: 12 },
            { title: "Hongdae Busking", time: "7:30 PM", type: "view", cost: 0 },
            { title: "Dessert Cafe in Hongdae", time: "9:00 PM", type: "dessert", cost: 8 },
          ],
        },
        {
          id: 4,
          title: "DMZ Tour & War Memorial",
          date: "Nov 9, 2025",
          dailyCost: 240,
          activities: [
            { title: "Early Breakfast", time: "7:00 AM", type: "cafe", cost: 7 },
            { title: "DMZ Tour Pickup", time: "7:30 AM", type: "view", cost: 0 },
            { title: "Imjingak & Dora Observatory", time: "9:30 AM", type: "view", cost: 0 },
            { title: "Return to Seoul", time: "2:30 PM", type: "view", cost: 0 },
            { title: "War Memorial of Korea", time: "4:00 PM", type: "museum", cost: 0 },
            { title: "Yongsan Dinner", time: "6:30 PM", type: "food", cost: 18 },
          ],
        },
        {
          id: 5,
          title: "Shopping & Cafe Hopping",
          date: "Nov 10, 2025",
          dailyCost: 95,
          activities: [
            { title: "Cafe Onion Anguk", time: "9:00 AM", type: "cafe", cost: 8 },
            { title: "Ikseon Antique Street", time: "10:30 AM", type: "walk", cost: 0 },
            { title: "Gwangjang Market", time: "12:00 PM", type: "market", cost: 10 },
            { title: "Seongsu Cafe Street", time: "2:30 PM", type: "dessert", cost: 9 },
            { title: "Seongsu select shop", time: "4:00 PM", type: "shopping", cost: 0 },
            { title: "Riverside Night Walk", time: "8:00 PM", type: "walk", cost: 0 },
          ],
        },
        {
          id: 6,
          title: "Day Trip to Suwon",
          date: "Nov 11, 2025",
          dailyCost: 120,
          activities: [
            { title: "Train to Suwon", time: "9:00 AM", type: "view", cost: 6 },
            { title: "Suwon Fortress Tour", time: "10:30 AM", type: "palace", cost: 0 },
            { title: "Local Lunch", time: "12:30 PM", type: "food", cost: 15 },
            { title: "Craft Street", time: "2:30 PM", type: "walk", cost: 0 },
            { title: "Return to Seoul", time: "5:00 PM", type: "view", cost: 0 },
            { title: "Late Dessert in Seoul", time: "8:00 PM", type: "dessert", cost: 7 },
          ],
        },
        {
          id: 7,
          title: "Relax & Departure",
          date: "Nov 12, 2025",
          dailyCost: 60,
          activities: [
            { title: "Easy Brunch", time: "10:00 AM", type: "brunch", cost: 12 },
            { title: "Last-minute Souvenirs", time: "12:00 PM", type: "shopping", cost: 0 },
            { title: "River Park Rest", time: "2:00 PM", type: "walk", cost: 0 },
            { title: "Airport Transfer", time: "4:30 PM", type: "view", cost: 0 },
            { title: "Gate Snack", time: "6:30 PM", type: "food", cost: 9 },
            { title: "Depart", time: "8:30 PM", type: "view", cost: 0 },
          ],
        },
      ],

      /* 모달 상태 */
      replaceModal: {
        open: false,
        dayIndex: null,
        actIndex: null,
        target: null,
        alternatives: [],
      },
    };
  },
  methods: {
    toggleDay(id) {
      this.openDayId = this.openDayId === id ? null : id;
    },

    /* ---------- 아이콘/비용 헬퍼 ---------- */
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

    /* ---------- 시간 유틸 (간단) ---------- */
    parseTime(t) {
      // 'H:MM AM/PM' → minutes since 00:00
      const [hm, ap] = t.split(" ");
      let [h, m] = hm.split(":").map(Number);
      if (ap.toUpperCase() === "PM" && h !== 12) h += 12;
      if (ap.toUpperCase() === "AM" && h === 12) h = 0;
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

    /* 삭제 → 모달 열기 */
    openReplaceModal(dayIndex, actIndex) {
      const target = this.days[dayIndex].activities[actIndex];
      this.replaceModal.dayIndex = dayIndex;
      this.replaceModal.actIndex = actIndex;
      this.replaceModal.target = target;
      // 간단 하드코딩 대안(타입/시간/비용만 맞춤)
      const baseTime = target.time;
      const sameType = target.type || "default";
      this.replaceModal.alternatives = [
        { title: "Cafe Onion Anguk", time: baseTime, type: "cafe", cost: 8 },
        { title: "Seoul Wave Coffee", time: baseTime, type: "cafe", cost: 10 },
      ];
      this.replaceModal.open = true;
    },
    closeReplaceModal() {
      this.replaceModal.open = false;
      this.replaceModal.dayIndex = null;
      this.replaceModal.actIndex = null;
      this.replaceModal.target = null;
      this.replaceModal.alternatives = [];
    },

    /* 대안 적용 */
    applyReplacement(alt) {
      const d = this.replaceModal.dayIndex;
      const a = this.replaceModal.actIndex;
      if (d == null || a == null) return;
      this.$set ? this.$set(this.days[d].activities, a, alt) : this.days[d].activities.splice(a, 1, alt);
      this.closeReplaceModal();
    },

    /* 그냥 삭제 */
    deleteAnyway() {
      const d = this.replaceModal.dayIndex;
      const a = this.replaceModal.actIndex;
      if (d == null || a == null) return;
      this.deleteActivity(d, a);
      this.closeReplaceModal();
    },

    /* 실제 삭제 + 뒤 시간 당기기(간단 규칙) */
    deleteActivity(dayIndex, actIndex) {
      const acts = this.days[dayIndex].activities;
      const removed = acts.splice(actIndex, 1)[0];

      // "시간 당기기": 뒤 항목들을 30분씩 땡김 (최소 간격 유지)
      const SHIFT = 30;
      for (let i = actIndex; i < acts.length; i++) {
        const cur = this.parseTime(acts[i].time);
        const newMin = Math.max(6 * 60, cur - SHIFT); // 최소 6:00 AM
        acts[i].time = this.formatTime(newMin);
      }

      // 시간 정렬(혹시 역전되었으면)
      acts.sort((a, b) => this.parseTime(a.time) - this.parseTime(b.time));
    },
  },
};
</script>

<style scoped>
.planner-right {
  min-height: 0;
}
.planner-scroll {
  min-height: 0;
}

/* collapse 애니메이션 */
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

/* 액티비티 행 삭제버튼 표시 */
.activity-row .delete-btn {
  opacity: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.activity-row:hover .delete-btn {
  opacity: 1;
  transform: translateY(-1px);
}

/* 테마 아이콘 배지 */
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
.theme-palace {
  background: #eaf3ff;
}
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

/* 부드러운 칩 */
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

/* 모달 */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  z-index: 1050;
}
.modal-card {
  width: min(560px, 92vw);
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  animation: pop 0.2s ease;
}
@keyframes pop {
  from {
    transform: translateY(-8px);
    opacity: 0.9;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 버튼 효과 */
.btn-success:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(58, 197, 105, 0.3);
}
</style>
