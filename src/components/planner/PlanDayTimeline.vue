<!-- src/components/planner/PlanDayTimeline.vue -->
<template>
  <div class="planner-scroll flex-grow-1 overflow-auto">
    <!-- ✅ Day Tabs (분리된 스타일) -->
    <div class="day-tab-wrapper">
      <button
        v-for="(day, idx) in days"
        :key="idx"
        class="day-tab-btn"
        :class="{ active: selectedDayIndex === idx }"
        @click="selectedDayIndex = idx"
      >
        Day {{ idx + 1 }}
      </button>
    </div>

    <!-- Body -->
    <div class="day-section-wrapper">
      <!-- No Schedule -->
      <div v-if="!currentDayPlaces.length" class="empty-text">
        일정이 없습니다.
      </div>

      <!-- Render Places -->
      <div v-for="(place, idx) in currentDayPlaces" :key="idx" class="section-block">
        <!-- WITH LABEL -->
        <div v-if="typeLabel(place.details?.type)" class="place-block with-label">
          <!-- ✅ 번호 + 라벨 + 시간 : 원래 구조 그대로 -->
          <div class="place-number-wrapper">
            <div class="place-number-circle" :class="typeColor(place.details?.type)">
              {{ idx + 1 }}
            </div>

            <div class="label-text-wrapper">
              <span class="place-label">
                {{ typeLabel(place.details?.type) }}
              </span>

              <!-- ⏰ label 아래 시간 -->
              <span v-if="place.startAt" class="place-start-time under-label">
                {{ formatTime(place.startAt) }}
              </span>
            </div>
          </div>

          <div class="place-row">
            <div
              v-if="idx !== currentDayPlaces.length - 1"
              class="timeline-line label-line"
            ></div>

            <!-- 카드(오른쪽으로 자연스럽게 이동) -->
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
                    <img v-if="place.details?.gallery?.[0]" :src="place.details.gallery[0]" />
                    <div v-else class="thumb-placeholder"></div>
                  </div>

                  <div class="flex-fill">
                    <div class="place-title">{{ place.title }}</div>
                    <div class="place-type text-muted small">
                      {{ categoryMap[place.details?.type] || "장소" }}
                    </div>
                    <hr />
                    <div class="place-recommend text-primary small">
                      추천 {{ place.details?.desc || "상세 설명 없음" }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- (필요하면 나중에 add 버튼도 여기 다시 넣으면 됨) -->
            </div>
          </div>
        </div>

        <!-- NO LABEL -->
        <div v-else class="place-block no-label">
          <div class="place-row">
            <!-- 숫자 -->
            <div class="place-number-circle" :class="typeColor(place.details?.type)">
              {{ idx + 1 }}
            </div>

            <!-- 세로선 -->
            <div v-if="idx !== currentDayPlaces.length - 1" class="timeline-line"></div>

            <!-- 카드 (숫자 바로 옆) -->
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
                    <img v-if="place.details?.gallery?.[0]" :src="place.details.gallery[0]" />
                    <div v-else class="thumb-placeholder"></div>
                  </div>

                  <div class="flex-fill">
                    <div class="place-title">{{ place.title }}</div>
                    <div class="place-type text-muted small">
                      {{ categoryMap[place.details?.type] || "장소" }}
                    </div>

                    <!-- ⏰ no-label 케이스는 카드 내부에 붙이면 레이아웃이 안 깨짐 -->
                    <div v-if="place.startAt" class="place-start-time">
                      {{ formatTime(place.startAt) }}
                    </div>

                    <hr class="place-divider" />
                    <div class="place-recommend text-primary small">
                      추천 {{ place.details?.desc || "상세 설명 없음" }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- (필요하면 나중에 add 버튼도 여기 다시 넣으면 됨) -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

defineEmits(["open-modal", "delete-place"]);

const props = defineProps({
  days: { type: Array, required: true },

  editMode: Boolean,
  typeColor: Function,
  typeLabel: Function,
  formatTime: Function,
  categoryMap: Object,
});

/* ✅ Day 상태는 이 컴포넌트가 관리 */
const selectedDayIndex = ref(0);

const currentDayPlaces = computed(() => {
  return props.days?.[selectedDayIndex.value]?.places ?? [];
});
</script>

<style scoped>
/* =========================
   1) Day Tab 전용 스타일 (분리)
   ========================= */
.day-tab-wrapper {
  display: flex;
  gap: 14px;
  padding: 0 22px 16px;
  margin: 18px 18px 0;
  border-bottom: 1px solid #ddd;
}

.day-tab-btn {
  font-size: 0.85rem;
  padding: 4px 12px;
  border-radius: 14px;
  border: 2px solid #ff9800;
  color: #ff9800;
  background: transparent;
  cursor: pointer;
}

.day-tab-btn.active {
  background: #ff9800;
  color: #fff;
  font-weight: 700;
}

/* =========================
   2) 기존 타임라인/카드 스타일 (원복)
   ========================= */

/* wrapper */
.day-section-wrapper {
  padding: 26px 22px;
  background: #fafafa;
  border-radius: 14px;
  margin: 20px 18px 36px;
}

.empty-text {
  color: #888;
  font-size: 0.9rem;
  text-align: center;
  padding: 18px 0;
}

/* number + label */
.place-number-wrapper {
  display: flex;
  align-items: flex-start; /* ✅ label/time 때문에 top 정렬 */
  gap: 10px;
  margin-bottom: 8px;
}

/* number circle */
.place-number-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* number colors */
.color-purple { background: #ede9ff; color: #7a49ff; }
.color-red { background: #ffe5e5; color: #ff6b6b; }
.color-blue { background: #e5f0ff; color: #4fa3ff; }
.color-green { background: #e5ffeb; color: #3ac569; }
.color-gray { background: #efefef; color: #666; }

/* label+time wrapper */
.label-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.place-label {
  font-size: 1.05rem; /* ✅ 기존처럼 라벨이 좀 크게 */
  font-weight: 700;
  line-height: 1.05;
}

/* time */
.place-start-time {
  font-size: 0.78rem;
  color: #9ca3af;
  margin-top: 2px;
}

.place-start-time.under-label {
  font-size: 0.9rem;
  line-height: 1.1;
}

/* place row */
.place-row {
  display: flex;
  position: relative;
  margin-bottom: 28px;
}

/* timeline */
.timeline-line {
  position: absolute;
  left: 13px;
  top: 30px;
  bottom: -20px;
  width: 2px;
  background: #d0d9ff;
}

.label-line {
  top: 5px; /* ✅ 라벨 케이스 보정 */
}

/* content container */
.place-content {
  flex: 1;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* WITH LABEL → 카드 오른쪽 이동 */
.label-card-offset {
  margin-left: 45px;
}

/* card */
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

/* thumb */
.thumb {
  width: 72px;
  height: 72px;
  background: #f2f2f2;
  border-radius: 8px;
  overflow: hidden;
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

/* text */
.place-title {
  font-size: 1rem;
  font-weight: 600;
}

.place-type {
  font-size: 0.82rem;
  color: #777;
}

.place-divider {
  margin: 6px 0;
}

/* delete button */
.delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  background: #ff6b6b;
  border-radius: 50%;
  border: none;
  font-size: 12px;
  color: white;
  cursor: pointer;
  z-index: 5;
  text-align: center;
  line-height: 22px;
}
</style>
