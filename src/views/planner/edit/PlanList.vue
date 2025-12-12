<template>
  <section class="planner-right card shadow-sm rounded-4 h-100 d-flex flex-column">

    <!-- Header -->
    <div class="p-4 pb-3 border-bottom d-flex justify-content-between align-items-center">
      <div class="d-flex gap-3 align-items-center">
        <div class="rounded-3 bg-secondary-subtle d-flex align-items-center justify-content-center"
          style="width: 46px; height: 46px">
          📅
        </div>

        <div>
          <h5 class="mb-1 title" v-html="highlightedTitle"></h5>
          <p class="text-muted small mb-0 sub">
            {{ plan?.startDate }} - {{ plan?.endDate }} • Seoul, Korea
          </p>
        </div>
      </div>

      <button v-if="currentDayPlaces.length > 0" class="btn btn-outline-secondary btn-sm" @click="toggleEditMode">
        {{ editMode ? "일정 보기" : "편집" }}
      </button>
    </div>

    <!-- Body -->
    <div class="planner-scroll flex-grow-1 overflow-auto">
      <div class="day-section-wrapper">

        <!-- Day Tabs -->
        <div class="inner-day-tab-wrapper">
          <button v-for="(day, idx) in days" :key="idx" class="btn btn-outline-primary btn-day-tab"
            :class="{ active: selectedDayIndex === idx }" @click="selectedDayIndex = idx">
            Day {{ idx + 1 }}
          </button>
        </div>

        <!-- No Schedule -->
        <div v-if="!currentDayPlaces.length" class="text-muted small text-center py-4">
          일정이 없습니다.
        </div>

        <!-- Top Add Button -->
        <div v-if="editMode && currentDayPlaces.length > 0" class="place-row" style="margin-bottom: 16px;">
          <div class="place-number-circle invisible"></div>

          <div class="place-content">
            <div class="add-place-btn" @click="addPlace(0)">
              + 장소 추가
            </div>
          </div>
        </div>

        <!-- Render Places -->
        <div v-for="(place, idx) in currentDayPlaces" :key="idx" class="section-block">
          <!-- WITH LABEL -->
          <div v-if="typeLabel(place.details?.type)" class="place-block with-label">

            <div class="place-number-wrapper">
              <div class="place-number-circle" :class="typeColor(place.details?.type)">
                {{ idx + 1 }}
              </div>

              <span class="place-label">
                {{ typeLabel(place.details?.type) }}
              </span>
            </div>

            <div class="place-row">
              <div v-if="idx !== currentDayPlaces.length - 1" class="timeline-line label-line"></div>

              <!-- 카드(오른쪽으로 자연스럽게 이동) -->
              <div class="place-content label-card-offset">
                <div class="place-card shadow-sm rounded-3 p-3 flex-fill" @click="openModal(place)">
                  <button v-if="editMode" class="delete-btn" @click.stop="deletePlace(idx)">
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

                <div v-if="editMode" class="add-place-btn" @click="addPlace(idx + 1)">
                  + 장소 추가
                </div>
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
                <div class="place-card shadow-sm rounded-3 p-3 flex-fill" @click="openModal(place)">
                  <button v-if="editMode" class="delete-btn" @click.stop="deletePlace(idx)">
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

                      <hr class="place-divider" />

                      <div class="place-recommend text-primary small">
                        추천 {{ place.details?.desc || "상세 설명 없음" }}
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="editMode" class="add-place-btn" @click="addPlace(idx + 1)">
                  + 장소 추가
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="p-4 pt-0 border-top bg-white">
      <BaseButton v-if="!travelStore.$state.isTraveling" @click="next()" variant="primary" class="w-100 py-2">
        Next: Select Accommodation
      </BaseButton>

      <BaseButton v-else @click="endplan()" variant="success" class="w-100 py-2">
        FORCE to End plan
      </BaseButton>
    </div>

    <!-- Modal -->
    <ActivityDetailsModal :open="modalOpen" :data="modalData" @close="modalOpen = false" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

import BaseButton from "@/components/common/BaseButton.vue";
import plannerApi from "@/api/plannerApi";

import { useAuthStore } from "@/store/authStore";
import { useTravelStore } from "@/store/travelStore";
import ActivityDetailsModal from "@/components/planner/ActivityDetailsModal.vue";
import { useChatStore } from "@/store/chatStore";

/* ---------- 기본 상태들 ---------- */
const modalOpen = ref(false);
const modalData = ref(null);

const plan = ref(null);
const days = ref([]);
const selectedDayIndex = ref(0);
const editMode = ref(false);

const chatStore = useChatStore();
const router = useRouter();
const authStore = useAuthStore();
const travelStore = useTravelStore();

/* ---------- AI 일정 → 화면에 적용하는 함수 ---------- */
const applyAiPlan = (payload) => {
  console.log("✅ [PlanList] applyAiPlan 호출됨", payload);

  if (!payload) return;

  plan.value = {
    id: payload.planId,
    startDate: payload.startDate,
    endDate: payload.endDate,
    title: payload.title ?? "AI 추천 여행 일정",
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
      placeName: s.placeName,
      address: s.address,
      details: {
        type: s.normalizedCategory ?? "ETC",
        gallery: s.firstImage2
          ? [s.firstImage2]
          : (s.firstImage ? [s.firstImage] : []),
        desc: `${s.title} 방문을 추천합니다`,
        address: s.address,
        area: "Seoul",
        firstImage: s.firstImage,
        firstImage2: s.firstImage2,
      },
    })),
  }));

  selectedDayIndex.value = 0;
  console.log("✅ [PlanList] days 갱신:", days.value);
};

/* ---------- ⭐ 핵심: 시간(updatedAt)을 watch ---------- */
watch(
  () => chatStore.livePlanFromChat?.updatedAt,
  (newVal, oldVal) => {
    console.log(
      "🔥 [PlanList] livePlanFromChat.updatedAt 변경 감지:",
      oldVal,
      "->",
      newVal,
      " / 전체 상태:",
      chatStore.livePlanFromChat
    );

    if (!chatStore.livePlanFromChat) return;

    const payload = chatStore.livePlanFromChat.data;
    applyAiPlan(payload);
  },
  { immediate: true }
);

/* ---------- 모달 관련 ---------- */
const openModal = (place) => {
  if (editMode.value) return;

  modalData.value = {
    title: place.title,
    address: place.details?.address,
    area: place.details?.area ?? "Seoul",
    gallery: place.details?.firstImage
      ? [place.details.firstImage]
      : (place.details?.gallery ?? []),
    desc: place.details?.desc,
  };
  modalOpen.value = true;
};

/* ---------- 기타 상태 / 함수 ---------- */
const toggleEditMode = () => (editMode.value = !editMode.value);
const deletePlace = (index) =>
  days.value[selectedDayIndex.value].places.splice(index, 1);
const addPlace = (index) => console.log("장소 추가 위치:", index);

const highlightedTitle = computed(
  () =>
    plan.value?.title ??
    `서울, 3박 4일 <span class="highlight">추천일정</span>입니다`
);

const categoryMap = {
  FOOD: "음식점",
  SPOT: "관광지",
  SHOPPING: "쇼핑",
  CAFE: "카페",
  HOTEL: "숙소",
  EVENT: "이벤트",
  ETC: "기타",
};

const typeColor = (type) => {
  switch (type) {
    case "FOOD": return "color-red";
    case "SHOPPING": return "color-blue";
    case "CAFE": return "color-green";
    case "HOTEL": return "color-gray";
    case "SPOT": return "color-purple";
    case "EVENT": return "color-purple";
    default: return "color-purple";
  }
};

const typeLabel = (type) => {
  switch (type) {
    case "FOOD": return "식사 장소 추천";
    case "SHOPPING": return "쇼핑 추천";
    case "CAFE": return "카페 추천";
    case "HOTEL": return "숙소 이동";
    case "SPOT": return "관광지 추천";
    case "EVENT": return "이벤트 방문";
    default: return null;
  }
};

const currentDayPlaces = computed(
  () => days.value?.[selectedDayIndex.value]?.places ?? []
);

/* ---------- 서버 플랜 불러오기 (기존 로직) ---------- */
const normalizePlaces = (places = []) =>
  places.map((p) => ({
    ...p,
    details: {
      type: p.normalizedCategory ?? "ETC",
      gallery: p.firstImage2 ? [p.firstImage2] : [],
      desc: p.desc ?? `${p.title} 방문 추천`,
      address: p.address,
      area: p.area ?? "Seoul",
    },
  }));

const renderPlan = async () => {
  const res = await plannerApi.getActivePlan(authStore.userId);
  const raw = res?.data?.data || {};

  console.log("📥 [PlanList] 서버에서 불러온 계획 데이터:", raw);
  plan.value = raw.plan || null;

  days.value = (raw.days || []).map((d) => ({
    day: d.day,
    places: normalizePlaces(d.places),
  }));
};

/* ---------- onMounted ---------- */
onMounted(async () => {
  authStore.initializeAuth();

  if (chatStore.livePlanFromChat) {
    console.log(
      "🟢 [PlanList] onMounted 시점에 이미 스토어에 AI 플랜 있음 → applyAiPlan"
    );
    applyAiPlan(chatStore.livePlanFromChat.data);
    return;
  }

  console.log(
    "🔵 [PlanList] onMounted: 스토어에 AI 플랜 없음 → 서버에서 플랜 불러옴"
  );
  await renderPlan();
});

const next = () => router.push("/planner/hotel");
const endplan = () => router.push("/planner");
</script>


<style scoped>
/* highlight */
:deep(.highlight) {
  background: #fff0b3;
  padding: 2px 6px;
  border-radius: 6px;
  font-weight: 700;
}

/* day wrapper */
.day-section-wrapper {
  padding: 26px 22px;
  background: #fafafa;
  border-radius: 14px;
  margin: 28px 18px 36px;
}

/* tabs */
.inner-day-tab-wrapper {
  display: flex;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

.btn-day-tab {
  font-size: 0.85rem;
  padding: 4px 12px;
  border-radius: 14px;
  border: 2px solid #ff9800;
  color: #ff9800;
}

.btn-day-tab.active {
  background: #ff9800;
  color: white;
  font-weight: 700;
}

/* number + label */
.place-number-wrapper {
  display: flex;
  align-items: center;
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
.color-purple {
  background: #ede9ff;
  color: #7a49ff;
}

.color-red {
  background: #ffe5e5;
  color: #ff6b6b;
}

.color-blue {
  background: #e5f0ff;
  color: #4fa3ff;
}

.color-green {
  background: #e5ffeb;
  color: #3ac569;
}

.color-gray {
  background: #efefef;
  color: #666;
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
  top: 5px;
  /* label 있을 때 자연스러운 offset */
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

/* add button */
.add-place-btn {
  width: 100%;
  padding: 10px;
  background: #f7f7f7;
  border: 1px dashed #bbb;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
  text-align: center;
}

.add-place-btn:hover {
  background: #eee;
}

.invisible {
  visibility: hidden;
}
</style>
