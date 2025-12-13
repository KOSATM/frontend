<template>
  <section class="planner-right card shadow-sm rounded-4 h-100 d-flex flex-column">

    <!-- Header -->
    <div class="p-4 pb-3 border-bottom d-flex align-items-center">
      <div class="d-flex gap-3 align-items-center flex-grow-1">
        <div
          class="rounded-3 bg-secondary-subtle d-flex align-items-center justify-content-center"
          style="width: 46px; height: 46px"
        >
          📅
        </div>

        <div>
          <h5 class="mb-1 title" v-html="highlightedTitle"></h5>
          <p class="text-muted small mb-0 sub">
            {{ plan?.startDate }} - {{ plan?.endDate }} • Seoul, Korea
          </p>
        </div>
      </div>
    </div>

    <!-- Edit Button -->
    <div v-if="currentDayPlaces.length > 0" class="d-flex justify-content-end px-4 pt-3">
      <button class="btn btn-outline-secondary edit-btn-large" @click="toggleEditMode">
        {{ editMode ? '편집 완료' : '편집' }}
      </button>
    </div>

    <NowActivity
      v-if="travelStore.$state.isTraveling && currentDayPlaces.length > 0"
      :place="nowPlace"
      :index="nowIndex"
      :total="currentDayPlaces.length"
      :dayIndex="selectedDayIndex"
      @update:index="nowIndex = $event"
    />

    <!-- 🔥 Body Component -->
    <PlanDayTimeline
      :currentDayPlaces="currentDayPlaces"
      :editMode="editMode"
      :typeColor="typeColor"
      :typeLabel="typeLabel"
      :formatTime="formatTime"
      :categoryMap="categoryMap"
      @open-modal="openModal"
      @delete-place="onDeletePlace"
    />

    <!-- CTA -->
    <div class="p-4 pt-0 border-top bg-white">
      <NavigationButtons
        :backText="'이전'"
        :nextText="travelStore.$state.isTraveling ? '여행 종료' : '여행 일정 요약페이지로 이동'"
        :isNextDisabled="false"
        @back="onBack"
        @next="onNext"
      />
    </div>

    <!-- Modals -->
    <ActivityDetailsModal :open="modalOpen" :data="modalData" @close="modalOpen = false" />
    <ReplaceModal
      :open="replaceModalOpen"
      :target="replaceTarget"
      :alternatives="replaceAlternatives"
      @close="replaceModalOpen = false"
      @apply-replacement="applyReplacement"
      @delete-anyway="deleteAnyway"
    />
  </section>
</template>


<script setup>
import ReplaceModal from '@/components/planner/ReplaceModal.vue';
// ReplaceModal 상태
const replaceModalOpen = ref(false);
const replaceTarget = ref(null);
const replaceAlternatives = ref([]);

/* ---------- NOW CARD 상태 ---------- */
const nowIndex = ref(0);

const nowPlace = computed(() => {
    if (!travelStore.$state.isTraveling) return null;
    return currentDayPlaces.value[nowIndex.value] ?? null;
});

// 삭제 버튼 클릭 시
const onDeletePlace = (idx, place) => {
    // 대체 후보는 예시로 현재 day의 다른 장소들 중 본인 제외
    const alternatives = currentDayPlaces.value.filter((p, i) => i !== idx);
    replaceTarget.value = place;
    replaceAlternatives.value = alternatives;
    replaceModalOpen.value = true;
};

// 대체 적용
const applyReplacement = (alt) => {
    // 선택된 대체 장소로 교체 (간단 예시: idx 위치에 alt로 대체)
    const idx = currentDayPlaces.value.findIndex(p => p === replaceTarget.value);
    if (idx !== -1) {
        days.value[selectedDayIndex.value].places.splice(idx, 1, alt);
    }
    replaceModalOpen.value = false;
};

// 그냥 삭제
const deleteAnyway = () => {
    const idx = currentDayPlaces.value.findIndex(p => p === replaceTarget.value);
    if (idx !== -1) {
        days.value[selectedDayIndex.value].places.splice(idx, 1);
    }
    replaceModalOpen.value = false;
};
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

import BaseButton from "@/components/common/button/BaseButton.vue";
import NavigationButtons from "@/components/common/button/NavigationButtons.vue";
import plannerApi from "@/api/plannerApi";

import { useAuthStore } from "@/store/authStore";
import { useTravelStore } from "@/store/travelStore";
import ActivityDetailsModal from "@/components/planner/ActivityDetailsModal.vue";
import { useChatStore } from "@/store/chatStore";
import NowActivity from '@/components/planner/NowActivity.vue';
import PlanDayTimeline from '@/components/planner/PlanDayTimeline.vue';

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

const formatTime = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};


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
watch(selectedDayIndex, () => {
    nowIndex.value = 0;
});

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


const onNext = () => {
    if (travelStore.$state.isTraveling) {
        endplan();
    } else {
        goToSummary();
    }
};
const onBack = () => {
    router.back();
};

const next = () => router.push("/planner/hotel");
const goToSummary = () => router.push("/planner/summary");
const endplan = () => router.push("/planner");
</script>


<style scoped>
/* Edit 버튼 */
.edit-btn-large {
  padding: 0.5rem 1.5rem;
  font-size: 1.08rem;
  height: 44px;
  border-radius: 0.8rem;
}

/* 제목 highlight */
:deep(.highlight) {
  background: #fff0b3;
  padding: 2px 6px;
  border-radius: 6px;
  font-weight: 700;
}
</style>
