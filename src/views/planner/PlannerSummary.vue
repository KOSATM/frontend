<template>
    <div class="planner-page">
    <PageHeader title="플래너" subtitle="당신의 서울 여행 일정을 만들고 관리해보세요." icon="bi-map" />
    <div class="plan-summary container py-5">

        <!-- 상단 인사 영역 -->
        <div class="text-center mb-4">
            <div class="hero-icon mx-auto mb-3 d-inline-flex align-items-center justify-content-center">
                🗺️
            </div>
            <h2 class="fw-bold mb-1">여행 일정이 준비되었어요</h2>
            <p class="text-muted mb-0">다음 단계로 이동하기 전에 여행 일정을 한눈에 확인해보세요</p>
        </div>

        <div class="row justify-content-center">
            <div class="col-lg-10">

                <!-- 여행 요약 카드 -->
                <div class="card mb-4 shadow-sm border-0">
                    <div class="card-header bg-primary text-white border-0 rounded-top">
                        <h5 class="mb-0 d-flex align-items-center gap-2">
                            <span>🧳 여행 개요</span>
                            <small class="badge bg-light text-primary-emphasis ms-auto">
                                {{ duration }}일
                            </small>
                        </h5>
                    </div>

                    <div class="card-body">

                        <!-- 제목 & 날짜 -->
                        <div class="d-flex flex-wrap align-items-center justify-content-between mb-3">
                            <div>
                                <h5 class="mb-1">{{ planTitle }}</h5>
                                <p class="text-muted small mb-0">{{ dateRangeText }} • 서울</p>
                            </div>

                            <div class="summary-metrics d-flex gap-3 mt-3 mt-sm-0">
                                <div class="metric-pill">
                                    <span class="label">일정 </span>
                                    <span class="value">{{ days.length }}</span>
                                </div>
                                <div class="metric-pill">
                                    <span class="label">장소 </span>
                                    <span class="value">{{ totalPlaces }}</span>
                                </div>
                                <div class="metric-pill" v-if="totalBudget">
                                    <span class="label">예산</span>
                                    <span class="value">{{ formattedBudget }}</span>
                                </div>
                            </div>
                        </div>
                        <hr />

                        <!-- 날짜별 요약 -->
                        <div class="day-list">
                            <div v-for="(day, idx) in days" :key="day.day || idx" class="day-row">
                                <div class="day-badge">Day {{ idx + 1 }}</div>

                                <div class="flex-grow-1">
                                    <div class="day-tagline text-muted small mb-1">
                                        {{ dayTagline(day, idx) }}
                                    </div>

                                    <div class="day-places">
                                        <span v-for="(place, pIdx) in (day.places || []).slice(0, 3)" :key="pIdx"
                                            class="badge rounded-pill place-badge">
                                            {{ place.title }}
                                        </span>

                                        <span v-if="(day.places || []).length > 3"
                                            class="badge rounded-pill more-badge">
                                            +{{ (day.places || []).length - 3 }} 개
                                        </span>

                                        <span v-if="!(day.places && day.places.length)"
                                            class="text-muted small fst-italic">
                                            추가된 일정이 없어요
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ★ 위치 교체: Next Step이 아래, Before You Go가 위가 아니라,
             너가 요청한 대로 '컴포넌트 자체 위치'를 서로 바꾸어 배치함 -->

                <!-- NEXT STEP & BEFORE YOU GO (좌우 교체됨) -->
                <div class="row g-4 mb-4 align-items-stretch">

                    <!-- BEFORE YOU GO -->
                    <div class="col-lg-5 d-flex">
                        <div class="card shadow-sm border-0 flex-fill d-flex flex-column card-step">

                            <div>
                                <h4 class="card-step-title">일정을 수정하고 싶나요?</h4>
                                <p class="card-step-text">
                                    일정 순서나 장소를 수정하고 싶다면, 
                                    아래 버튼을 눌러주세요.
                                </p>
                            </div>

                            <div class="card-step-footer">
                                <button type="button" class="btn btn-outline-secondary px-4" @click="goBackToEdit">
                                    일정 다시 수정하기
                                </button>
                            </div>

                        </div>
                    </div>

                    <!-- NEXT STEP -->
                    <div class="col-lg-7 d-flex">
                        <div class="card shadow-sm border-0 flex-fill d-flex flex-column card-step">

                            <div>
                                <h4 class="card-step-title">다음 단계: 숙소 선택</h4>
                                <p class="card-step-text">
                                    AI가 여행 동선과 일정 밀도를 분석해서<br />
                                    가장 효율적인 숙소 후보를 추천해드릴게요.
                                </p>
                            </div>

                            <div class="card-step-footer">
                                <button type="button" class="btn btn-primary btn-lg px-5 fw-semibold"
                                    @click="goToHotel">
                                    숙소 선택하러 가기 →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 안내 문구 -->
            <p class="text-muted small mt-3 d-flex align-items-center">
                <i class="bi bi-info-circle me-2"></i>
                이 요약 화면은 Travelgram에서도 나중에 다시 확인할 수 있어요.
            </p>

        </div>
    </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import plannerApi from '@/api/plannerApi'
import { useAuthStore } from '@/store/authStore'
import PageHeader from "@/components/common/header/PageHeader.vue";

const router = useRouter()
const authStore = useAuthStore()

const plan = ref(null)
const days = ref([])

// 초기 데이터 로딩
const loadPlan = async () => {
    await authStore.initializeAuth?.()
    const res = await plannerApi.getActivePlan(authStore.userId)
    const raw = res?.data?.data || {}
    plan.value = raw.plan || null
    days.value = raw.days || []
}

onMounted(() => {
    loadPlan()
})

// computed
const planTitle = computed(
    () =>
        plan.value?.title ||
        'Your Seoul itinerary'
)

const duration = computed(() => {
    if (plan.value?.durationDays) return plan.value.durationDays
    if (plan.value?.startDate && plan.value?.endDate) {
        const s = new Date(plan.value.startDate)
        const e = new Date(plan.value.endDate)
        if (!isNaN(s) && !isNaN(e)) {
            const diff = (e - s) / (1000 * 60 * 60 * 24) + 1
            return diff > 0 ? diff : days.value.length || 0
        }
    }
    return days.value.length || 0
})

const dateRangeText = computed(() => {
    if (plan.value?.startDate && plan.value?.endDate) {
        return `${plan.value.startDate} ~ ${plan.value.endDate}`
    }
    return 'Dates not set'
})

const totalPlaces = computed(() =>
    (days.value || []).reduce(
        (sum, d) => sum + ((d.places && d.places.length) || 0),
        0
    )
)

// 예: plan에 budget / currency가 있다면 사용, 없으면 null
const totalBudget = computed(() => plan.value?.budget || null)
const currency = computed(() => plan.value?.currency || 'KRW')

const formattedBudget = computed(() => {
    if (!totalBudget.value) return ''
    if (currency.value === 'KRW') {
        return `₩${Math.round(totalBudget.value).toLocaleString()}`
    }
    return `${currency.value} ${Number(totalBudget.value).toLocaleString()}`
})

const dayTagline = (day, idx) => {
    const count = (day.places && day.places.length) || 0
    if (count === 0) return `No fixed plan yet for Day ${idx + 1}`
    if (count === 1) return `1 main spot planned`
    if (count <= 3) return `${count} spots planned`
    return `${count} spots planned · packed day`
}

// navigation
const goToHotel = () => {
    router.push('/planner/hotel')
}

const goBackToEdit = () => {
    router.push('/planner/edit')
}
</script>

<style scoped lang="scss">
.planner-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding-bottom: 6rem;
  padding: 2rem 1.25rem 6rem; /* 👈 상단 padding 2rem으로 통일 */
}
.plan-summary {
    max-width: 980px;
    margin: 0 auto;

    .hero-icon {
        width: 72px;
        height: 72px;
        border-radius: 24px;
        background: radial-gradient(circle at 20% 20%, #ffe8c7, #ffb35a);
        font-size: 2rem;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    }

    .card-header.bg-primary {
        background: linear-gradient(90deg, var(--bs-primary, #1b3b6f), var(--bs-accent, #ff8c00));
        border-top-left-radius: .75rem;
        border-top-right-radius: .75rem;
        color: white;
    }

    .btn-primary {
        background-color: var(--bs-primary, #1b3b6f);
        border-color: var(--bs-primary, #1b3b6f);
        color: white;
    }

    .btn-primary:hover {
        opacity: .96;
    }

    .btn-outline-secondary {
        border-radius: .6rem;
    }

    .summary-metrics .metric-pill {
        background: #f6f7fb;
        border-radius: 999px;
        padding: 6px 14px;

        .label {
            font-size: .7rem;
            color: #8b90a0;
        }

        .value {
            font-size: .95rem;
            font-weight: 600;
        }
    }

    .day-row {
        display: flex;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px dashed #e3e5ef;
    }

    /* Day Badge 텍스트 완전 중앙 정렬 */
    .day-badge {
        padding: 6px 10px;
        border-radius: 999px;
        background: #f1f4ff;
        color: #3c4aa1;
        font-weight: 600;
        font-size: .8rem;

        /* 추가 */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .place-badge {
        background: #fff1db;
        color: #b16200;
    }

    .more-badge {
        background: #eef1ff;
        color: #3f48c0;
    }

    /* 두 카드(NEXT STEP, BEFORE YOU GO)의 Typography 통일 */
    .card-step-title {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: .75rem;
    }

    .card-step-text {
        font-size: .9rem;
        line-height: 1.45;
        color: #6c757d;
        margin-bottom: 1rem;
    }

    /* 카드 전체 간격을 통일 */
    .card-step {
        padding: 28px;
        border-radius: 12px;
    }

    /* 버튼을 카드 하단 동일 위치에 */
    .card-step-footer {
        margin-top: auto;
        padding-top: 14px;
        display: flex;
        justify-content: center;
    }
}
</style>
