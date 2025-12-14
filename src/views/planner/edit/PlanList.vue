<!-- src/views/planner/PlanList.vue -->
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
    <div
      v-if="currentDayPlaces.length > 0"
      class="d-flex justify-content-end px-4 pt-3"
    >
      <button class="btn btn-outline-secondary edit-btn-large" @click="toggleEditMode">
        {{ editMode ? "편집 완료" : "편집" }}
      </button>
    </div>

    <NowActivity
      v-if="travelStore.$state.isTraveling && currentDayPlaces.length > 0"
      :place="nowPlace"
      :index="nowIndex"
      :total="currentDayPlaces.length"
      :dayIndex="selectedDayIndex"
      @update:index="nowIndex = $event"
      @complete="openActivityComplete"
    />

    <!-- 🔥 Body Component -->
    <PlanDayTimeline
      :days="days"
      :currentDayPlaces="currentDayPlaces"
      :selectedDayIndex="selectedDayIndex"
      :editMode="editMode"
      :typeColor="typeColor"
      :typeLabel="typeLabel"
      :formatTime="formatTime"
      :categoryMap="categoryMap"
      @open-modal="openModal"
      @delete-place="onDeletePlace"
      @update:selectedDayIndex="selectedDayIndex = $event"
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
    <ActivityDetailsModal
      :open="modalOpen"
      :data="modalData"
      @close="modalOpen = false"
    />
    <ReplaceModal
      :open="replaceModalOpen"
      :target="replaceTarget"
      :alternatives="replaceAlternatives"
      @close="replaceModalOpen = false"
      @apply-replacement="applyReplacement"
      @delete-anyway="deleteAnyway"
    />

    <!-- ✅ Activity Complete Modal (추가된 연결) -->
    <ActivityCompleteModal
      :open="activityModalOpen"
      :title="activePlace?.title || ''"
      :spendInput="spendInput"
      :comment="comment"
      :quickStats="activityQuickStats"
      @close="activityModalOpen = false"
      @confirm="completeActivity"
      @update:spend-input="spendInput = $event"
      @update:comment="comment = $event"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

import NavigationButtons from "@/components/common/button/NavigationButtons.vue";
import plannerApi from "@/api/plannerApi";

import { useAuthStore } from "@/store/authStore";
import { useTravelStore } from "@/store/travelStore";
import { useChatStore } from "@/store/chatStore";

import ActivityDetailsModal from "@/components/planner/ActivityDetailsModal.vue";
import ReplaceModal from "@/components/planner/ReplaceModal.vue";
import NowActivity from "@/components/planner/NowActivity.vue";
import PlanDayTimeline from "@/components/planner/PlanDayTimeline.vue";
import ActivityCompleteModal from "@/components/planner/ActivityCompleteModal.vue";

/* ---------- 기본 상태들 ---------- */
const modalOpen = ref(false);
const modalData = ref(null);

const plan = ref(null);
const days = ref([]);
const selectedDayIndex = ref(0);
const editMode = ref(false);

const router = useRouter();
const authStore = useAuthStore();
const travelStore = useTravelStore();
const chatStore = useChatStore();

/* ---------- ReplaceModal 상태 ---------- */
const replaceModalOpen = ref(false);
const replaceTarget = ref(null);
const replaceAlternatives = ref([]);

/* ---------- ACTIVITY COMPLETE MODAL 상태 ---------- */
const activityModalOpen = ref(false);
const activePlace = ref(null);
const spendInput = ref(null);
const comment = ref("");

/* ---------- NOW CARD 상태 ---------- */
const nowIndex = ref(0);

const currentDayPlaces = computed(() => days.value?.[selectedDayIndex.value]?.places ?? []);

const nowPlace = computed(() => {
  if (!travelStore.$state.isTraveling) return null;
  return currentDayPlaces.value[nowIndex.value] ?? null;
});

/* ---------- category 기본 이미지 ---------- */
const categoryDefaultImageMap = {
  FOOD: new URL("@/assets/img/planner-recommendation/restaurant.png", import.meta.url).href,
  SPOT: new URL("@/assets/img/planner-recommendation/photospot.png", import.meta.url).href,
  SHOPPING: new URL("@/assets/img/planner-recommendation/attraction.png", import.meta.url).href,
  CAFE: new URL("@/assets/img/planner-recommendation/accommodation.png", import.meta.url).href,
  HOTEL: new URL("@/assets/img/hotel-image/0001.jpg", import.meta.url).href,
  EVENT: new URL("@/assets/img/planner-recommendation/experience.png", import.meta.url).href,
  ETC: new URL("@/assets/img/planner-recommendation/festival.png", import.meta.url).href,
};

const getDefaultGalleryByType = (type = "ETC") => {
  return [categoryDefaultImageMap[type] ?? categoryDefaultImageMap.ETC];
};

/* ---------- util ---------- */
const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/* ✅ Duration 계산 (모달 QuickStats용) */
const getDurationText = (start, end) => {
  if (!start || !end) return "-";
  const diffMin = Math.round((new Date(end) - new Date(start)) / 60000);
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

/* 날짜 계산 함수 */
const getTripDuration = computed(() => {
  if (!plan.value?.startDate || !plan.value?.endDate) {
    return { nights: 3, days: 4, text: "3박 4일" };
  }

  const start = new Date(plan.value.startDate);
  const end = new Date(plan.value.endDate);
  
  // 날짜 차이 계산 (일 단위)
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const days = diffDays + 1; // 당일 포함
  const nights = diffDays;   // 밤 수는 일수 - 1
  
  return {
    nights,
    days,
    text: `${nights}박 ${days}일`
  };
});

/* ✅ 모달에 넣을 QuickStats (장소마다 다르게) */
const activityQuickStats = computed(() => {
  if (!activePlace.value) return {};

  const started = activePlace.value.startAt ? formatTime(activePlace.value.startAt) : "-";
  const duration = getDurationText(activePlace.value.startAt, activePlace.value.endAt);
  const status = activePlace.value.status === "DONE" ? "Completed" : "Pending";

  return { started, duration, status };
});

/* ---------- 모달 열기 로직 ---------- */
const openActivityComplete = (place) => {
  activePlace.value = place;
  spendInput.value = null;
  comment.value = "";
  activityModalOpen.value = true;
};

/* ✅ 활동 완료 (confirm) */
const completeActivity = async () => {
  if (!activePlace.value) return;
  
  // 금액과 메모가 둘 다 입력되어야 저장 가능
  const hasAmount = spendInput.value !== null;
  const hasMemo = comment.value && comment.value.trim() !== '';
  
  if (!hasAmount || !hasMemo) {
    alert('금액과 메모를 모두 입력해야 저장할 수 있습니다.');
    return;
  }
  
  try {
    // 현재 시간을 endedAt으로 설정
    const endedAt = new Date().toISOString();
    
    console.log('🔍 activePlace 전체:', activePlace.value);
    console.log('🔍 activePlace.id:', activePlace.value.id);
    
    // API 요청 데이터 구성 (백엔드 DTO에 맞춤: camelCase)
    const activityData = {
      planPlaceId: activePlace.value.id || activePlace.value.placeId,
      actualCost: spendInput.value,
      memo: comment.value,
      endedAt: endedAt
    };
    
    console.log('🔄 활동 완료 저장 중...', activityData);
    
    // API 호출
    const response = await plannerApi.saveCurrentActivity(activityData);
    
    console.log('✅ 활동 완료 저장 성공:', response);
    
    // UI 상태 업데이트
    activePlace.value.status = "DONE";
    activePlace.value.actualCost = spendInput.value;
    activePlace.value.memo = comment.value;
    
    // 모달 닫기
    activityModalOpen.value = false;
    
    // 초기화
    spendInput.value = null;
    comment.value = "";
    
  } catch (error) {
    console.error('❌ 활동 완료 저장 실패:', error);
    console.error('❌ 에러 응답:', error.response?.data);
    console.error('❌ 전송한 데이터:', {
      planPlaceId: activePlace.value.id || activePlace.value.placeId,
      actualCost: spendInput.value,
      memo: comment.value,
      endedAt: new Date().toISOString()
    });
    alert('활동 완료 처리에 실패했습니다.\n다시 시도해주세요.');
  }
};

/* ---------- AI 일정 → 화면에 적용하는 함수 ---------- */
const applyAiPlan = (payload) => {
  console.log("✅ [PlanList] applyAiPlan 호출됨", payload);

  if (!payload) {
    console.log("⚠️ [PlanList] payload가 없음");
    return;
  }

  if (!payload.days || !Array.isArray(payload.days)) {
    console.log("⚠️ [PlanList] payload.days가 없거나 배열이 아님");
    return;
  }

  plan.value = {
    id: payload.planId,
    startDate: payload.startDate,
    endDate: payload.endDate,
    title: payload.title ?? "AI 추천 여행 일정",
  };

  days.value = (payload.days || []).map((d) => ({
    day: {
      id: d.dayIndex,
      dayIndex: d.dayIndex,
      planDate: d.date,
      title: `Day ${d.dayIndex}`,
    },
    places: (d.schedules || []).map((s) => {
      const type = s.normalizedCategory ?? "ETC";

      const gallery =
        s.firstImage2
          ? [s.firstImage2]
          : s.firstImage
            ? [s.firstImage]
            : getDefaultGalleryByType(type);

      return {
        title: s.title,
        startAt: s.startAt,
        endAt: s.endAt,
        placeName: s.placeName,
        address: s.address,
        // ✅ status 기본값 (없으면 Pending으로)
        status: s.status ?? "PENDING",
        details: {
          type,
          gallery,
          desc: `${s.title} 방문을 추천합니다`,
          address: s.address,
          area: "Seoul",
          firstImage: s.firstImage,
          firstImage2: s.firstImage2,
        },
      };
    }),
  }));

  travelStore.setPlanInfo(payload.planId, travelStore.dayIndex, travelStore.planDate);
  selectedDayIndex.value = 0;
  console.log("[PlanList] days 갱신:", days.value);
};

/* ---------- watch ---------- */
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

/* ---------- 모달 ---------- */
const openModal = (place) => {
  if (editMode.value) return;

  const type = place?.details?.type ?? "ETC";

  const gallery =
    place?.details?.firstImage
      ? [place.details.firstImage]
      : (place?.details?.gallery?.length ? place.details.gallery : getDefaultGalleryByType(type));

  modalData.value = {
    title: place.title,
    address: place.details?.address,
    area: place.details?.area ?? "Seoul",
    gallery,
    desc: place.details?.desc,
  };

  modalOpen.value = true;
};

/* ---------- ReplaceModal: 삭제 버튼 클릭 시 ---------- */
const onDeletePlace = async (idx, place) => {
  console.log('🔍 삭제하려는 장소:', place);
  
  // 위치 정보 추출 (여러 경로 시도)
  let lat = place.lat || 
            place.latitude || 
            place.details?.lat ||
            place.details?.latitude ||
            place.mapY;
  
  let lng = place.lng || 
            place.longitude || 
            place.details?.lng ||
            place.details?.longitude ||
            place.mapX;
  
  // 숫자로 변환 (문자열일 수 있으므로)
  lat = parseFloat(lat);
  lng = parseFloat(lng);
  
  console.log('📍 추출된 위치 (변환 후):', { lat, lng, type: `${typeof lat}, ${typeof lng}` });
  
  let alternatives = [];
  
  // API 호출해서 근처 카페 가져오기
  if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
    try {
      console.log('🔄 API 호출 시작:', {
        url: '/search-rest-place',
        params: { lat, lng }
      });
      
      const response = await plannerApi.getRestPlaces(lat, lng);
      
      console.log('✅ API 응답 전체:', response);
      console.log('✅ API 응답 데이터:', response.data);
      
      // 응답 데이터를 alternatives 형식으로 변환
      const cafes = response.data.data || response.data || [];
      
      console.log('📦 변환할 카페 목록:', cafes);
      
      if (Array.isArray(cafes) && cafes.length > 0) {
        // ⭐ 상위 3개만 선택
        const topThreeCafes = cafes.slice(0, 3);
        console.log(`🎯 상위 3개 선택 (전체 ${cafes.length}개 중):`, topThreeCafes);
        
        alternatives = topThreeCafes.map(cafe => {
          console.log('🔄 카페 변환 중:', cafe);
          return {
            title: cafe.title || cafe.name || cafe.placeName || '카페',
            image: cafe.firstImage2 || cafe.firstImage || cafe.image,
            thumbnail: cafe.firstImage2 || cafe.firstImage || cafe.thumbnail,
            desc: cafe.overview || cafe.desc || `${cafe.title || '카페'}을(를) 추천합니다`,
            shortDesc: cafe.category || '카페',
            address: cafe.address || cafe.addr1,
            mapX: cafe.mapX || cafe.lng || cafe.longitude,
            mapY: cafe.mapY || cafe.lat || cafe.latitude,
            startAt: place.startAt,  // 기존 장소의 시간 유지
            endAt: place.endAt,
            status: "PENDING",
            details: {
              type: 'CAFE',
              gallery: cafe.firstImage2 ? [cafe.firstImage2] : cafe.firstImage ? [cafe.firstImage] : [],
              desc: cafe.overview || cafe.desc || `${cafe.title || '카페'}을(를) 추천합니다`,
              address: cafe.address || cafe.addr1,
              area: 'Seoul'
            }
          };
        });
        
        console.log('✅ 변환된 alternatives (상위 3개):', alternatives);
      } else {
        console.warn('⚠️ API 응답이 비어있거나 배열이 아닙니다');
        alternatives = currentDayPlaces.value.filter((p, i) => i !== idx).slice(0, 3);
      }
    } catch (error) {
      console.error('❌ API 호출 실패:', error);
      console.error('❌ 에러 응답:', error.response?.data);
      console.error('❌ 에러 상태:', error.response?.status);
      
      // API 실패 시 기존 로직 사용 (같은 날의 다른 장소들 중 3개)
      alternatives = currentDayPlaces.value.filter((p, i) => i !== idx).slice(0, 3);
      console.warn('⚠️ API 실패로 기존 장소 목록 사용:', alternatives.length, '개');
    }
  } else {
    console.warn('⚠️ 위치 정보가 유효하지 않아 기존 장소로 대체합니다:', { lat, lng });
    // 위치 정보가 없으면 기존 로직 사용 (3개만)
    alternatives = currentDayPlaces.value.filter((p, i) => i !== idx).slice(0, 3);
  }
  
  replaceTarget.value = place;
  replaceAlternatives.value = alternatives;
  replaceModalOpen.value = true;
};

const applyReplacement = (alt) => {
  const idx = currentDayPlaces.value.findIndex((p) => p === replaceTarget.value);
  if (idx !== -1) {
    days.value[selectedDayIndex.value].places.splice(idx, 1, alt);
  }
  replaceModalOpen.value = false;
};

const deleteAnyway = () => {
  const idx = currentDayPlaces.value.findIndex((p) => p === replaceTarget.value);
  if (idx !== -1) {
    days.value[selectedDayIndex.value].places.splice(idx, 1);
  }
  replaceModalOpen.value = false;
};

/* ---------- 기타 ---------- */
const toggleEditMode = () => (editMode.value = !editMode.value);

const highlightedTitle = computed(() => {
  const duration = getTripDuration.value.text;
  return plan.value?.title ?? `서울, ${duration} <span class="highlight">추천일정</span>입니다`;
});

const categoryMap = {
  FOOD: "음식점",
  SPOT: "관광지",
  SHOPPING: "쇼핑",
  CAFE: "카페",
  HOTEL: "숙소",
  EVENT: "이벤트",
  ETC: "공원",
};

const typeColor = (type) => {
  switch (type) {
    case "FOOD":
      return "color-red";
    case "SHOPPING":
      return "color-blue";
    case "CAFE":
      return "color-green";
    case "HOTEL":
      return "color-gray";
    case "SPOT":
      return "color-purple";
    case "EVENT":
      return "color-purple";
    case "ETC":
      return "color-purple";
    default:
      return "color-purple";
  }
};

const typeLabel = (type) => {
  switch (type) {
    case "FOOD":
      return "식사 장소 추천";
    case "SHOPPING":
      return "쇼핑 추천";
    case "CAFE":
      return "카페 추천";
    case "HOTEL":
      return "숙소 이동";
    case "SPOT":
      return "관광지 추천";
    case "EVENT":
      return "이벤트 방문";
    case "ETC":
      return "공원 산책";
    default:
      return null;
  }
};

/* ---------- 서버 플랜 불러오기 ---------- */
const normalizePlaces = (places = []) =>
  places.map((p) => {
    const type = p.normalizedCategory ?? "ETC";

    const gallery =
      p.firstImage2
        ? [p.firstImage2]
        : p.firstImage
          ? [p.firstImage]
          : getDefaultGalleryByType(type);

    return {
      ...p,
      // ✅ status가 없을 수 있어서 기본값 보강
      status: p.status ?? "PENDING",
      details: {
        type,
        gallery,
        desc: p.desc ?? `${p.title} 방문 추천`,
        address: p.address,
        area: p.area ?? "Seoul",
      },
    };
  });

const renderPlan = async () => {
  const res = await plannerApi.getActivePlan(authStore.userId);
  const raw = res?.data?.data || {};

  console.log("📥 [PlanList] 서버에서 불러온 계획 데이터:", raw);

  plan.value = raw.plan || null;

  days.value = (raw.days || []).map((d) => ({
    day: d.day,
    places: normalizePlaces(d.places),
  }));

  if (raw?.plan?.id) {
    travelStore.setPlanInfo(raw.plan.id, travelStore.dayIndex, travelStore.planDate);
  }
};

/* ---------- onMounted ---------- */
onMounted(async () => {
  authStore.initializeAuth();

  if (chatStore.livePlanFromChat) {
    console.log("🟢 [PlanList] onMounted 시점에 이미 스토어에 AI 플랜 있음 → applyAiPlan");
    applyAiPlan(chatStore.livePlanFromChat.data);
    return;
  }

  console.log("🔵 [PlanList] onMounted: 스토어에 AI 플랜 없음 → 서버에서 플랜 불러옴");
  await renderPlan();
});

/* ---------- navigation ---------- */
const onNext = () => {
  if (travelStore.$state.isTraveling) endplan();
  else goToSummary();
};

const onBack = () => router.back();

const goToSummary = () => router.push("/planner/summary");
const endplan = () => {
  // 여행 종료 시 메인 페이지로 이동
  travelStore.$state.isTraveling = false // 여행 상태 초기화
  router.push("/")
}
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
