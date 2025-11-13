<template>
  <section class="planner-right card shadow-sm rounded-4 h-100 d-flex flex-column">
    <!-- 상단 요약 -->
    <div class="p-4 pb-3 border-bottom">
      <div class="d-flex gap-3 align-items-center mb-3">
        <div class="rounded-3 bg-secondary-subtle d-flex align-items-center justify-content-center" style="width: 46px; height: 46px">
          📅
        </div>
        <div>
          <h5 class="mb-1">Your 7-Day Seoul Adventure</h5>
          <p class="text-muted small mb-0">Nov 6 – Nov 12, 2025 • Seoul, Korea</p>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-md-4" v-for="card in budget" :key="card.label">
          <div class="card border-0 shadow-sm rounded-3" :class="card.bg">
            <div class="card-body py-3">
              <p class="small text-muted mb-1">{{ card.label }}</p>
              <h5 class="mb-0">{{ card.value }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 본문 -->
    <div class="planner-scroll flex-grow-1 overflow-auto p-4 pt-3">
      <!-- 🔹 위: 1~3일까지만 세로 카드 -->
      <div class="d-flex flex-column gap-3 mb-4">
        <div
          v-for="day in days"
          :key="day.id"
          class="card border-0 shadow-sm rounded-4 overflow-hidden"
        >
          <div
            class="card-body d-flex justify-content-between align-items-center"
            :class="openDayId === day.id ? 'bg-primary text-white' : 'bg-white'"
            @click="toggleDay(day.id)"
            role="button"
          >
            <div>
              <div class="small fw-semibold" :class="openDayId !== day.id ? 'text-primary' : ''">
                Day {{ day.id }}
              </div>
              <h6 class="mb-0">{{ day.title }}</h6>
              <div class="small" :class="openDayId !== day.id ? 'text-muted' : 'text-white-50'">
                {{ day.date }}
              </div>
            </div>
            <div class="text-end">
              <div class="small">Daily Cost</div>
              <div class="fw-bold">${{ day.dailyCost }}</div>
              <div class="small">
                <span class="chevron" :class="{ 'rotate-180': openDayId === day.id }">⌃</span>
              </div>
            </div>
          </div>
          <transition name="collapse">
            <div v-if="openDayId === day.id" class="list-group list-group-flush">
              <div
                v-for="(act, i) in day.activities"
                :key="i"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <div class="fw-semibold small">{{ act.title }}</div>
                  <div class="text-muted small">{{ act.time }}</div>
                </div>
                <div class="text-muted">›</div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 🔥 아래: 4일부터 캐러셀로 -->
      <div v-if="extraDays.length" class="d-flex justify-content-between align-items-center mb-2">
        <span class="small text-muted">More days</span>
        <span class="small fw-semibold text-primary">
          Day {{ extraDays[currentExtraIndex].id }} of {{ days.length + extraDays.length }}
        </span>
      </div>

      <div v-if="extraDays.length" class="extra-carousel d-flex align-items-center gap-3 mb-3">
        <!-- prev -->
        <button
          class="btn btn-light rounded-circle shadow-sm carousel-arrow"
          @click="prevExtra"
          :disabled="currentExtraIndex === 0"
        >
          ‹
        </button>

        <!-- 카드 1장 -->
        <div class="flex-grow-1">
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div
              class="card-body d-flex justify-content-between align-items-center"
              :class="openExtraId === extraDays[currentExtraIndex].id ? 'bg-primary text-white' : 'bg-white'"
              @click="toggleExtra(extraDays[currentExtraIndex].id)"
              role="button"
            >
              <div>
                <div
                  class="small fw-semibold mb-1"
                  :class="openExtraId !== extraDays[currentExtraIndex].id ? 'text-primary' : ''"
                >
                  Day {{ extraDays[currentExtraIndex].id }}
                </div>
                <h6 class="mb-0">{{ extraDays[currentExtraIndex].title }}</h6>
                <div
                  class="small"
                  :class="openExtraId !== extraDays[currentExtraIndex].id ? 'text-muted' : 'text-white-50'"
                >
                  {{ extraDays[currentExtraIndex].date }}
                </div>
              </div>
              <div class="text-end">
                <div class="small" :class="openExtraId === extraDays[currentExtraIndex].id ? 'text-white-50' : ''">
                  Daily Cost
                </div>
                <div class="fw-bold">${{ extraDays[currentExtraIndex].dailyCost }}</div>
                <div class="small">
                  <span
                    class="chevron"
                    :class="{ 'rotate-180': openExtraId === extraDays[currentExtraIndex].id }"
                  >
                    ⌃
                  </span>
                </div>
              </div>
            </div>

            <!-- 캐러셀 카드도 펼쳐지게 -->
            <transition name="collapse">
              <div v-if="openExtraId === extraDays[currentExtraIndex].id" class="list-group list-group-flush">
                <div
                  v-for="(act, i) in extraDays[currentExtraIndex].activities"
                  :key="'extra-act-' + i"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <div class="fw-semibold small">{{ act.title }}</div>
                    <div class="text-muted small">{{ act.time }}</div>
                  </div>
                  <div class="text-muted">›</div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- next -->
        <button
          class="btn btn-light rounded-circle shadow-sm carousel-arrow"
          @click="nextExtra"
          :disabled="currentExtraIndex === extraDays.length - 1"
        >
          ›
        </button>
      </div>

      <!-- indicator -->
      <div v-if="extraDays.length" class="d-flex justify-content-center gap-2 mb-1">
        <span
          v-for="(day, idx) in extraDays"
          :key="'ind-' + day.id"
          class="indicator-dot"
          :class="{ 'indicator-dot--active': idx === currentExtraIndex }"
        ></span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      openDayId: 1,
      openExtraId: null,
      currentExtraIndex: 0,
      budget: [
        { label: 'Total Budget', value: '$2000', bg: 'bg-warning-subtle' },
        { label: 'Estimated Cost', value: '$1800', bg: 'bg-info-subtle' },
        { label: 'Remaining', value: '$200', bg: 'bg-success-subtle' }
      ],
      // 🔹 위에 보여줄 건 1~3일만
      days: [
        {
          id: 1,
          title: 'Arrival & Gangnam Exploration',
          date: 'Nov 6, 2025',
          dailyCost: 80,
          activities: [
            { title: 'Hotel Check-in (Gangnam)', time: '5:00 PM' },
            { title: 'COEX Mall & Starfield Library', time: '6:30 PM' },
            { title: 'Bongeunsa Temple', time: '8:30 PM' },
            { title: 'Gangnam Street Food Tour', time: '9:30 PM' }
          ]
        },
        {
          id: 2,
          title: 'Palace & Hanbok Experience',
          date: 'Nov 7, 2025',
          dailyCost: 62,
          activities: [
            { title: 'Gyeongbokgung Palace', time: '10:00 AM' },
            { title: 'Hanbok Rental', time: '12:00 PM' },
            { title: 'Bukchon Hanok Village', time: '2:00 PM' }
          ]
        },
        {
          id: 3,
          title: 'N Seoul Tower & Hongdae',
          date: 'Nov 8, 2025',
          dailyCost: 137,
          activities: [
            { title: 'Myeongdong Shopping', time: '11:00 AM' },
            { title: 'Street Snacks', time: '1:00 PM' },
            { title: 'N Seoul Tower (Sunset)', time: '6:00 PM' }
          ]
        }
      ],
      // 🔥 4일부터는 캐러셀
      extraDays: [
        {
          id: 4,
          title: 'DMZ Tour & War Memorial',
          date: 'Nov 9, 2025',
          dailyCost: 240,
          activities: [
            { title: 'DMZ Tour Pickup', time: '7:30 AM' },
            { title: 'Imjingak & Dora Observatory', time: '9:00 AM' },
            { title: 'Return to Seoul', time: '2:30 PM' }
          ]
        },
        {
          id: 5,
          title: 'Shopping & Cafe Hopping',
          date: 'Nov 10, 2025',
          dailyCost: 95,
          activities: [
            { title: 'Garosu-gil brunch', time: '10:30 AM' },
            { title: 'Sinsa cafe street', time: '1:00 PM' }
          ]
        },
        {
          id: 6,
          title: 'Day Trip to Suwon',
          date: 'Nov 11, 2025',
          dailyCost: 120,
          activities: [
            { title: 'Suwon Fortress tour', time: '11:00 AM' },
            { title: 'Local lunch', time: '1:00 PM' }
          ]
        },
        {
          id: 7,
          title: 'Relax & Departure',
          date: 'Nov 12, 2025',
          dailyCost: 60,
          activities: [
            { title: 'Check-out', time: '10:00 AM' },
            { title: 'Airport transfer', time: '1:30 PM' }
          ]
        }
      ]
    }
  },
  methods: {
    toggleDay(id) {
      this.openDayId = this.openDayId === id ? null : id
    },
    toggleExtra(id) {
      this.openExtraId = this.openExtraId === id ? null : id
    },
    nextExtra() {
      if (this.currentExtraIndex < this.extraDays.length - 1) {
        this.currentExtraIndex++
        this.openExtraId = null
      }
    },
    prevExtra() {
      if (this.currentExtraIndex > 0) {
        this.currentExtraIndex--
        this.openExtraId = null
      }
    }
  }
}
</script>

<style scoped>
.planner-right {
  background: #fff;
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

/* 캐러셀 화살표 */
.carousel-arrow {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #1b3b6f;
}
.carousel-arrow:disabled {
  opacity: 0.35;
  pointer-events: none;
}

/* indicator */
.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #d9d9d9;
  transition: all 0.2s ease;
}
.indicator-dot--active {
  width: 26px;
  background: #1b3b6f;
}
</style>
