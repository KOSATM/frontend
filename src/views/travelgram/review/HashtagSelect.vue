<template>
  <div class="hashtag-page">
    <PageHeader title="Travelgram" subtitle="Your past travel adventures" icon="bi-instagram" />
    <!-- 상단 헤더 -->
    <StepHeader title="Create Travel Review" :subtitle="reviewStore.planTitle" step="4/6" @back="goBack" />

    <!-- 본문 -->
    <section class="hashtag-section">
      <h6 class="guide-title"><i class="bi bi-hash text-primary me-2"></i>
        AI Hashtag Suggestions
      </h6>
      <p class="guide-subtitle">
        Get smart hashtag recommendations based on your chosen caption style ✨
        You can also add your own custom tags below!
      </p>

      <!-- 선택된 해시태그 박스 -->
      <div class="selected-box" v-if="selectedTags.length">
        <h6 class="box-title text-orange">
          Selected Hashtags
        </h6>
        <div class="selected-tags">
          <span v-for="tag in selectedTags" :key="tag" class="tag selected" @click="removeTag(tag)">
            {{ tag }} ✕
          </span>
        </div>
      </div>

      <!-- 추천 해시태그 박스 -->
      <div class="suggest-box">
        <h6 class="box-title text-secondary">
          AI Suggested Tags
        </h6>

        <div class="suggested-tags">
          <span v-for="tag in allHashtags" :key="tag" :class="['tag', selectedTags.includes(tag) ? 'ai-selected' : 'ai-default']" @click="toggleTag(tag)">
            {{ tag }}
          </span>
        </div>
      </div>


      <!-- 커스텀 해시태그 입력 -->
      <div class="add-hashtag mt-3">
        <input type="text" v-model="newTag" placeholder="Add custom hashtag..." @keyup.enter="addTag" />
        <button class="btn-add" @click="addTag">Add</button>
      </div>
    </section>
    <!-- 🔥 여기! navigation-buttons는 컨테이너 안의 최하단에 있어야 한다 -->
    <div class="navigation-buttons">
      <button class="btn-back" @click="goBack">Back</button>
      <button class="btn-next" @click="goNext" :disabled="selectedTags.length === 0">Next Step</button>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import StepHeader from '@/components/common/StepHeader.vue'
import PageHeader from '@/components/common/PageHeader.vue'

const router = useRouter()
const reviewStore = useReviewStore()

// ✅ AI가 제안한 전체 태그
const allHashtags = computed(() => reviewStore.aiHashtags || [])

// ✅ 선택 상태 관리
const selectedTags = ref([])
const newTag = ref('')


// 컴포넌트 처음 들어왔을 때
onMounted(() => {
  if (reviewStore.selectedHashtags?.length) {
    // 이미 이전 단계에서 선택한 값이 있으면 그거 복원
    selectedTags.value = [...reviewStore.selectedHashtags]
  } else {
    // 처음이라면 AI 제안 전체를 기본 선택
    selectedTags.value = [...allHashtags.value]
  }
})

// 만약 aiHashtags가 비동기로 나중에 들어오는 구조라면 watch도 추가
watch(allHashtags, (newVal) => {
  if (!reviewStore.selectedHashtags?.length && selectedTags.value.length === 0) {
    selectedTags.value = [...newVal]
  }
})

// ✅ 선택 토글
const toggleTag = (tag) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
}

// ✅ 선택 해시태그 삭제
const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

// ✅ 커스텀 해시태그 추가
const addTag = () => {
  const formatted = newTag.value.trim()
  if (formatted && !selectedTags.value.includes(`#${formatted.replace(/^#/, '')}`)) {
    selectedTags.value.push(`#${formatted.replace(/^#/, '')}`)
  }
  newTag.value = ''
}

// ✅ 이동
const goBack = () => router.back()
const goNext = () => {
  reviewStore.setHashtags(selectedTags.value) // ✅ 최종 선택 저장
  reviewStore.nextStep()
  router.push({ name: 'EditPage' })
}
</script>

<style scoped>
.hashtag-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem 6rem;
}

/* 제목 */
.section-title {
  color: #1b3b6f;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.section-subtitle {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.guide-title {
  color: #1b3b6f;
  font-weight: 600;
}

.guide-subtitle {
  font-size: 0.9rem;
  color: #6c757d;
}

/* 박스 스타일 */
.selected-box,
.suggest-box {
  background: #fff;
  border-radius: 1.25rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.box-title {
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.text-orange {
  color: #ff8c00;
}

.text-primary {
  color: #1b3b6f;
}

/* 해시태그 공통 */
.tag {
  display: inline-block;
  padding: 0.45rem 0.9rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  margin: 0.28rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

/* 선택된 해시태그 (주황) */
.tag.selected {
  background: #ff8c00;
  color: #fff;
}

.tag.selected:hover {
  background: #ff7700;
}

/* 추천 해시태그 기본 (회색) */
.tag.ai-default {
  background: #f0f0f0;
  color: #333;
}

.tag.ai-default:hover {
  background: #ffeedb;
  color: #ff8c00;
}

/* 추천 해시태그 - 선택됨 (남색) */
.tag.ai-selected {
  background: #1b3b6f;
  color: #fff;
}

.tag.ai-selected:hover {
  background: #162e5a;
}


/* 추가 입력 */
.add-hashtag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-hashtag input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 1rem;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
}

.add-hashtag input:focus {
  border-color: #ff8c00;
}

.btn-add {
  background: #1b3b6f;
  color: #fff;
  border: none;
  border-radius: 1rem;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-add:hover {
  background: #16305c;
}

/* 하단 버튼 영역 */
.navigation-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
}

.btn-back,
.btn-next {
  flex: 1;
  height: 48px;
  border-radius: 1rem;
  border: none;
  font-weight: 600;
  font-size: 1rem;
}

.btn-back {
  background-color: #fff;
  color: #1b3b6f;
  border: 2px solid #1b3b6f;
  margin-right: 0.75rem;
}

.btn-next {
  background-color: #1b3b6f;
  color: #fff;
}

.btn-next:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
