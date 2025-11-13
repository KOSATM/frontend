<!-- src/views/planner/PlannerList.vue -->
<template>
  <section class="planner-right card shadow-sm rounded-4 h-100 d-flex flex-column">
    <!-- 상단 요약 -->
    <div class="p-4 pb-3 border-bottom">
      <PageHeader
        title="Planner"
        subtitle="Create and manage your Seoul travel itinerary"
        icon="bi-map"
      />
      <StepHeader :step="'2/4'" :title="'Check and Adjust Draft'"/>
      <div class="d-flex gap-3 align-items-center mb-3">
        <div class="rounded-3 bg-secondary-subtle d-flex align-items-center justify-content-center" style="width: 46px; height: 46px">📅</div>
        <div>
          <h5 class="mb-1 title">Your 7-Day Seoul Adventure</h5>
          <p class="text-muted small mb-0 sub">Nov 6 – Nov 12, 2025 • Seoul, Korea</p>
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

    <!-- ▶ Start Day (히어로) -->
    <div class="p-4 pt-3" v-if="!run.started">
      <div class="gradient-hero rounded-4 p-4 position-relative">
        <button class="play-btn" aria-label="Start day" @click="startDay(openDayId)">▶</button>
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
    </div>

    <!-- 현재 진행 카드 -->
    <div v-else class="px-4">
      <div class="card border-0 shadow-sm rounded-4 mb-3 gradient-hero text-white">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="sub">
              <div class="fw-semibold">Current Activity</div>
              <div class="small opacity-75">In progress</div>
            </div>
            <span class="badge-hero">Active</span>
          </div>

          <div class="run-panel rounded-4 px-3 py-3 mb-3">
            <h6 class="mb-1 title">{{ currentActivity?.title || "—" }}</h6>
            <div class="sub small mb-1">⏰ {{ currentActivity?.time || "—" }}</div>
            <div class="sub small d-flex align-items-center gap-2">
              🕒 <span>Started at {{ startedAtClock }}</span>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mb-1 sub">
            <span>Day {{ openDayId }} Progress</span>
            <span>{{ Math.round(dayProgress) }}%</span>
          </div>
          <div class="progress-hero" role="progressbar" :aria-valuenow="Math.round(dayProgress)" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-fill" :style="{ width: dayProgress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 본문 리스트 (펼침 없이, 같은 자리에서 모달/진행만) -->
    <div class="planner-scroll flex-grow-1 overflow-auto p-4 pt-3">
      <div class="d-flex flex-column gap-3">
        <div v-for="(day, dIdx) in days" :key="day.id" class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div
            class="card-body d-flex justify-content-between align-items-center"
            :class="openDayId === day.id ? 'bg-primary text-white' : 'bg-white'"
            role="button"
            @click="openDayId = day.id"
          >
            <div>
              <div class="small fw-semibold" :class="openDayId !== day.id ? 'text-primary' : ''">Day {{ day.id }}</div>
              <h6 class="mb-0 title">{{ day.title }}</h6>
              <div class="small" :class="openDayId !== day.id ? 'text-muted' : 'text-white-50'">{{ day.date }}</div>
            </div>
            <div class="text-end">
              <div class="small" :class="openDayId === day.id ? 'text-white-50' : ''">Daily Cost</div>
              <div class="fw-bold title">$ {{ day.dailyCost }}</div>
            </div>
          </div>

          <!-- 활동 목록 -->
          <div class="list-group list-group-flush">
            <button
              v-for="(act, aIdx) in day.activities"
              :key="aIdx"
              class="list-group-item text-start d-flex justify-content-between align-items-center activity-row"
              :disabled="act.completed"
              @click="openCompleteModal(dIdx, aIdx)"
            >
              <div class="d-flex align-items-start gap-3">
                <div class="icon-badge themed" :class="'theme-' + (act.type || 'default')">
                  {{ act.icon || getIconForType(act.type) }}
                </div>
                <div class="d-flex flex-column">
                  <div class="fw-semibold small title"><span v-if="act.completed" class="me-2">✅</span>{{ act.title }}</div>
                  <div class="d-flex align-items-center gap-2 small text-muted sub">
                    <span class="soft-chip"><span class="chip-emoji">⏰</span> {{ act.time }}</span>
                    <span v-if="hasCost(act.cost)" class="soft-chip"><span class="chip-emoji">💰</span> {{ formatCost(act.cost) }}</span>
                    <span v-if="act.spent != null" class="soft-chip"><span class="chip-emoji">💵</span> Spent {{ formatCost(act.spent) }}</span>
                  </div>
                </div>
              </div>
              <span class="small sub" :class="act.completed ? 'text-success fw-semibold' : 'text-muted'">
                {{ act.completed ? "Done" : "Open" }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="p-4 pt-0 border-top bg-white">
      <RouterLink class="btn btn-success w-100 rounded-3" to="/planner/hotel">Next: Select Hotel</RouterLink>
    </div>
  </section>

  <!-- Complete 모달 -->
  <div v-if="complete.open" class="modal-backdrop" @click="closeComplete()">
    <div class="modal-card" @click.stop>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="mb-0 title">Complete Activity</h6>
        <button class="btn btn-sm btn-light rounded-circle" @click="closeComplete">✕</button>
      </div>

      <p class="small text-muted mb-2 sub">
        How was your visit to <strong>{{ complete.target?.title }}</strong
        >?
      </p>

      <label class="small sub text-muted mb-1 d-block">Actual Cost (Optional)</label>
      <div class="input-group mb-3">
        <span class="input-group-text">$</span>
        <input type="number" min="0" step="1" class="form-control" v-model.number="complete.spend" />
        <span class="input-group-text">USD</span>
      </div>

      <div class="quick-card">
        <div class="row g-2 small sub">
          <div class="col-6"><strong>Started:</strong> {{ startedAtClock }}</div>
          <div class="col-6"><strong>Duration:</strong> ~{{ estimateDuration }}m</div>
          <div class="col-12"><strong>Status:</strong> <span class="text-success fw-semibold">On schedule ✓</span></div>
        </div>
      </div>

      <div class="d-flex justify-content-between mt-3">
        <button class="btn btn-light" @click="closeComplete">Cancel</button>
        <button class="btn btn-dark" @click="confirmComplete">Complete Activity</button>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/common/PageHeader.vue';
import StepHeader from '@/components/common/StepHeader.vue';

export default {
  name: "PlannerList",
  components: {
    PageHeader,
    StepHeader
  },
  data() {
    return {
      openDayId: 1,
      budget: [
        { label: "Total Budget", value: "$2000", bg: "bg-warning-subtle" },
        { label: "Estimated Cost", value: "$1800", bg: "bg-info-subtle" },
        { label: "Remaining", value: "$200", bg: "bg-success-subtle" },
      ],
      // 일정 (필요하면 이어서 추가)
      days: [
        {
          id: 1,
          title: "Arrival & Gangnam Exploration",
          date: "Nov 6, 2025",
          dailyCost: 80,
          activities: [
            { title: "Welcome Lunch (Gangnam)", time: "12:30 PM", type: "food", cost: 14, completed: false, spent: null },
            { title: "COEX & Starfield Library", time: "2:00 PM", type: "shopping", cost: 0, completed: false, spent: null },
            { title: "Bongeunsa Temple", time: "4:00 PM", type: "walk", cost: 0, completed: false, spent: null },
            { title: "Garosu-gil Stroll", time: "5:30 PM", type: "walk", cost: 0, completed: false, spent: null },
            { title: "Dinner at Local Bistro", time: "7:00 PM", type: "food", cost: 22, completed: false, spent: null },
            { title: "Cheonggyecheon Night View", time: "9:00 PM", type: "view", cost: 0, completed: false, spent: null },
          ],
        },
        {
          id: 2,
          title: "Palace & Hanbok Experience",
          date: "Nov 7, 2025",
          dailyCost: 62,
          activities: [
            { title: "Breakfast at Local Cafe", time: "8:30 AM", type: "cafe", cost: 8, completed: false, spent: null },
            { title: "Gyeongbokgung Palace", time: "10:00 AM", type: "palace", cost: 0, completed: false, spent: null },
            { title: "Hanbok Rental", time: "12:00 PM", type: "shopping", cost: 15, completed: false, spent: null },
            { title: "Bukchon Hanok Village", time: "2:00 PM", type: "walk", cost: 0, completed: false, spent: null },
            { title: "Insadong Tea Time", time: "4:00 PM", type: "dessert", cost: 7, completed: false, spent: null },
            { title: "Jongno Dinner", time: "6:30 PM", type: "food", cost: 18, completed: false, spent: null },
          ],
        },
      ],

      // 재생/진행
      run: {
        started: false,
        startedAt: null, // number (ms)
      },

      // Complete 모달
      complete: {
        open: false,
        dayIdx: null,
        actIdx: null,
        target: null,
        spend: null,
      },
    };
  },
  computed: {
    currentDay() {
      return this.days.find((d) => d.id === this.openDayId) || null;
    },
    // 현재 액티비티 index = 아직 완료되지 않은 첫 항목
    currentActivityIndex() {
      if (!this.currentDay) return 0;
      const idx = this.currentDay.activities.findIndex((a) => !a.completed);
      return idx === -1 ? this.currentDay.activities.length - 1 : idx;
    },
    currentActivity() {
      return this.currentDay?.activities?.[this.currentActivityIndex] || null;
    },
    // 완료 갯수 / 전체 갯수
    dayProgress() {
      if (!this.currentDay) return 0;
      const total = this.currentDay.activities.length || 1;
      const done = this.currentDay.activities.filter((a) => a.completed).length;
      return (done / total) * 100;
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
    estimateDuration() {
      // 간단히 35분 고정 (원하면 실제 다음 액티비티 시간과 차이로 계산 가능)
      return 35;
    },
  },
  methods: {
    /* ---------- 공통 유틸 ---------- */
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

    /* ---------- Start & Complete ---------- */
    startDay(dayId) {
      if (!this.days.find((d) => d.id === dayId)) return;
      this.openDayId = dayId;
      this.run.started = true;
      this.run.startedAt = Date.now();
      // 진행 시작 시점보다 이전 액티비티는 자동 완료 처리(옵션)
      const nowMin = new Date(this.run.startedAt).getHours() * 60 + new Date(this.run.startedAt).getMinutes();
      this.currentDay.activities.forEach((a) => {
        const [hm, ap] = a.time.split(" ");
        let [h, m] = hm.split(":").map(Number);
        if (ap?.toUpperCase() === "PM" && h !== 12) h += 12;
        if (ap?.toUpperCase() === "AM" && h === 12) h = 0;
        const t = h * 60 + m;
        if (t < nowMin) a.completed = true;
      });
    },

    openCompleteModal(dIdx, aIdx) {
      const target = this.days[dIdx].activities[aIdx];
      this.complete = { open: true, dayIdx: dIdx, actIdx: aIdx, target, spend: null };
    },
    closeComplete() {
      this.complete = { open: false, dayIdx: null, actIdx: null, target: null, spend: null };
    },
    confirmComplete() {
      const { dayIdx, actIdx, spend } = this.complete;
      if (dayIdx == null || actIdx == null) return;
      const act = this.days[dayIdx].activities[actIdx];
      act.completed = true;
      if (typeof spend === "number" && !Number.isNaN(spend) && spend >= 0) {
        act.spent = spend;
      }
      this.closeComplete();
      // 다음 미완료 액티비티로 포커스 유지
      const nextIdx = this.days[dayIdx].activities.findIndex((a) => !a.completed);
      if (nextIdx !== -1) {
        // nothing extra; 상단 Current Activity가 자동으로 바뀜
      }
    },
  },
};
</script>

<style scoped>
/* 고정 팔레트 (변수 없이 하드코딩) */
:root {
  /* 변수 없어도 동작하도록 폴백만 둠 */
  --primary: #ff8c00;
  --secondary: #1b3b6f;
  --success: #3ac569;
}

/* 폰트 패밀리 유지 */
.title {
  font-family: "Siganpyo", sans-serif;
}
.sub {
  font-family: "Kyobo2024", sans-serif;
}

/* ===== Hero / Current ===== */
/* 변수 미정의여도 항상 보이게 하드코딩 그라데이션 + 폴백 */
.gradient-hero {
  color: #ffffff;
  background: linear-gradient(135deg, #2c4672, #2e4b77 55%, #ffb25a);
  /* 만약 위가 막히면 단색 폴백 */
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

/* ▶ 버튼 */
.play-btn {
  position: absolute;
  left: 20px;
  top: 20px;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: none;
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

/* 현재 액티비티 카드 안 패널(어두운 배경 대비 톤 분리) */
.run-panel {
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.75rem;
}

/* ===== 진행도 바: 항상 보이는 색으로 고정 ===== */
.progress-hero {
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.35);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}
.progress-hero .progress-fill {
  height: 100%;
  border-radius: inherit;
  /* 폴백: 오렌지 → 옐로 그라데이션 */
  background: linear-gradient(90deg, #ff8c00 0%, #ffd27a 100%);
  transition: width 0.35s ease;
}

/* ===== Active 배지: 배경 진하게, 글자 흰색 ===== */
.badge-hero {
  background: #3ac569;
  color: #ffffff;
  font-weight: 700;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 리스트/아이템 */
.activity-row {
  transition: background 0.15s ease;
}
.activity-row:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.activity-row:hover {
  background: #fafbff;
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

/* 모달 */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 8vh 14px;
  z-index: 1050;
}
.modal-card {
  width: min(560px, 92vw);
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  animation: pop 0.18s ease;
}
@keyframes pop {
  from {
    transform: translateY(-6px);
    opacity: 0.9;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
