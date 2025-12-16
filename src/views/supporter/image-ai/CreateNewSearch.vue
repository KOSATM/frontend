<template>
  <section class="new-search-root card rounded-0 h-100 d-flex flex-column">
    <!-- Header -->
    <div class="p-4 pb-3 border-bottom d-flex align-items-center justify-content-between">
      <div class="d-flex gap-3 align-items-center">
        <button class="btn btn-link p-0 back-button" @click="$router.back()" title="뒤로 가기">
          <i class="bi bi-arrow-left-short fs-1"></i>
        </button>
        
        <div class="rounded-3 bg-secondary-subtle d-flex align-items-center justify-content-center"
          style="width: 46px; height: 46px">
          📷
        </div>

        <div>
          <h5 class="mb-1 title">이미지 기반 여행 AI</h5>
          <p class="text-muted small mb-0 sub">
            사진을 올리면 관련된 장소를 추천해드립니다.
          </p>
        </div>
      </div>
    </div>

    <!-- Body Content -->
    <div class="new-search-body-scroll flex-grow-1 overflow-y-auto p-4">


      <!-- How it works -->
      <div class="how-works-box mb-4">
        <div class="how-works-header mb-2">
          <i class="bi bi-lightbulb text-warning me-2"></i>
          <strong>어떻게 동작하나요?</strong>
        </div>
        <ol class="small text-muted mb-0 ps-3 how-works-list">
          <li>여행 중 궁금한 점을 사진으로 올려보세요.</li>
          <li>AI가 이미지를 분석합니다.</li>
          <li>사진과 관련된 장소 추천을 받아보세요.</li>
        </ol>
      </div>

      <!-- Upload Area -->
      <section class="upload-section">
        <div v-if="!imagePreview" class="upload-box" @click="triggerFileInput" @dragover.prevent @drop.prevent="onDrop">
          <i class="bi bi-cloud-arrow-up fs-2 text-secondary mb-2"></i>
          <p class="text-secondary mb-0">클릭해서 사진을 업로드하세요.</p>
          <small class="text-muted">사진 크기는 10MB까지 가능하며, JPG, PNG만 올려주세요.</small>
        </div>

        <!-- Preview - Full Width Image -->
        <div v-else class="preview-full" @click="triggerFileInput">
          <img :src="imagePreview" alt="preview" />
          <div class="preview-overlay">
            <i class="bi bi-arrow-repeat fs-3"></i>
            <p class="mb-0 mt-2">클릭하여 다른 사진 선택</p>
          </div>
        </div>
      </section>

      <!-- Hidden Input -->
      <input 
        id="imageInput" 
        type="file" 
        accept="image/*" 
        ref="fileInput"
        class="d-none" 
        @change="onFileChange" 
      />
    </div>

    <!-- Footer / Navigation -->
    <div class="border-top bg-white p-4">
      <NavigationButtons
        back-text="취소"
        :is-next-disabled="!imagePreview"
        @back="handleCancel"
        @next="goToType"
      >
        <template #next-content>
          <i class="bi bi-arrow-right-circle me-2"></i>
          사진에서 알고 싶은 점을 구체적으로 선택해주세요.
        </template>
      </NavigationButtons>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavigationButtons from '@/components/common/button/NavigationButtons.vue';

const route = useRoute()
const router = useRouter()
const imagePreview = ref(null)
const fileInput = ref(null)

const triggerFileInput = () => fileInput.value?.click()

const handleCancel = () => {
  imagePreview.value = null; // 미리보기 초기화
  if (fileInput.value) fileInput.value.value = ''; // 파일 input 초기화
};

const onFileChange = (e) => {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = (ev) => { imagePreview.value = ev.target.result }
  reader.readAsDataURL(f)
}

const onDrop = (e) => {
  const f = e.dataTransfer.files && e.dataTransfer.files[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = (ev) => { imagePreview.value = ev.target.result }
  reader.readAsDataURL(f)
}

// go to type selection, pass preview via query parameter
const goToType = () => {
  if (!imagePreview.value) return
  router.push({
    name: 'ImageType',
    query: { preview: imagePreview.value, from: 'CreateNewSearch' }
  })
}

// StepHeader의 back 클릭 처리:
// - 여러 소스(route.state.from, route.query.from, document.referrer, history.state.back)를 확인하여
//   이전이 History인 경우 해당 라우트로 이동
// - 아니면 SupporterMain의 image-ai 섹션으로 이동 (query: { focus: 'image-ai' })
const onHeaderBack = () => {
  try {
    const fromState = route?.state?.from
    const fromQuery = route?.query?.from

    if (fromState === 'History' || fromQuery === 'History') {
      router.push({ name: 'History' }).catch(() => { })
      return
    }

    // document.referrer -> router.resolve to inspect matched route name
    if (typeof document !== 'undefined' && document.referrer) {
      try {
        const refPath = new URL(document.referrer, window.location.origin).pathname
        const resolved = router.resolve(refPath)
        if (resolved && resolved.name === 'History') {
          router.push({ name: 'History' }).catch(() => { })
          return
        }
      } catch (e) {
        // ignore
      }
    }

    // some router/history implementations store last url in history.state.back - attempt resolve
    try {
      const hstate = window.history && window.history.state
      if (hstate && hstate.back) {
        const resolvedBack = router.resolve(hstate.back)
        if (resolvedBack && resolvedBack.name === 'History') {
          router.push({ name: 'History' }).catch(() => { })
          return
        }
      }
    } catch (e) {
      // ignore
    }
  } catch (e) {
    // safe fallback below
  }

  // 기본: SupporterMain의 Image-based Travel AI 섹션으로 이동 (부모에서 탭/영역을 열도록 query 전달)
  router.push({ name: 'SupporterMain', query: { focus: 'image-ai' } }).catch(() => { })
}
</script>

<style scoped>
/* ========================================
   New Search Root - History 스타일 매칭
   ======================================== */
.new-search-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans KR", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #ffffff;
  overflow: hidden;
}

/* 헤더 영역 스타일 */
.new-search-root > div:first-child {
  background: #ffffff;
  color: #2d4a8f;
  border-bottom: 1px solid #e2e8f0 !important;
  height: 100px;
  display: flex;
  align-items: center;
  padding: 1.25rem 2rem !important;
  position: relative;
}

.new-search-root h5.title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b !important;
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
}

.new-search-root .sub {
  color: #64748b !important;
  font-size: 0.8rem;
  font-weight: 500;
}

.new-search-root .rounded-3 {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0;
  font-size: 1.25rem;
  width: 38px !important;
  height: 38px !important;
}

/* 뒤로가기 버튼 */
.back-button {
  color: #2d4a8f;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-left: -0.5rem;
}

.back-button:hover {
  color: #1a2a56;
  transform: translateX(-4px);
}

.back-button:focus {
  outline: none;
  box-shadow: none;
}

/* 본문 스크롤 */
.new-search-body-scroll {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #ffffff;
  background: #ffffff;
}

.new-search-body-scroll::-webkit-scrollbar {
  width: 6px;
}

.new-search-body-scroll::-webkit-scrollbar-track {
  background: #ffffff;
  border-radius: 3px;
}

.new-search-body-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
  transition: background 0.3s ease;
}

.new-search-body-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Section Header 스타일 */
.section-header {
  padding: 0.5rem 0;
}

.icon-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2d4a8f 0%, #1a2a56 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(45, 74, 143, 0.2);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.02em;
}

.section-subtitle {
  color: #64748b;
  font-size: 0.875rem;
}

/* How it works 박스 */
.how-works-box {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 14px;
  border: 2px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(45, 74, 143, 0.05);
}

.how-works-header {
  color: #2d4a8f;
  font-size: 1.05rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  letter-spacing: -0.01em;
}

.how-works-list {
  line-height: 1.9;
  color: #475569;
  font-size: 0.9rem;
}

.how-works-list li {
  margin-bottom: 0.6rem;
  font-weight: 500;
}

.how-works-list li:last-child {
  margin-bottom: 0;
}

.supporter-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem;
}

.ai-badge {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #3A5797;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.page-banner {
  background: transparent;
  align-items: center;
}

.btn-back {
  border: none;
  background: transparent;
  font-size: 18px;
  padding: 6px 8px;
  color: #333;
  cursor: pointer;
}

.btn-back:hover {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 6px;
}

.image-ai-card {
  background: #fff;
}

/* Upload Section - PhotoUploader 스타일 */
.upload-section {
  background-color: #f9fafc;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #eee;
}

.upload-box {
  border: 2px dashed #d0d5dd;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.upload-box:hover {
  background-color: #fef8f2;
  border-color: #2d4a8f;
}

.upload-box .bi-cloud-arrow-up {
  color: #6c757d;
  transition: color 0.3s ease;
}

.upload-box:hover .bi-cloud-arrow-up {
  color: #2d4a8f;
}

.preview-full {
  position: relative;
  width: 100%;
  min-height: 400px;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-full img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(45, 74, 143, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #fff;
}

.preview-full:hover .preview-overlay {
  opacity: 1;
}

.preview-overlay i {
  color: #fff;
}

.preview-overlay p {
  font-size: 0.95rem;
  font-weight: 600;
}

/* Footer 스타일 */
.border-top {
  border-top: 1px solid #e2e8f0 !important;
}

/* disabled button visual */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card {
  border-radius: 14px;
}

/* 텍스트 스타일 */
.text-muted {
  color: #64748b !important;
}

.small {
  font-size: 0.875rem;
}
</style>