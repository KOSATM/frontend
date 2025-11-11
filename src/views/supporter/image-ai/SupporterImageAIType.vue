<template>
  <div class="p-4">
    <PageHeader title="Image-based Travel AI" subtitle="Select photo type" />

    <div class="card p-4 mt-3">
      <h5 class="mb-3">What type of photo is this?</h5>

      <!-- preview image (from route state or query) -->
      <div class="preview-wrap mb-3" v-if="preview">
        <img :src="preview" alt="uploaded preview" class="preview-img" />
      </div>

      <ul class="list-unstyled mt-2">
        <li class="option-item p-3 mb-2 rounded d-flex align-items-center" @click="select('landscape')">
          <div class="option-icon gradient-1 me-3"><i class="bi bi-image-fill"></i></div>
          <div>
            <div class="fw-medium">Landscape / Places</div>
            <div class="small text-muted">Parks, temples, towers, streets</div>
          </div>
        </li>

        <li class="option-item p-3 mb-2 rounded d-flex align-items-center" @click="select('food')">
          <div class="option-icon gradient-2 me-3"><i class="bi bi-cup-straw"></i></div>
          <div>
            <div class="fw-medium">Food / Restaurants</div>
            <div class="small text-muted">Korean BBQ, street food, cafes</div>
          </div>
        </li>

        <li class="option-item p-3 mb-2 rounded d-flex align-items-center" @click="select('people')">
          <div class="option-icon gradient-3 me-3"><i class="bi bi-person-fill"></i></div>
          <div>
            <div class="fw-medium">People / Activities</div>
            <div class="small text-muted">Photo spots, cultural experiences</div>
          </div>
        </li>
      </ul>

      <div class="d-flex">
        <router-link class="btn btn-link" :to="{ name: 'SupporterImageAINew' }">Back</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'

const router = useRouter()
const route = useRoute()

// accept preview from route.state.preview or route.query.preview
const preview = ref(route?.state?.preview || route?.query?.preview || '/sample/default.jpg')

const select = (type) => {
  // 뼈대: 전달된 preview와 선택한 타입을 결과 페이지로 전달
  router.push({
    name: 'SupporterImageAIResults',
    state: { preview: preview.value, type }
  })
}
</script>

<style scoped>
.preview-wrap {
  background: linear-gradient(180deg,#fff7ff,#f7eefc);
  padding: 14px;
  border-radius: 14px;
}
.preview-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
}

/* option item */
.option-item {
  background: #fff;
  border: 1px solid #f3e8ff;
  cursor: pointer;
  align-items: center;
}
.option-icon {
  width:56px;
  height:56px;
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;
  font-size:20px;
}

/* gradients for icons */
.gradient-1 { background: linear-gradient(135deg,#6dd3ff,#7be6b8); }
.gradient-2 { background: linear-gradient(135deg,#ffb86b,#ff9ad1); }
.gradient-3 { background: linear-gradient(135deg,#a78bff,#ff9ad1); }

.card { border-radius: 12px; }
</style>