<template>
  <div class="travelgram-page">
    <PageHeader title="Travelgram" subtitle="Your past travel adventures" icon="bi-instagram" />
    <ProfileSummary :name="displayName" bio="Travel Enthusiast" initials="userInitials" :totalplans="stats.totalPlans" :travelDays="stats.travelDays"
      :completed="stats.completed" />
    <h4 class="my-3">
      <i class="bi bi-instagram me-2 text-primary"></i> Completed Travel Plans
    </h4>


    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="plans.length === 0" class="text-center py-5 text-muted">
      <p>완료된 여행 기록이 없습니다.</p>
    </div>

    <div v-else class="plan-list">
      <planCard v-for="plan in plans" :key="plan.id" :planId="plan.id" :planTitle="plan.title || '제목 없는 여행'"
        :location="'Seoul, Korea'" :date="plan.formattedDate" :budget="plan.formattedBudget" :status="'Done'"
        @click="goToReview(plan.id, plan.title)" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {useAuthStore} from '@/store/authStore'
import api from '@/api/travelgramApi'
import { storeToRefs } from 'pinia'
import planCard from '@/components/common/PlanCard.vue';
import ProfileSummary from "@/components/travelgram/ProfileSummary.vue";
import PageHeader from '@/components/common/PageHeader.vue';

const store = useStore()
const router = useRouter()

// 상태 관리
const plans = ref([])
const loading = ref(true)
const stats = ref({ totalPlans: 0, travelDays: 0, completed: 0 })

const authStore = useAuthStore()
// 스토어에서 로그인된 유저 정보 가져오기 (vuex 구조에 따라 수정 필요
// 3. Extract using storeToRefs (maintains Reactivity and .value access)
const { userId, userName } = storeToRefs(authStore)

const displayName = computed(() => userName.value || 'Traveler')

// (선택사항) 이름에서 이니셜 추출 (예: "Jessica Han" -> "JH")
const userInitials = computed(() => {
  const name = displayName.value;
  if (!name) return 'ME';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
})
// 데이터 가져오기 함수
const fetchPlans = async () => {
  try {
    loading.value = true
    // Safety check: Ensure userId exists before making the API call
    if (!userId.value) {
      console.warn("User ID not found, attempting to load from storage...");
      authStore.initializeAuth(); // Ensure auth is loaded
      if(!userId.value) return; // Stop if still no user
    }

    const targetId = userId.value
    console.log("Fetching plans for user:", targetId)
    
    // 백엔드 API 호출
    const response = await api.getEndedPlanByUserId(targetId)
    const allPlans = response.data

    // 1. 종료된 여행(isEnded === true)만 필터링
    const completedPlans = allPlans.filter(p => p.isEnded === true)

    // 2. 데이터 가공 (UI에 맞게 포맷팅)
    plans.value = completedPlans.map(p => ({
      ...p,
      formattedDate: `${p.startDate} ~ ${p.endDate}`,
      formattedBudget: Number(p.budget).toLocaleString() + ' KRW'
    }))

    // 3. 통계 업데이트 (선택 사항)
    stats.value = {
      totalPlans: allPlans.length,
      completed: completedPlans.length,
      travelDays: calculateTotalDays(completedPlans)
    }

  } catch (error) {
    console.error("여행 계획을 불러오는데 실패했습니다:", error)
  } finally {
    loading.value = false
  }
}

// 여행 일수 합계 계산 도우미 함수
const calculateTotalDays = (plansList) => {
  return plansList.reduce((acc, cur) => {
    const start = new Date(cur.startDate)
    const end = new Date(cur.endDate)
    const diff = (end - start) / (1000 * 60 * 60 * 24) + 1
    return acc + diff
  }, 0)
}

// ✅ 페이지 이동 함수
// PlanCard에서 emit된 id와 title을 인자로 받습니다.
const goToReview = (id, title) => {
  console.log(`Navigating to review creation for Plan ID: ${id}, Title: ${title}`);
  
  router.push({
    name: 'CreateTravelReview', // router.js에 정의된 라우트 이름 확인 필요 (PhotoUploadPage로 연결된 라우트)
    params: { planId: id },
    query: { title: title },
  })
}

onMounted(() => {
  fetchPlans()
})

// store에서 프로필 이미지 가져오기 (없으면 asset의 기본값)
const profileImage = computed(() => {
  const stored = store?.getters?.getProfileImage
  if (stored) return stored
  return new URL('../../assets/img/profile-logo.png', import.meta.url).href
})
</script>

<style scoped>
.travelgram-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem;
}

.travelgram-header {
  margin-bottom: 1.5rem;
  text-align: left;
}

.travelgram-header h4 {
  color: #1B3B6F;
  font-weight: 600;
}

.plan-list {
  margin-bottom: 2rem;
}
</style>
