<template>
  <div class="p-4">
    <!-- top banner with back button + title/subtitle -->
    <div class="page-banner d-flex align-items-center mb-3">
      <button class="btn-back me-3" @click="goBack" aria-label="Back to Supporter">
        <i class="bi bi-arrow-left"></i>
      </button>
      <div class="banner-title">
        <div class="h6 mb-0">Image-based Travel AI</div>
        <div class="small text-muted">Find destinations from your photos</div>
      </div>
      <div class="ms-auto">
        <button class="btn btn-sm btn-outline-primary" @click="$emit('new-search')">New Search</button>
      </div>
    </div>

    <section>
      <div class="card shadow-sm border-0 p-3 image-ai-card">
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

        <div class="d-grid">
          <input id="imageInput" type="file" accept="image/*" class="d-none" @change="onFileChange" />
          <!-- 버튼은 '다음(타입 선택)' 역할. 사진 없으면 비활성화 -->
          <button class="btn btn-primary" :disabled="!imagePreview" @click.prevent="goToType">
            <i class="bi bi-arrow-right-circle me-2"></i> Specify Photo Type
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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
    name: 'SupporterImageAIType',
    state: { preview: imagePreview.value }
  })
}

// back to Supporter main
const goBack = () => {
  router.push({ name: 'SupporterMain' })
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
.btn-back:hover { background: rgba(0,0,0,0.04); border-radius: 6px; }

.image-ai-card { background: #fff; }
.upload-area { display:block; cursor: pointer; }
.upload-gradient { height:160px; border-radius:12px; background: linear-gradient(90deg,#f7d6ff,#ffd6e8); box-shadow: inset 0 1px 0 rgba(255,255,255,0.4); overflow:hidden; display:flex; align-items:center; justify-content:center; }
.upload-gradient .bi-camera { opacity: 0.85; font-size: 34px; color: rgba(0,0,0,0.45); }
.preview-img { width:100%; height:100%; object-fit:cover; border-radius:10px; display:block; }

/* disabled button visual */
button:disabled { opacity: 0.6; cursor: not-allowed; }
.card { border-radius: 12px; }
</style>