<template>
  <div class="hashtag-page">
    <PageHeader
      title="Travelgram"
      subtitle="Your past travel adventures"
      icon="bi-instagram"
    />
    <!-- 상단 헤더 -->
    <StepHeader
      title="Create Travel Review"
      :subtitle="reviewStore.tripTitle"
      step="4/6"
      @back="goBack"
    />

    <!-- 본문 -->
    <section class="hashtag-section">
        <h6 class="guide-title"><i class="bi bi-hash text-primary me-2"></i>
          AI Hashtag Suggestions
        </h6>
        <p class="guide-subtitle">
          Get smart hashtag recommendations based on your chosen caption style ✨  
          You can also add your own custom tags below!
        </p>

      <!-- 선택된 해시태그 목록 -->
      <div class="selected-tags">
        <span
          v-for="tag in selectedTags"
          :key="tag"
          class="tag selected"
          @click="removeTag(tag)"
        >
          {{ tag }} ✕
        </span>
      </div>

      <!-- 추천 해시태그 목록 -->
      <div class="suggested-tags">
        <span
          v-for="tag in allHashtags"
          :key="tag"
          :class="['tag', { active: selectedTags.includes(tag) }]"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </span>
      </div>

      <!-- 커스텀 해시태그 입력 -->
      <div class="add-hashtag mt-3">
        <input
          type="text"
          v-model="newTag"
          placeholder="Add custom hashtag..."
          @keyup.enter="addTag"
        />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import StepHeader from '@/components/common/StepHeader.vue'
import PageHeader from '@/components/common/PageHeader.vue'

const router = useRouter()
const reviewStore = useReviewStore()

// ✅ 추천 해시태그 목록
const allHashtags = ref([
  '#JejuIsland',
  '#JejuTravel',
  '#Korea',
  '#TravelKorea',
  '#IslandLife',
  '#BeachVibes',
  '#NatureLovers',
  '#Wanderlust',
  '#TravelPhotography',
  '#AsiaTravel',
  '#JejuHealing',
  '#KoreaTrip',
  '#InstaTravel',
  '#TravelGram',
  '#ExploreKorea'
])

// ✅ 선택 상태 관리
const selectedTags = ref(['#JejuIsland', '#JejuTravel', '#Korea', '#TravelKorea', '#IslandLife', '#BeachVibes', '#NatureLovers', '#Wanderlust'])
const newTag = ref('')

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
  // ✅ 선택된 해시태그를 store에 저장
  reviewStore.setHashtags(selectedTags.value)
  reviewStore.nextStep()
  router.push({ name: 'ReviewEditPage' })
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

/* 해시태그 스타일 */
.tag {
  display: inline-block;
  background: #f0f0f0;
  color: #333;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.4rem 0.75rem;
  border-radius: 1rem;
  margin: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag:hover {
  background: #ffeedb;
  color: #ff8c00;
}

.tag.active,
.tag.selected {
  background: #ff8c00;
  color: #fff;
}

/* 선택된 해시태그 */
.selected-tags {
  margin-bottom: 1rem;
}

/* 추천 해시태그 */
.suggested-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
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
