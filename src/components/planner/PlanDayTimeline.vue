<template>
  <!-- Body -->
  <div class="planner-scroll flex-grow-1 overflow-auto">
    <div class="day-section-wrapper">
      <div v-for="(place, idx) in currentDayPlaces" :key="idx" class="section-block">
        <div class="place-block">
          <!-- 번호 + 라벨 -->
          <div class="place-number-wrapper">
            <div class="place-number-circle" :class="typeColor(place.details?.type)">
              {{ idx + 1 }}
            </div>

            <div class="label-text-wrapper">
              <h6 v-if="typeLabel(place.details?.type)" class="place-label">
                {{ typeLabel(place.details?.type) }}
              </h6>

              <span
                v-if="place.startAt"
                class="place-start-time"
                :class="{ 'under-label': typeLabel(place.details?.type) }"
              >
                {{ formatTime(place.startAt) }}
              </span>
            </div>
          </div>

          <!-- 타임라인 + 카드 -->
          <div class="place-row">
            <div
              v-if="idx !== currentDayPlaces.length - 1"
              class="timeline-line"
              :class="{ 'label-line': typeLabel(place.details?.type) }"
            ></div>

            <div
              class="place-content"
              :class="{ 'label-card-offset': typeLabel(place.details?.type) }"
            >
              <div
                class="place-card shadow-sm rounded-3 p-3 flex-fill"
                @click="$emit('open-modal', place)"
              >
                <button
                  v-if="editMode"
                  class="delete-btn"
                  @click.stop="$emit('delete-place', idx, place)"
                >
                  ✕
                </button>

                <div class="d-flex gap-3">
                  <div class="thumb">
                    <img
                      v-if="place.details?.gallery?.[0]"
                      :src="place.details.gallery[0]"
                    />
                    <div v-else class="thumb-placeholder"></div>
                  </div>

                  <div class="flex-fill">
                    <div class="place-title">{{ place.title }}</div>
                    <div class="place-type text-muted small">
                      {{ categoryMap[place.details?.type] || '장소' }}
                    </div>

                    <hr class="place-divider" />

                    <div class="place-recommend text-primary small">
                      추천 {{ place.details?.desc || '상세 설명 없음' }}
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
defineProps({
  currentDayPlaces: {
    type: Array,
    required: true,
  },
  editMode: Boolean,
  typeColor: Function,
  typeLabel: Function,
  formatTime: Function,
  categoryMap: Object,
});

defineEmits(['open-modal', 'delete-place']);
</script>
<style scoped>
.planner-scroll {
  flex-grow: 1;
  overflow: auto;
}

/* day wrapper */
.day-section-wrapper {
  padding: 26px 22px;
  background: #fafafa;
  border-radius: 14px;
  margin: 28px 18px 36px;
}

/* number + label */
.place-number-wrapper {
  display: flex;
  align-items: flex-start;
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

/* label + time wrapper */
.label-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.place-label {
  font-size: inherit;
  font-weight: inherit;
  line-height: normal;
  margin-top: 0;
  margin-bottom: 2px;
}

.place-start-time.under-label {
  font-size: 0.9rem;
  color: #9ca3af;
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
  top: 0px;
  bottom: -20px;
  width: 2px;
  background: #d0d9ff;
}

.label-line {
  top: 5px;
}

/* content container */
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
  line-height: 22px;
}
</style>
