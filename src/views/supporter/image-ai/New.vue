<template>
  <!-- top banner with back button + title/subtitle -->
  <StepHeader title="Image-based Travel AI" subtitle="Find destinations from your photos" step="1/4"
    @back="onHeaderBack" />
  <BaseSection icon="bi-camera" title="Image-based Travel AI" subtitle="Upload photo → Get recommendations">
    <div class="mb-3">
      <div class="small"><strong>How it works:</strong></div>
      <ol class="small text-muted mb-0 ps-3">
        <li>Upload your travel photo</li>
        <li>AI analyzes the image</li>
        <li>Get similar destination recommendations</li>
      </ol>
    </div>

    <label class="upload-area d-block mb-2" @dragover.prevent @drop.prevent="onDrop" for="imageInput">
      <div class="upload-gradient d-flex align-items-center justify-content-center">
        <div class="text-center text-white-50 w-100 px-3">
          <!-- preview image when selected, otherwise camera + text -->
          <template v-if="imagePreview">
            <img :src="imagePreview" alt="preview" class="preview-img rounded" />
          </template>
          <template v-else>
            <i class="bi bi-camera fs-1"></i>
            <div class="mt-2">Tap to Upload & Discover</div>
          </template>
        </div>
      </div>
    </label>
  </BaseSection>

  <section>
    <div class="d-grid">
      <input id="imageInput" type="file" accept="image/*" class="d-none" @change="onFileChange" />
      <!-- 버튼은 '다음(타입 선택)' 역할. 사진 없으면 비활성화 -->
      <button class="btn btn-primary" :disabled="!imagePreview" @click.prevent="goToType">
        <i class="bi bi-arrow-right-circle me-2"></i> Specify Photo Type
      </button>
    </div>
  </section>
</template>

<script setup>
import StepHeader from '@/components/common/StepHeader.vue'
import BaseSection from '@/components/common/BaseSection.vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const imagePreview = ref(null)

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

// go to type selection, pass preview in history state
const goToType = () => {
  if (!imagePreview.value) return
  router.push({
    name: 'ImageType',
    state: { preview: imagePreview.value, from: 'New' }
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

.upload-area {
  display: block;
  cursor: pointer;
}

.upload-gradient {
  height: 160px;
  border-radius: 12px;
  background: #3A5797;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-gradient .bi-camera {
  opacity: 0.85;
  font-size: 34px;
  color: rgba(0, 0, 0, 0.45);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}

/* disabled button visual */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card {
  border-radius: 12px;
}
</style>