<template>
  <div class="hashtag-page">
    <!-- 상단 헤더 -->
    <ReviewHeader
      :title="'Select Hastags'"
      :subtitle="tripTitle"
      step="4/6"
      @back="goBack"
    />

    <!-- 본문 -->
    <section class="hashtag-section">
      <h6 class="section-title">Hashtags</h6>
      <p class="section-subtitle">
        Select or add custom hashtags ({{ selectedTags.length }} selected)
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

    <!-- 하단 버튼 -->
    <div class="navigation-buttons">
      <button class="btn-back" @click="goBack">Back</button>
      <button
        class="btn-next"
        @click="goNext"
        :disabled="selectedTags.length === 0"
      >
        Next Step
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ReviewHeader from '@/components/history/ReviewHeader.vue';

const router = useRouter()
const route = useRoute()

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
  router.push({
    name: 'ReviewEditPage', // ✅ ReviewSummary → ReviewEditPage
    params: { tripId: route.params.tripId },
    query: { tags: selectedTags.value.join(',') }
  })
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

/* 하단 버튼 */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 1rem;
  left: 0;
  width: 100%;
  padding: 0 1.25rem;
}

.btn-back,
.btn-next {
  flex: 1;
  height: 48px;
  border-radius: 1rem;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
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
