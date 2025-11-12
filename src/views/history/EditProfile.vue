<template>
  <div class="history-page">
    <!-- 헤더 -->
    <!-- <PageHeader 
      title="History" 
      subtitle="Your past travel adventures"
      icon="bi-clock-history" 
    /> -->

    <!-- 메인 컨텐츠 -->
    <div class="profile-container container-fms">
      <!-- 🔙 상단 헤더 -->
      <div class="profile-header d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center">
          <i class="bi bi-arrow-left-short back-icon" @click="goBack"></i>
          <div>
            <h6 class="profile-title mb-0">Edit Profile</h6>
            <small class="profile-subtitle text-muted">Update your personal information</small>
          </div>
        </div>
      </div>

      <!-- 프로필 이미지 섹션 -->
      <div class="upload-section mb-4">
        <h6 class="upload-title mb-1">
          <i class="bi bi-image me-1 text-primary"></i> Profile Photo
        </h6>
        <p class="upload-subtitle">Upload your profile picture</p>
        
        <div class="profile-image-upload text-center">
          <div class="current-avatar mb-3">
            <img 
              v-if="profileData.profileImage" 
              :src="profileData.profileImage" 
              :alt="profileData.name"
              class="avatar-img"
            />
            <div v-else class="avatar-placeholder">
              <i class="bi bi-person-circle"></i>
            </div>
          </div>
          
          <div class="upload-actions">
            <button @click="triggerImageInput" class="btn btn-outline-primary btn-sm me-2">
              <i class="bi bi-camera me-1"></i>
              Change Photo
            </button>
            <button 
              v-if="profileData.profileImage" 
              @click="removeProfileImage"
              class="btn btn-outline-danger btn-sm"
            >
              <i class="bi bi-trash me-1"></i>
              Remove
            </button>
          </div>
          <input 
            ref="profileImageInput"
            type="file" 
            accept="image/*" 
            @change="handleImageUpload"
            hidden
          />
        </div>
      </div>

      <!-- 기본 정보 섹션 -->
      <div class="upload-section mb-4">
        <h6 class="upload-title mb-1">
          <i class="bi bi-person me-1 text-primary"></i>
          Basic Information
        </h6>
        <p class="upload-subtitle">Your personal details</p>
        
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Full Name</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="profileData.name"
              placeholder="Enter your full name"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">Nickname</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="profileData.nickname"
              placeholder="Enter your nickname"
            />
          </div>
          <div class="col-12">
            <label class="form-label">Email</label>
            <input 
              type="email" 
              class="form-control" 
              v-model="profileData.email"
              :disabled="true"
              placeholder="Email from Google OAuth"
            />
            <small class="text-muted">Email cannot be changed as it's linked to your Google account</small>
          </div>
          <div class="col-12">
            <label class="form-label">Bio</label>
            <textarea 
              class="form-control" 
              rows="3"
              v-model="profileData.bio"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 여행 선호도 섹션 -->
      <div class="upload-section mb-4">
        <h6 class="upload-title mb-1">
          <i class="bi bi-airplane me-1 text-primary"></i>
          Travel Preferences
        </h6>
        <p class="upload-subtitle">Your travel style and interests</p>
        
        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <label class="form-label">Preferred Currency</label>
            <select class="form-select" v-model="profileData.preferredCurrency">
              <option value="USD">USD ($)</option>
              <option value="KRW">KRW (₩)</option>
              <option value="EUR">EUR (€)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Travel Style</label>
            <select class="form-select" v-model="profileData.travelStyle">
              <option value="budget">Budget Traveler</option>
              <option value="comfort">Comfort Seeker</option>
              <option value="luxury">Luxury Traveler</option>
              <option value="adventure">Adventure Enthusiast</option>
            </select>
          </div>
        </div>

        <div class="interests-selection">
          <label class="form-label mb-3">Travel Interests</label>
          <div class="preview-grid">
            <div 
              v-for="interest in availableInterests" 
              :key="interest.id"
              class="interest-tag"
              :class="{ 'active': profileData.interests.includes(interest.id) }"
              @click="toggleInterest(interest.id)"
            >
              <i :class="interest.icon + ' me-2'"></i>
              <span>{{ interest.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 결제 정보 섹션 -->
      <div class="upload-section mb-4" v-if="profileData.paymentCards.length || showAddCardModal">
        <h6 class="upload-title mb-1">
          <i class="bi bi-credit-card me-1 text-primary"></i>
          Payment Information
        </h6>
        <p class="upload-subtitle">Manage your payment methods</p>
        
        <div class="card-list">
          <div 
            v-for="(card, index) in profileData.paymentCards" 
            :key="index"
            class="payment-card mb-2"
          >
            <div class="card-info d-flex justify-content-between align-items-center">
              <div class="card-details d-flex align-items-center">
                <i class="bi bi-credit-card-2-front me-3 text-primary"></i>
                <div>
                  <div class="card-number">**** **** **** {{ card.lastFour }}</div>
                  <div class="card-type text-muted">{{ card.type }} • Expires {{ card.expiry }}</div>
                </div>
              </div>
              <div class="card-actions">
                <span v-if="card.isDefault" class="badge bg-primary me-2">Default</span>
                <button 
                  @click="removePaymentCard(index)"
                  class="btn btn-outline-danger btn-sm"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
          
          <button @click="showAddCardModal = true" class="btn btn-outline-primary w-100">
            <i class="bi bi-plus me-2"></i>
            Add New Card
          </button>
        </div>
      </div>

      <!-- 알림 설정 섹션 -->
      <div class="upload-section mb-4">
        <h6 class="upload-title mb-1">
          <i class="bi bi-bell me-1 text-primary"></i>
          Notification Settings
        </h6>
        <p class="upload-subtitle">Choose what you want to be notified about</p>
        
        <div class="notification-options">
          <div class="form-check form-switch mb-3">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="emailNotifications"
              v-model="profileData.notifications.email"
            />
            <label class="form-check-label" for="emailNotifications">
              Email Notifications
            </label>
          </div>
          <div class="form-check form-switch mb-3">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="tripReminders"
              v-model="profileData.notifications.tripReminders"
            />
            <label class="form-check-label" for="tripReminders">
              Trip Reminders
            </label>
          </div>
          <div class="form-check form-switch mb-3">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="promotions"
              v-model="profileData.notifications.promotions"
            />
            <label class="form-check-label" for="promotions">
              Promotions & Offers
            </label>
          </div>
        </div>
      </div>

      <!-- 🟦 하단 버튼 -->
      <div class="next-step-area mt-4">
        <div class="d-flex gap-3">
          <button class="btn-secondary flex-fill" @click="goBack">
            <i class="bi bi-arrow-left me-2"></i>
            Cancel
          </button>
          <button 
            class="btn-next flex-fill"
            @click="saveProfile"
            :disabled="isLoading || !profileData.name || !profileData.nickname"
          >
            <i class="bi bi-check-lg me-2" v-if="!isLoading"></i>
            <i class="bi bi-arrow-clockwise spin me-2" v-else></i>
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 카드 추가 모달 -->
    <div v-if="showAddCardModal" class="modal-overlay" @click="showAddCardModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h6 class="mb-0">Add Payment Card</h6>
          <button @click="showAddCardModal = false" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Card Number</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="newCard.number"
              @input="onCardNumberInput"
              placeholder="1234 5678 9012 3456"
              maxlength="19"
            />
          </div>
          <div class="row g-3 mb-3">
            <div class="col-6">
              <label class="form-label">Expiry Date</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="newCard.expiry"
                @input="onExpiryInput"
                placeholder="MM/YY"
                maxlength="5"
              />
            </div>
            <div class="col-6">
              <label class="form-label">CVV</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="newCard.cvv"
                placeholder="123"
                maxlength="4"
              />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Cardholder Name</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="newCard.name"
              placeholder="John Doe"
            />
          </div>
          <div class="form-check">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="setAsDefault"
              v-model="newCard.isDefault"
            />
            <label class="form-check-label" for="setAsDefault">
              Set as default payment method
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showAddCardModal = false" class="btn-secondary">Cancel</button>
          <button @click="addPaymentCard" class="btn-next">Add Card</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const isLoading = ref(false)
const showAddCardModal = ref(false)
const profileImageInput = ref(null)

const triggerImageInput = () => {
  profileImageInput.value?.click()
}

// 임시 사용자 데이터 (Google OAuth 연동은 추후 구현)
const profileData = reactive({
  name: 'Jessica Han',
  nickname: 'JessicaH',
  email: 'jessica.han@gmail.com',
  bio: 'Travel enthusiast who loves exploring new cultures and cuisines.',
  profileImage: '',
  preferredCurrency: 'USD',
  travelStyle: 'comfort',
  interests: ['culture', 'food', 'shopping'],
  paymentCards: [
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
  notifications: {
    email: true,
    tripReminders: true,
    promotions: false
  }
})

const newCard = reactive({
  number: '',
  expiry: '',
  cvv: '',
  name: '',
  isDefault: false
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

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      profileData.profileImage = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeProfileImage = () => {
  profileData.profileImage = ''
}

const toggleInterest = (interestId) => {
  const index = profileData.interests.indexOf(interestId)
  if (index > -1) {
    profileData.interests.splice(index, 1)
  } else {
    profileData.interests.push(interestId)
  }
}

const addPaymentCard = () => {
  if (newCard.number && newCard.expiry && newCard.cvv && newCard.name) {
    // 간단한 카드 번호 유효성 검사
    const cleanNumber = newCard.number.replace(/\s/g, '')
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      alert('Please enter a valid card number')
      return
    }

    const cardType = cleanNumber.startsWith('4') ? 'Visa' : 
                    cleanNumber.startsWith('5') ? 'Mastercard' : 'Other'
    const lastFour = cleanNumber.slice(-4)
    
    if (newCard.isDefault) {
      profileData.paymentCards.forEach(card => card.isDefault = false)
    }
    
    profileData.paymentCards.push({
      type: cardType,
      lastFour: lastFour,
      expiry: newCard.expiry,
      isDefault: newCard.isDefault
    })
    
    // 폼 초기화
    Object.assign(newCard, {
      number: '',
      expiry: '',
      cvv: '',
      name: '',
      isDefault: false
    })
    
    showAddCardModal.value = false
  } else {
    alert('Please fill in all card details')
  }
}

const removePaymentCard = (index) => {
  if (confirm('Are you sure you want to remove this payment card?')) {
    profileData.paymentCards.splice(index, 1)
  }
}

const saveProfile = async () => {
  isLoading.value = true
  
  try {
    // 필수 필드 검증
    if (!profileData.name || !profileData.nickname) {
      throw new Error('Name and nickname are required')
    }

    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 로컬 스토리지에 저장 (임시)
    localStorage.setItem('userProfile', JSON.stringify(profileData))
    
    // 성공 메시지 표시 후 이전 페이지로 이동
    alert('Profile updated successfully!')
    goBack()
  } catch (error) {
    console.error('Error saving profile:', error)
    alert(error.message || 'Failed to save profile. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.go(-1) // 이전 페이지로 이동
}

// 카드 번호 포맷팅
const formatCardNumber = (value) => {
  const cleaned = value.replace(/\s/g, '')
  const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim()
  return formatted
}

// 만료일 포맷팅
const formatExpiry = (value) => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
  }
  return cleaned
}

// 이벤트 핸들러
const onCardNumberInput = (event) => {
  const formatted = formatCardNumber(event.target.value)
  newCard.number = formatted
}

const onExpiryInput = (event) => {
  const formatted = formatExpiry(event.target.value)
  newCard.expiry = formatted
}

// 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
onMounted(() => {
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
/* 공용 스타일 활용 및 EditProfile 전용 스타일 */

/* container-fms 공용 스타일 확장 */
.profile-container.container-fms {
  margin: 0 auto;
  max-width: none; /* 전체 너비 활용 */
}

/* 헤더 */
.profile-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 0.75rem;
}

.back-icon {
  font-size: 1.6rem;
  cursor: pointer;
  color: #ff8c00;
  margin-right: 0.5rem;
  transition: transform 0.2s;
}

.back-icon:hover {
  transform: translateX(-2px);
}

.profile-title {
  font-weight: 700;
  color: #1b3b6f;
}

.profile-subtitle {
  font-size: 0.9rem;
}

/* 업로드 영역 (섹션) */
.upload-section {
  background-color: #f9fafc;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #eee;
  margin-bottom: 1.5rem;
}

.upload-title {
  font-weight: 700;
  color: #1b3b6f;
  margin-bottom: 0.5rem;
}

.upload-subtitle {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

/* 프로필 이미지 업로드 */
.profile-image-upload {
  .current-avatar {
    .avatar-img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #e9ecef;
    }

    .avatar-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background-color: #f8f9fa;
      border: 3px dashed #dee2e6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      
      .bi-person-circle {
        font-size: 3rem;
        color: #6c757d;
      }
    }
  }

  .upload-actions {
    .btn-outline-danger {
      color: #e74c3c;
      border: 2px solid #e74c3c;
      background-color: transparent;
      
      &:hover {
        background-color: #e74c3c;
        color: #fff;
        transform: scale(1.05);
      }
    }
  }
}

/* 폼 요소들 */
.form-label {
  color: #1b3b6f;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.form-control, .form-select {
  border: 1px solid #d0d5dd;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ff8c00;
    box-shadow: 0 0 0 0.2rem rgba(255, 140, 0, 0.25);
    background-color: #fef8f2;
  }

  &:disabled {
    background-color: #f9fafc;
    opacity: 0.8;
  }

  &::placeholder {
    color: #6c757d;
    opacity: 0.7;
  }
}

/* 관심사 태그 - 미리보기 그리드 스타일 사용 */
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
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  min-width: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03); /* 공용 카드 그림자 효과 */

  &:hover {
    border-color: #ff8c00;
    background-color: #fef8f2;
    transform: translateY(-2px); /* 공용 카드 호버 효과 */
    box-shadow: 0 4px 12px rgba(255, 140, 0, 0.15);
  }

  &.active {
    border-color: #ff8c00;
    background: linear-gradient(90deg, #ff8c00 0%, #ffa733 100%); /* 공용 버튼 그라데이션 */
    color: white;
  }

  i {
    font-size: 1rem;
  }
}

/* 결제 카드 - 공용 카드 스타일 활용 */
.payment-card {
  padding: 1rem;
  border: 1px solid rgba(27, 59, 111, 0.08); /* 공용 카드 테두리 */
  border-radius: 1rem; /* 공용 카드 반지름 */
  background: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 공용 카드 그림자 */

  &:hover {
    border-color: #ff8c00;
    background-color: #fef8f2;
    transform: translateY(-3px); /* 공용 카드 호버 효과 */
    box-shadow: 0 4px 12px rgba(255, 140, 0, 0.15);
  }

  .card-number {
    font-weight: 600;
    color: #1b3b6f; /* 공용 secondary 색상 */
  }

  .card-type {
    font-size: 0.9rem;
  }
}

/* 알림 설정 */
.notification-options {
  .form-check {
    padding-left: 2.5rem;

    .form-check-input {
      margin-left: -2.5rem;
      
      &:checked {
        background-color: #ff8c00;
        border-color: #ff8c00;
      }
    }

    .form-check-label {
      color: #1b3b6f;
      font-weight: 500;
    }
  }
}

/* 버튼들 */
.btn-next {
  background-color: #1b3b6f;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 1rem;
  padding: 0.9rem 2rem;
  transition: all 0.3s ease;

  &:disabled {
    background-color: #b0bfd8;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #ff8c00;
    transform: translateY(-1px);
  }
}

.btn-secondary {
  background-color: #f9fafc;
  color: #6c757d;
  font-weight: 600;
  border: 1px solid #d0d5dd;
  border-radius: 1rem;
  padding: 0.9rem 2rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #fff;
    border-color: #ff8c00;
    color: #ff8c00;
  }
}

.next-step-area {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 1.5rem;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background: #fff;
  border-radius: 1.25rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;

  .modal-header {
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h6 {
      font-weight: 700;
      color: #1b3b6f;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6c757d;
      line-height: 1;

      &:hover {
        color: #ff8c00;
      }
    }
  }

  .modal-body {
    padding: 1rem 1.5rem;
  }

  .modal-footer {
    padding: 1rem 1.5rem 1.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    gap: 0.75rem;
  }
}

/* 애니메이션 */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 반응형 */
@media (max-width: 768px) {
  .history-page {
    padding: 1rem;
  }
  
  .profile-container {
    padding: 1.5rem;
  }
  
  .profile-image-upload {
    .avatar-img, .avatar-placeholder {
      width: 100px;
      height: 100px;
    }
  }
  
  .upload-title {
    font-size: 1rem;
  }
  
  .preview-grid {
    gap: 0.5rem;
  }
  
  .interest-tag {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .next-step-area .d-flex {
    flex-direction: column;
    gap: 0.75rem !important;
  }
  
  .btn-next, .btn-secondary {
    padding: 0.8rem 1.5rem;
  }
}
</style>