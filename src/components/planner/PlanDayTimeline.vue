<!-- src/components/planner/PlanDayTimeline.vue -->
<template>
  <div class="planner-scroll flex-grow-1 overflow-auto">
    <div class="day-tab-wrapper">
      <button
        v-for="(day, idx) in days"
        :key="idx"
        class="day-tab-btn"
        :class="{ active: selectedDayIndex === idx }"
        @click="$emit('update:selectedDayIndex', idx)"
      >
        Day {{ idx + 1 }}
      </button>
    </div>

    <div class="day-section-wrapper">
      <div v-if="!currentDayPlaces.length" class="empty-text">
        일정이 없습니다.
      </div>

      <div v-for="(place, idx) in currentDayPlaces" :key="idx" class="section-block">
        <div v-if="typeLabel(place.details?.type)" class="place-block with-label">
          <div class="place-number-wrapper">
            <div class="place-number-circle" :class="typeColor(place.details?.type)">
              {{ idx + 1 }}
            </div>

            <div class="label-text-wrapper">
              <span class="place-label">
                {{ typeLabel(place.details?.type) }}
              </span>

              <span v-if="place.startAt" class="place-start-time under-label small text-muted">
                {{ formatTime(place.startAt) }}
              </span>
            </div>
          </div>

          <div class="place-row">
            <div
              v-if="idx !== currentDayPlaces.length - 1"
              class="timeline-line label-line"
            ></div>

            <div class="place-content label-card-offset">
              <div class="place-card shadow-sm rounded-3 p-3 flex-fill" @click="$emit('open-modal', place)">
                <button
                  v-if="editMode"
                  class="delete-btn"
                  @click.stop="$emit('delete-place', idx, place)"
                >
                  ✕
                </button>

                <div class="d-flex gap-3">
                  <div class="thumb">
                    <img v-if="place.details?.gallery?.[0]" :src="place.details.gallery[0]" v-img-fallback="fallbacks" />
                    <div v-else class="thumb-placeholder"></div>
                  </div>

                  <div class="flex-fill d-flex flex-column justify-content-center">
                    <div class="place-title">{{ place.title }}</div>
                    
                    <div class="place-type small text-muted">
                      {{ categoryMap[place.details?.type] || "장소" }}
                    </div>
                    
                    <hr class="place-divider"/>
                    
                    <div class="place-recommend small text-primary">
                      추천 {{ place.details?.desc || "상세 설명 없음" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="place-block no-label">
          <div class="place-row">
            <div class="place-number-circle" :class="typeColor(place.details?.type)">
              {{ idx + 1 }}
            </div>

            <div v-if="idx !== currentDayPlaces.length - 1" class="timeline-line"></div>

            <div class="place-content">
              <div class="place-card shadow-sm rounded-3 p-3 flex-fill" @click="$emit('open-modal', place)">
                <button
                  v-if="editMode"
                  class="delete-btn"
                  @click.stop="$emit('delete-place', idx, place)"
                >
                  ✕
                </button>

                <div class="d-flex gap-3">
                  <div class="thumb">
                    <img v-if="place.details?.gallery?.[0]" :src="place.details.gallery[0]" v-img-fallback="fallbacks" />
                    <div v-else class="thumb-placeholder"></div>
                  </div>

                  <div class="flex-fill d-flex flex-column justify-content-center">
                    <div class="place-title">{{ place.title }}</div>
                    
                    <div class="place-type small text-muted">
                      {{ categoryMap[place.details?.type] || "장소" }}
                    </div>

                    <div v-if="place.startAt" class="place-start-time small text-muted mt-1">
                      {{ formatTime(place.startAt) }}
                    </div>

                    <hr class="place-divider" />
                    
                    <div class="place-recommend small text-primary">
                      추천 {{ place.details?.desc || "상세 설명 없음" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

defineEmits(["open-modal", "delete-place", "update:selectedDayIndex"]);

const props = defineProps({
  days: { type: Array, required: true },
  currentDayPlaces: { type: Array, required: true },
  selectedDayIndex: { type: Number, default: 0 },
  editMode: Boolean,
  typeColor: Function,
  typeLabel: Function,
  formatTime: Function,
  categoryMap: Object,
});

const fallbacks = [
  "/images/01.png",
  "/images/02.png",
  "/images/03.png",
  "/images/04.png",
  "/images/05.png",
  "/images/06.png",
];

</script>

<style scoped lang="scss">
/* ✅ 중요: SCSS 변수를 쓰고 싶다면 아래처럼 import 해야 하지만,
   이미 전역에 등록되어 있다면 생략 가능합니다.
   @import "@/assets/styles/_variables.scss"; 
*/

/* =========================
   1) Day Tab
   ========================= */
.day-tab-wrapper {
  display: flex;
  gap: 14px;
  padding: 0 22px 16px;
  margin: 18px 18px 0;
  border-bottom: 1px solid #ddd;
}

.day-tab-btn {
  /* ✅ Font Size 제거 -> 상속 or Base Size 사용 */
  /* ✅ 제목 성격이므로 memoment 폰트 적용 */
  font-family: 'memoment';
  
  padding: 4px 12px;
  border-radius: 14px;
  border: 2px solid #ff9800;
  color: #ff9800;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.day-tab-btn.active {
  background: #ff9800;
  color: #fff;
  /* active 시 살짝 두껍게 */
  font-weight: 700; 
}

/* =========================
   2) Content Styles
   ========================= */

.day-section-wrapper {
  padding: 26px 22px;
  background: #fafafa;
  border-radius: 14px;
  margin: 20px 18px 36px;
}

.empty-text {
  /* Base Font Size(1.5rem)에 따라 자동 조정됨 */
  color: #888;
  text-align: center;
  padding: 18px 0;
}

/* Number Circle */
.place-number-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}

.place-number-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /* 숫자는 가독성 위해 기본 폰트보다 조금 작게 조정 필요할 수도 있으나, 
     일단 typography.scss의 흐름을 따름 */
}

/* Colors */
.color-purple { background: #ede9ff; color: #7a49ff; }
.color-red { background: #ffe5e5; color: #ff6b6b; }
.color-blue { background: #e5f0ff; color: #4fa3ff; }
.color-green { background: #e5ffeb; color: #3ac569; }
.color-gray { background: #efefef; color: #666; }

/* Label Text */
.label-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.place-label {
  font-family: 'memoment';
  line-height: 1.1;
  color: #333; /* 혹은 SCSS 변수 $secondary */
}

.place-start-time {
  line-height: 1.2;
}

/* =========================
   Layout & Lines
   ========================= */
.place-row {
  display: flex;
  position: relative;
  margin-bottom: 28px;
}

.timeline-line {
  position: absolute;
  left: 13px;
  top: 30px;
  bottom: -20px;
  width: 2px;
  background: #d0d9ff;
}

.label-line {
  top: 5px;
}

.place-content {
  flex: 1;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label-card-offset {
  margin-left: 45px;
}

/* =========================
   Card Styles
   ========================= */
.place-card {
  position: relative;
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  cursor: pointer;
  padding: 14px;
  width: 100%;
  box-sizing: border-box;
}

.thumb {
  width: 72px;
  height: 72px;
  background: #f2f2f2;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  width: 100%;
  height: 100%;
  background: #eee;
}

/* Card Text */
.place-title {
  line-height: 1.2;
  margin-bottom: 2px;
}

.place-type {
  /* .small 적용됨 */
  line-height: 1.2;
}

.place-recommend {
  /* .small 적용됨 */
  line-height: 1.3;
}

.place-divider {
  margin: 6px 0;
  opacity: 0.1;
}

/* Delete Button */
.delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  background: #ff6b6b;
  border-radius: 50%;
  border: none;
  font-size: 0.75rem; /* 버튼 아이콘은 예외적으로 작게 유지 */
  color: white;
  cursor: pointer;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
