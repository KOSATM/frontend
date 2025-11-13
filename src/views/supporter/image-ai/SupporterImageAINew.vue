<template>
  <div class="page-container">
    <!-- 상단 헤더 -->
    <BackButtonPageHeader 
      title="Image-based Travel AI" 
      subtitle="Find destinations from your photos"
      @back="goBack"
    />

    <!-- 메인 컨텐츠 -->
    <UploadSection 
      icon="bi-camera" 
      title="Upload Travel Photo" 
      subtitle="Let AI discover similar destinations">
      
      <div class="how-it-works mb-4">
        <div class="small"><strong>How it works:</strong></div>
        <ol class="small text-muted mb-0 ps-3">
          <li>Upload your travel photo</li>
          <li>AI analyzes the image</li>
          <li>Get similar destination recommendations</li>
        </ol>
      </div>

      <label class="upload-area d-block mb-3" @dragover.prevent @drop.prevent="onDrop" for="imageInput">
        <div class="upload-gradient d-flex align-items-center justify-content-center">
          <div class="text-center text-white-50 w-100 px-3">
            <!-- preview image when selected, otherwise camera + text -->
            <template v-if="imagePreview">
              <img :src="imagePreview" alt="preview" class="preview-img rounded" />
            </template>
            <template v-else>
              <i class="bi bi-cloud-arrow-up fs-1"></i>
              <div class="mt-2">Tap to Upload & Discover</div>
            </template>
          </div>
        </div>
      </label>

      <input id="imageInput" type="file" accept="image/*" class="d-none" @change="onFileChange" />
      
      <div class="d-grid gap-2">
        <button class="btn btn-primary" :disabled="!imagePreview" @click.prevent="goToType">
          <i class="bi bi-arrow-right-circle me-2"></i> Specify Photo Type
        </button>
      </div>
    </UploadSection>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButtonPageHeader from '@/components/common/BackButtonPageHeader.vue'
import UploadSection from '@/components/travelgram/UploadSection.vue'

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

const goToType = () => {
  if (!imagePreview.value) return
  router.push({
    name: 'SupporterImageAIType',
    state: { preview: imagePreview.value }
  })
}

const goBack = () => {
  router.push({ name: 'SupporterMain' })
}
</script>

<style scoped>
.page-container {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem;
}

.how-it-works {
  padding: 1rem;
  background-color: #f9fafc;
  border-radius: 0.75rem;
  border-left: 4px solid #ff8c00;
}

.upload-area {
  display: block;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.upload-gradient {
  height: 200px;
  border-radius: 1rem;
  background: linear-gradient(135deg, #1B3B6F 0%, #3A5797 100%);
  box-shadow: 0 4px 12px rgba(27, 59, 111, 0.2);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.upload-area:hover .upload-gradient {
  box-shadow: 0 6px 16px rgba(27, 59, 111, 0.3);
  transform: translateY(-2px);
}

.upload-gradient .bi-cloud-arrow-up {
  opacity: 0.85;
  color: rgba(255, 255, 255, 0.7);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.75rem;
  display: block;
}

.btn-primary {
  background-color: #1b3b6f !important;
  color: #fff !important;
  font-weight: 600 !important;
  border: none !important;
  border-radius: 0.75rem !important;
  padding: 0.75rem 1.5rem !important;
  transition: all 0.3s ease !important;
}

.btn-primary:hover:not(:disabled) {
  background-color: #ff8c00 !important;
  transform: translateY(-2px) !important;
}

.btn-primary:disabled {
  background-color: #b0bfd8 !important;
  cursor: not-allowed !important;
  opacity: 0.6 !important;
}
</style>