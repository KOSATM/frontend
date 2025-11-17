<template>
        <!-- 메인 컨텐츠 -->
        <div class="profile-container container-fms">
            <!-- 🔙 상단 헤더 -->
            <BackButtonPageHeader title="Edit Profile" subtitle="Update your personal information"></BackButtonPageHeader>

            <!-- 프로필 이미지 섹션 -->
            <BaseSection icon="bi-image" title="Profile Photo" subtitle="Upload your profile picture">
                <div class="profile-image-upload text-center">
                    <div class="current-avatar mb-3">
                        <img v-if="profileData.profileImage" :src="profileData.profileImage" :alt="profileData.name"
                            class="avatar-img" />
                        <div v-else class="avatar-placeholder">
                            <i class="bi bi-person-circle"></i>
                        </div>
                    </div>

                    <div class="upload-actions">
                        <BaseButton variant="outline-primary" size="sm" class="me-2" @click="triggerImageInput">
                            <i class="bi bi-camera me-1"></i>
                            Change Photo
                        </BaseButton>
                        <BaseButton v-if="profileData.profileImage" variant="outline-danger" size="sm"
                            @click="removeProfileImage">
                            <i class="bi bi-trash me-1"></i>
                            Remove
                        </BaseButton>
                    </div>
                    <input ref="profileImageInput" type="file" accept="image/*" @change="handleImageUpload" hidden />
                </div>
            </BaseSection>
            
            <!-- 기본 정보 섹션 -->
            <BaseSection icon="bi-person" title="Basic Information" subtitle="Your account information">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-control" v-model="profileData.name"
                            placeholder="Enter your name" />
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Korean Name</label>
                        <input type="text" class="form-control" v-model="profileData.koreanName"
                            placeholder="한글 이름" />
                    </div>
                    <div class="col-12">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" v-model="profileData.email" :disabled="true"
                            placeholder="Email from Google OAuth" />
                        <small class="text-muted">Email cannot be changed as it's linked to your Google account</small>
                    </div>
                </div>
            </BaseSection>

            <!-- 여행 선호도 섹션 -->
            <BaseSection icon="bi-airplane" title="Travel Preferences" subtitle="Your travel information">
                <div class="row g-3 mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Nationality</label>
                        <input type="text" class="form-control" v-model="profileData.nationality"
                            placeholder="Your country" />
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Preferred Currency</label>
                        <select class="form-select" v-model="profileData.preferredCurrency">
                            <option value="USD">USD ($)</option>
                            <option value="KRW">KRW (₩)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="JPY">JPY (¥)</option>
                        </select>
                    </div>
                </div>

                <div class="interests-selection">
                    <label class="form-label mb-3">Travel Interests</label>
                    <div class="preview-grid">
                        <div v-for="interest in availableInterests" :key="interest.id" class="interest-tag"
                            :class="{ 'active': profileData.interests.includes(interest.id) }"
                            @click="toggleInterest(interest.id)">
                            <i :class="interest.icon + ' me-2'"></i>
                            <span>{{ interest.name }}</span>
                        </div>
                    </div>
                </div>
            </BaseSection>

            <!-- 의료 정보 섹션 -->
            <BaseSection icon="bi-heart-pulse" title="Medical Information" subtitle="Important health information">
                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label">Allergies</label>
                        <textarea class="form-control" rows="2" v-model="profileData.medicalInfo.allergies"
                            placeholder="e.g., Shellfish, Peanuts..."></textarea>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Dietary Restrictions</label>
                        <textarea class="form-control" rows="2" v-model="profileData.medicalInfo.dietaryRestrictions"
                            placeholder="e.g., Vegetarian, Gluten-free..."></textarea>
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
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" v-model="profileData.instagramConnected" />
                        </div>
                    </div>
                </div>
            </BaseSection>

            <!-- 🟦 하단 버튼 -->
            <div class="next-step-area mt-4">
                <div class="d-flex gap-3">
                    <BaseButton variant="secondary" class="flex-fill" @click="goBack">
                        <i class="bi bi-arrow-left me-2"></i>
                        Cancel
                    </BaseButton>
                    <BaseButton variant="primary" class="flex-fill" @click="saveProfile"
                        :disabled="isLoading || !profileData.name || !profileData.nickname">
                        <i class="bi bi-check-lg me-2" v-if="!isLoading"></i>
                        <i class="bi bi-arrow-clockwise spin me-2" v-else></i>
                        {{ isLoading ? 'Saving...' : 'Save Changes' }}
                    </BaseButton>
                </div>
            </div>
        </div>

        <!-- 카드 추가 모달 -->
        <div v-if="showAddCardModal" class="modal-overlay" @click="showAddCardModal = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h6 class="mb-0">Add Payment Card</h6>
                    <BaseButton variant="ghost" @click="showAddCardModal = false" class="btn-close">
                        ×
                    </BaseButton>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Card Number</label>
                        <input type="text" class="form-control" v-model="newCard.number" @input="onCardNumberInput"
                            placeholder="1234 5678 9012 3456" maxlength="19" />
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-6">
                            <label class="form-label">Expiry Date</label>
                            <input type="text" class="form-control" v-model="newCard.expiry" @input="onExpiryInput"
                                placeholder="MM/YY" maxlength="5" />
                        </div>
                        <div class="col-6">
                            <label class="form-label">CVV</label>
                            <input type="text" class="form-control" v-model="newCard.cvv" placeholder="123"
                                maxlength="4" />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Cardholder Name</label>
                        <input type="text" class="form-control" v-model="newCard.name" placeholder="John Doe" />
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="setAsDefault" v-model="newCard.isDefault" />
                        <label class="form-check-label" for="setAsDefault">
                            Set as default payment method
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <BaseButton variant="secondary" @click="showAddCardModal = false">
                        Cancel
                    </BaseButton>
                    <BaseButton variant="primary" @click="addPaymentCard">
                        Add Card
                    </BaseButton>
                </div>
            </div>
        </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseSection from '@/components/common/BaseSection.vue'
import BackButtonPageHeader from '@/components/common/BackButtonPageHeader.vue'

const router = useRouter()
const isLoading = ref(false)
const profileImageInput = ref(null)

const triggerImageInput = () => {
    profileImageInput.value?.click()
}

// 임시 사용자 데이터 (Google OAuth 연동은 추후 구현)
const profileData = reactive({
    name: 'John Doe',
    koreanName: '도우존',
    email: 'john.doe@gmail.com',
    profileImage: '',
    nationality: 'United States',
    preferredCurrency: 'USD',
    interests: ['culture', 'food', 'adventure'],
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
    // ... 기존 코드 ...
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
/* BaseButton 스타일 커스텀 */
.btn-primary {
    background-color: #1b3b6f !important;
    color: #fff !important;
    font-weight: 600 !important;
    border: none !important;
    border-radius: 1rem !important;
    padding: 0.9rem 2rem !important;
    transition: all 0.3s ease !important;

    &:disabled {
        background-color: #b0bfd8 !important;
        cursor: not-allowed !important;
    }

    &:hover:not(:disabled) {
        background-color: #ff8c00 !important;
        transform: translateY(-1px) !important;
    }
}

.btn-secondary {
    background-color: #f9fafc !important;
    color: #6c757d !important;
    font-weight: 600 !important;
    border: 1px solid #d0d5dd !important;
    border-radius: 1rem !important;
    padding: 0.9rem 2rem !important;
    transition: all 0.3s ease !important;

    &:hover {
        background-color: #fff !important;
        border-color: #ff8c00 !important;
        color: #ff8c00 !important;
    }
}

.btn-outline-primary {
    border: 2px solid #ff8c00 !important;
    color: #ff8c00 !important;
    background-color: transparent !important;
    font-weight: 600 !important;
    border-radius: 1rem !important;
    padding: 0.9rem 2rem !important;
    transition: all 0.3s ease !important;

    &:hover {
        background-color: #ff8c00 !important;
        color: #ffffff !important;
        transform: translateY(-1px) !important;
    }

    &.btn-sm {
        padding: 0.5rem 1rem !important;
        font-size: 0.875rem !important;
        border-radius: 0.75rem !important;
        font-weight: 500 !important;
    }
}

.btn-outline-danger {
    border: 2px solid #dc3545 !important;
    color: #dc3545 !important;
    background-color: transparent !important;
    font-weight: 600 !important;
    border-radius: 1rem !important;
    padding: 0.9rem 2rem !important;
    transition: all 0.3s ease !important;

    &:hover {
        background-color: #dc3545 !important;
        color: #ffffff !important;
        transform: translateY(-1px) !important;
    }

    &.btn-sm {
        padding: 0.5rem 1rem !important;
        font-size: 0.875rem !important;
        border-radius: 0.75rem !important;
        font-weight: 500 !important;
    }
}

.btn-ghost {
    background: transparent !important;
    border: none !important;
    color: #6c757d !important;
    font-weight: 500 !important;
    border-radius: 0.75rem !important;
    padding: 0.5rem 1rem !important;
    transition: all 0.3s ease !important;

    &:hover {
        color: #ff8c00 !important;
        background-color: rgba(255, 140, 0, 0.1) !important;
    }
}

/* 기존 스타일들... */
.profile-container {
    background-color: #fff;
    border-radius: 1.25rem;
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
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
}

/* 폼 요소들 */
.form-label {
    color: #1b3b6f;
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
}

.form-control,
.form-select {
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

    &:hover {
        border-color: #ff8c00;
        background-color: #fef8f2;
    }

    &.active {
        border-color: #ff8c00;
        background-color: #ff8c00;
        color: white;
    }

    i {
        font-size: 1rem;
    }
}

/* 결제 카드 */
.payment-card {
    padding: 1rem;
    border: 1px solid #d0d5dd;
    border-radius: 0.75rem;
    background: #fff;
    transition: all 0.3s ease;

    &:hover {
        border-color: #ff8c00;
        background-color: #fef8f2;
    }

    .card-number {
        font-weight: 600;
        color: #1b3b6f;
    }

    .card-type {
        font-size: 0.9rem;
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
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 반응형 */
@media (max-width: 768px) {
    .profile-container {
        padding: 1.5rem;
    }

    .profile-image-upload {

        .avatar-img,
        .avatar-placeholder {
            width: 100px;
            height: 100px;
        }
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
}
</style>