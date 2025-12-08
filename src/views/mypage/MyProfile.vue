<template>
  <!-- 메인 컨텐츠 -->
  <div class="profile-container container-fms">
    <!-- 🔙 상단 헤더 -->
    <BackButtonPageHeader title="My Profile" subtitle="Your travel profile"></BackButtonPageHeader>

    <!-- 프로필 이미지 섹션 -->
    <BaseSection icon="bi-image" title="Profile Photo" subtitle="Your profile picture">
      <div class="profile-image-upload text-center">
        <div class="current-avatar mb-3">
          <img v-if="profileImage" :src="profileImage" :alt="profileData.displayName"
            class="avatar-img" />
          <div v-else class="avatar-placeholder">
            <i class="bi bi-person-circle"></i>
          </div>
        </div>
      </div>
    </BaseSection>
    
    <!-- 기본 정보 섹션 -->
    <BaseSection icon="bi-person" title="Basic Information" subtitle="Your account information">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Name</label>
          <div class="form-value">{{ profileData.name }}</div>
        </div>
        <div class="col-md-6">
          <label class="form-label">Korean Name</label>
          <div class="form-value">{{ profileData.koreanName || 'Not specified' }}</div>
        </div>
        <div class="col-12">
          <label class="form-label">Email</label>
          <div class="form-value">{{ profileData.email }}</div>
        </div>
      </div>
    </BaseSection>

    <!-- 여행 선호도 섹션 -->
    <BaseSection icon="bi-airplane" title="Travel Preferences" subtitle="Your travel information">
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label class="form-label">Nationality</label>
          <div class="form-value">{{ profileData.nationality || 'Not specified' }}</div>
        </div>
        <div class="col-md-6">
          <label class="form-label">Preferred Currency</label>
          <div class="form-value">{{ getCurrencyLabel(profileData.preferredCurrency) }}</div>
        </div>
      </div>

      <div class="interests-selection">
        <label class="form-label mb-3">Travel Interests</label>
        <div class="preview-grid">
          <div v-for="interest in availableInterests" :key="interest.id" class="interest-tag"
            :class="{ 'active': profileData.interests.includes(interest.id) }">
            <i :class="interest.icon + ' me-2'"></i>
            <span>{{ interest.name }}</span>
          </div>
        </div>
      </div>
    </BaseSection>

    <!-- 예약한 호텔 정보 섹션 -->
    <BaseSection icon="bi-building" title="Reservation" subtitle="Your hotel reservations">
      <div class="reservation-list">
        <div v-if="profileData.reservations.length > 0">
          <div v-for="(reservation, index) in profileData.reservations" :key="index" class="reservation-card mb-3">
            <div class="reservation-header d-flex justify-content-between align-items-start">
              <div>
                <h6 class="reservation-hotel mb-1">{{ reservation.hotelName }}</h6>
                <small class="text-muted">{{ reservation.location }}</small>
              </div>
              <span class="badge bg-info">{{ reservation.status }}</span>
            </div>
            <div class="reservation-details mt-2">
              <div class="detail-row">
                <span class="detail-label">Check-in:</span>
                <span>{{ reservation.checkIn }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-out:</span>
                <span>{{ reservation.checkOut }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Nights:</span>
                <span>{{ reservation.nights }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-muted py-3">
          <i class="bi bi-building me-2"></i>
          No reservations
        </div>
      </div>
    </BaseSection>

    <!-- 결제 정보 섹션 -->
    <BaseSection icon="bi-credit-card" title="Payment Information" subtitle="Your registered payment methods">
      <div class="card-list">
        <div v-if="profileData.paymentMethods.length > 0">
          <div v-for="(card, index) in profileData.paymentMethods" :key="index" class="payment-card mb-2">
            <div class="card-info d-flex justify-content-between align-items-center">
              <div class="card-details d-flex align-items-center">
                <i class="bi bi-credit-card-2-front me-3 text-primary"></i>
                <div>
                  <div class="card-number">**** **** **** {{ card.lastFour }}</div>
                  <div class="card-type text-muted">{{ card.type }} • Expires {{ card.expiry }}</div>
                </div>
              </div>
              <div class="card-actions">
                <span v-if="card.isDefault" class="badge bg-primary">Default</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-muted py-3">
          <i class="bi bi-credit-card me-2"></i>
          No payment methods registered
        </div>
      </div>
    </BaseSection>

    <!-- 의료 정보 섹션 -->
    <BaseSection icon="bi-heart-pulse" title="Medical Information" subtitle="Important health information">
      <div class="medical-info">
        <div class="info-section mb-3">
          <label class="form-label">Allergies</label>
          <div class="form-value">{{ profileData.medicalInfo.allergies || 'None reported' }}</div>
        </div>
        <div class="info-section">
          <label class="form-label">Dietary Restrictions</label>
          <div class="form-value">{{ profileData.medicalInfo.dietaryRestrictions || 'None reported' }}</div>
        </div>
      </div>
    </BaseSection>

    <!-- SNS 연동 섹션 -->
    <BaseSection icon="bi-share" title="Social Media Integration" subtitle="Connected accounts">
      <div class="social-integration">
        <div class="social-item d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <i class="bi bi-instagram me-2 text-danger"></i>
            <span>Instagram</span>
          </div>
          <span v-if="profileData.instagramConnected" class="badge bg-success">Connected</span>
          <span v-else class="badge bg-secondary">Not Connected</span>
        </div>
      </div>
    </BaseSection>

    <!-- 🟦 하단 버튼 -->
    <div class="next-step-area mt-4">
      <div class="d-flex gap-3">
        <BaseButton variant="secondary" class="flex-fill" @click="goBack">
          <i class="bi bi-arrow-left me-2"></i>
          Back
        </BaseButton>
        <BaseButton variant="primary" class="flex-fill" @click="goToEditProfile">
          <i class="bi bi-pencil me-2"></i>
          Edit Profile
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseSection from '@/components/common/BaseSection.vue'
import BackButtonPageHeader from '@/components/common/BackButtonPageHeader.vue'

const router = useRouter()
const authStore = useAuthStore()

// Core 사용자 데이터
const profileData = reactive({
  name: 'John Doe',
  koreanName: '도우존',
  email: 'john.doe@gmail.com',
  profileImage: '',
  nationality: 'United States',
  preferredCurrency: 'USD',
  interests: ['culture', 'food', 'adventure'],
  reservations: [
    {
      hotelName: 'The Shilla Seoul',
      location: 'Jung-gu, Seoul',
      checkIn: '2024-10-15',
      checkOut: '2024-10-18',
      nights: 3,
      status: 'Confirmed'
    },
    {
      hotelName: 'Four Seasons Busan',
      location: 'Haeundae-gu, Busan',
      checkIn: '2024-11-01',
      checkOut: '2024-11-03',
      nights: 2,
      status: 'Pending'
    }
  ],
  paymentMethods: [
    {
      type: 'Visa',
      lastFour: '4567',
      expiry: '12/25',
      isDefault: true
    },
    {
      type: 'Mastercard',
      lastFour: '8901',
      expiry: '08/26',
      isDefault: false
    }
  ],
  medicalInfo: {
    allergies: 'Shellfish, Peanuts',
    dietaryRestrictions: 'Vegetarian, Gluten-free'
  },
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

const getCurrencyLabel = (code) => {
  const currencies = {
    'USD': 'USD ($)',
    'KRW': 'KRW (₩)',
    'EUR': 'EUR (€)',
    'JPY': 'JPY (¥)'
  }
  return currencies[code] || code
}

const goBack = () => {
  router.go(-1)
}

const goToEditProfile = () => {
  router.push('/mypage/edit')
}

// 프로필 이미지 computed
// store에서 프로필 이미지 가져오기 (없으면 asset의 기본값)
const profileImage = computed(() => {
  return authStore.userProfileImage || new URL('../../assets/img/profile-logo.png', import.meta.url).href
})

// 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
onMounted(() => {
  authStore.initializeAuth()
  
  if (authStore.user) {
    profileData.name = authStore.user.name || 'User'
    profileData.email = authStore.user.email || ''
  }

  try {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      Object.assign(profileData, JSON.parse(savedProfile))
    }
  } catch (error) {
    console.warn('Failed to load saved profile:', error)
  }
})
</script>

<style scoped>
.btn-primary {
  background-color: #1b3b6f !important;
  color: #fff !important;
  font-weight: 600 !important;
  border: none !important;
  border-radius: 1rem !important;
  padding: 0.9rem 2rem !important;
  transition: all 0.3s ease !important;
}

.btn-primary:hover:not(:disabled) {
  background-color: #ff8c00 !important;
  transform: translateY(-1px) !important;
}

.btn-secondary {
  background-color: #f9fafc !important;
  color: #6c757d !important;
  font-weight: 600 !important;
  border: 1px solid #d0d5dd !important;
  border-radius: 1rem !important;
  padding: 0.9rem 2rem !important;
  transition: all 0.3s ease !important;
}

.btn-secondary:hover {
  background-color: #fff !important;
  border-color: #ff8c00 !important;
  color: #ff8c00 !important;
}

.profile-container {
  background-color: #fff;
  border-radius: 1.25rem;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.profile-image-upload .current-avatar .avatar-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e9ecef;
}

.profile-image-upload .current-avatar .avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f8f9fa;
  border: 3px dashed #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.avatar-placeholder .bi-person-circle {
  font-size: 3rem;
  color: #6c757d;
}

.form-label {
  color: #1b3b6f;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.form-value {
  padding: 0.75rem 1rem;
  background-color: #f9fafc;
  border: 1px solid #d0d5dd;
  border-radius: 0.75rem;
  color: #333;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.interest-tag {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #d0d5dd;
  border-radius: 0.75rem;
  background: #fff;
  font-size: 0.9rem;
  min-width: fit-content;
  color: #6c757d;
}

.interest-tag.active {
  border-color: #ff8c00;
  background-color: #ff8c00;
  color: white;
}

.interest-tag i {
  font-size: 1rem;
}

.reservation-card {
  padding: 1rem;
  border: 1px solid #d0d5dd;
  border-radius: 0.75rem;
  background: #fff;
  transition: all 0.3s ease;
}

.reservation-hotel {
  color: #1b3b6f;
  font-weight: 600;
}

.detail-row {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #1b3b6f;
  min-width: 80px;
}

.payment-card {
  padding: 1rem;
  border: 1px solid #d0d5dd;
  border-radius: 0.75rem;
  background: #fff;
  transition: all 0.3s ease;
}

.card-number {
  font-weight: 600;
  color: #1b3b6f;
}

.card-type {
  font-size: 0.9rem;
}

.medical-info .info-section {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.medical-info .info-section:last-child {
  border-bottom: none;
}

.social-item {
  padding: 1rem;
  border: 1px solid #d0d5dd;
  border-radius: 0.75rem;
  background: #fff;
}

.next-step-area {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 1.5rem;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1.5rem;
  }

  .avatar-img,
  .avatar-placeholder {
    width: 100px !important;
    height: 100px !important;
  }

  .preview-grid {
    gap: 0.5rem;
  }

  .interest-tag {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }

  .next-step-area .d-flex {
    flex-direction: column;
    gap: 0.75rem !important;
  }
}
</style>
