<template>
  <div class="mypage-page">
    <PageHeader title="MyPage" subtitle="나의 여행 정보" icon="bi-person" />

    <div class="text-center mb-5">
      <div class="position-relative d-inline-block">
        <img v-if="profileImage" :src="profileImage" alt="Profile"
          class="rounded-circle shadow-sm border border-4 border-white"
          style="width: 140px; height: 140px; object-fit: cover;" />
        <div v-else
          class="rounded-circle shadow-sm border border-4 border-white bg-light d-flex align-items-center justify-content-center"
          style="width: 140px; height: 140px;">
          <i class="bi bi-person text-secondary" style="font-size: 4rem;"></i>
        </div>

        <button @click="goToEditProfile"
          class="btn btn-sm btn-light position-absolute bottom-0 end-0 rounded-circle shadow-sm border"
          style="width: 40px; height: 40px;">
          <i class="bi bi-pencil-fill text-primary"></i>
        </button>
      </div>

      <div class="mt-3">
        <h2 class="mb-1">{{ profileData.name }}</h2>
        <p class="text-muted fs-5 m-0">{{ profileData.email }}</p>
      </div>
    </div>

    <BaseSection icon="bi-person-vcard" title="Basic Info" subtitle="기본 정보">
      <div class="row g-4">
        <div class="col-6">
          <h4 class="text-secondary mb-1">Korean Name</h4>
          <p class="fs-5 border-bottom pb-2">{{ profileData.koreanName || '-' }}</p>
        </div>
        <div class="col-6">
          <h4 class="text-secondary mb-1">Nationality</h4>
          <p class="fs-5 border-bottom pb-2">{{ profileData.nationality || '-' }}</p>
        </div>
      </div>
    </BaseSection>

    <BaseSection icon="bi-airplane" title="Travel Style" subtitle="나의 여행 스타일">
      <div class="mb-4">
        <h4 class="text-secondary mb-1">Currency</h4>
        <p class="fs-5">{{ getCurrencyLabel(profileData.preferredCurrency) }}</p>
      </div>

      <h4 class="text-secondary mb-3">Interests</h4>
      <div class="d-flex flex-wrap gap-2">
        <div v-for="interest in availableInterests" :key="interest.id" class="interest-chip"
          :class="{ 'active': profileData.interests.includes(interest.id) }">
          <i :class="interest.icon"></i>
          <span class="ms-2">{{ interest.name }}</span>
        </div>
      </div>
    </BaseSection>

    <!-- ✅ 호텔 예약 섹션 -->
    <BaseSection icon="bi-building-check" title="Reservations" subtitle="호텔 예약 내역">
      <!-- 로딩 중 -->
      <div v-if="isLoadingReservation" class="text-center py-3">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted small mt-2">예약 정보를 불러오는 중...</p>
      </div>

      <!-- 호텔 예약 정보 표시 -->
      <div v-else-if="hotelReservation" class="custom-card p-3">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h4 class="m-0 text-primary">{{ hotelReservation.hotelName }}</h4>
            <p class="text-muted m-0 fs-6">{{ hotelReservation.roomType }}</p>
          </div>
          <span class="badge rounded-pill fw-normal bg-success">
            <i class="bi bi-check-circle me-1"></i>
            Confirmed
          </span>
        </div>

        <div class="d-flex gap-4 mt-3 text-secondary fs-6">
          <div>
            <i class="bi bi-calendar-check me-1"></i>
            체크인: {{ formatDate(hotelReservation.checkinDate) }}
          </div>
          <div>
            <i class="bi bi-calendar-x me-1"></i>
            체크아웃: {{ formatDate(hotelReservation.checkoutDate) }}
          </div>
        </div>

        <div class="mt-3 text-secondary fs-6">
          <i class="bi bi-info-circle me-1"></i>
          예약 ID: {{ hotelReservation.id }}
        </div>
      </div>

      <!-- 예약 없음 -->
      <p v-else class="text-muted text-center py-3">
        예약된 숙박이 없습니다.
      </p>
    </BaseSection>

    <BaseSection icon="bi-wallet2" title="Payment" subtitle="결제 정보">
      <h4 class="text-secondary mb-3">Payment Methods</h4>
      <div v-if="profileData.paymentMethods.length > 0" class="d-flex flex-column gap-2 mb-4">
        <div v-for="(card, index) in profileData.paymentMethods" :key="index"
          class="custom-card p-3 d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-3">
            <i class="bi bi-credit-card-2-front fs-2 text-primary"></i>
            <div>
              <h5 class="m-0">{{ card.type }} <span class="fs-6 text-muted">**** {{ card.lastFour }}</span></h5>
              <p class="m-0 text-muted fs-6">Expires {{ card.expiry }}</p>
            </div>
          </div>
          <span v-if="card.isDefault" class="badge bg-primary rounded-pill fw-normal">Default</span>
        </div>
      </div>
      <p v-else class="text-muted mb-4">등록된 카드가 없습니다.</p>
    </BaseSection>

    <BaseSection icon="bi-heart-pulse" title="Health" subtitle="건강 정보">
      <h4 class="text-secondary mb-2">Medicine info</h4>
      <div class="p-3 bg-light rounded-3">
        <div class="mb-2">
          <span class="fw-bold me-2" style="color: #ff8c00;">Allergies:</span>
          <span>{{ profileData.medicalInfo.allergies || 'None' }}</span>
        </div>
        <div>
          <span class="fw-bold me-2" style="color: #ff8c00;">Dietary:</span>
          <span>{{ profileData.medicalInfo.dietaryRestrictions || 'None' }}</span>
        </div>
      </div>
    </BaseSection>

    <div class="d-flex gap-3 mt-5">
      <NavigationButtons
        back-text="Back"
        next-text="Edit Profile"
        :is-next-disabled="isLoadingReservation"
        @back="goBack"
        @next="goToEditProfile"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import BaseSection from '@/components/common/BaseSection.vue'
import PageHeader from "@/components/common/header/PageHeader.vue"
import NavigationButtons from '@/components/common/button/NavigationButtons.vue'
import hotelApi from '@/api/hotelApi'

const router = useRouter()
const authStore = useAuthStore()

// ✅ 호텔 예약 정보
const hotelReservation = ref(null)
const isLoadingReservation = ref(false)

const profileData = reactive({
  name: 'John Doe',
  koreanName: '도우존',
  email: 'john.doe@gmail.com',
  nationality: 'United States',
  preferredCurrency: 'USD',
  interests: ['culture', 'food', 'adventure'],
  reservations: [],
  paymentMethods: [
    { type: 'Visa', lastFour: '4567', expiry: '12/25', isDefault: true },
    { type: 'Mastercard', lastFour: '8901', expiry: '08/26', isDefault: false }
  ],
  medicalInfo: { allergies: 'Shellfish, Peanuts', dietaryRestrictions: 'Vegetarian, Gluten-free' },
  instagramConnected: true
})

const availableInterests = [
  { id: 'culture', name: 'Culture', icon: 'bi bi-building' },
  { id: 'food', name: 'Food', icon: 'bi bi-fork-knife' },
  { id: 'shopping', name: 'Shopping', icon: 'bi bi-bag' },
  { id: 'nature', name: 'Nature', icon: 'bi bi-tree' },
  { id: 'nightlife', name: 'Nightlife', icon: 'bi bi-moon-stars' },
  { id: 'art', name: 'Art & Museums', icon: 'bi bi-palette' },
  { id: 'adventure', name: 'Adventure', icon: 'bi bi-mountain' },
  { id: 'relaxation', name: 'Relaxation', icon: 'bi bi-flower1' }
]

// ✅ 통화 라벨
const getCurrencyLabel = (code) => {
  const currencies = { 'USD': 'USD ($)', 'KRW': 'KRW (₩)', 'EUR': 'EUR (€)', 'JPY': 'JPY (¥)' }
  return currencies[code] || code
}

// ✅ 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// ✅ 호텔 예약 정보 조회
const loadHotelReservation = async () => {
  isLoadingReservation.value = true
  try {
    const userId = authStore.userId
    console.log('📥 호텔 예약 조회 - userId:', userId)

    const response = await hotelApi.getHotelByUserId(userId)
    console.log('✅ 호텔 예약 응답:', response.data)

    // ✅ 중첩된 응답 구조 처리
    if (response.data.success && response.data.data && response.data.data.data) {
      hotelReservation.value = response.data.data.data
      console.log('✅ 호텔 정보 로드 성공:', hotelReservation.value)
    } else {
      hotelReservation.value = null
      console.log('⚠️ 예약된 호텔이 없습니다.')
    }
  } catch (error) {
    console.error('❌ 호텔 정보 조회 실패:', error)
    hotelReservation.value = null
  } finally {
    isLoadingReservation.value = false
  }
}

// ✅ 내비게이션
const goBack = () => router.back()
const goToEditProfile = () => router.push('/mypage/edit')

// ✅ 프로필 이미지
const profileImage = computed(() => {
  return authStore.userProfileImage || new URL('@/assets/img/profile-logo.png', import.meta.url).href
})

// ✅ 마운트
onMounted(() => {
  authStore.initializeAuth()
  if (authStore.user) {
    profileData.name = authStore.user.name || 'User'
    profileData.email = authStore.user.email || ''
  }
  // ✅ 호텔 예약 정보 로드
  loadHotelReservation()
})
</script>

<style scoped>
.mypage-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem;
}

/* 취향 태그 (Chips) */
.interest-chip {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  border: 1px solid #dee2e6;
  color: #6c757d;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  cursor: pointer;
}

/* 선택된 취향 태그 */
.interest-chip.active {
  background-color: #ff8c00;
  border-color: #ff8c00;
  color: white;
  font-weight: normal;
}

/* 카드 스타일 */
.custom-card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease;
}

.custom-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

h4 {
  font-size: 1.1rem;
}

.badge {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.bg-success {
  background-color: #28a745 !important;
}
</style>