<template>
  <div class="hashtag-page">
    <PageHeader title="트래벌그램" subtitle="더 많은 사람에게 닿을 수 있도록 해시태그를 함께 추가해주세요." icon="bi-instagram" />
    <StepHeader title="해시태그 편집" :subtitle="reviewStore.planTitle" step="4/6" @back="goBack" />

    <section class="hashtag-section">
      <h6 class="guide-title">
        <i class="bi bi-hash text-primary me-2"></i>
        해시태그 관리
      </h6>
      <p class="guide-subtitle">
        태그를 탭하여 빼거나 추가할 수 있습니다. 당신만의 커스텀 해시태그도 추가할 수 있습니다.
      </p>

      <div class="input-area">
        <div class="input-wrapper">
          <span class="prefix">#</span>
          <input 
            type="text" 
            v-model="newTagInput" 
            placeholder="Add new tag (e.g. delicious, seoul)" 
            @keyup.enter="addCustomTag" 
          />
          <button class="btn-add" @click="addCustomTag" :disabled="!newTagInput.trim()">
            <i class="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>

      <div class="tag-cloud-box">
        <div class="tag-list">
          <button
            v-for="(tag, index) in displayTags"
            :key="index"
            class="tag-pill"
            :class="{ 'active': isSelected(tag.name) }"
            @click="toggleTag(tag.name)"
          >
            <span class="hash">#</span>{{ tag.name }}
            <i v-if="isSelected(tag.name)" class="bi bi-check-lg ms-1 small-icon"></i>
          </button>
        </div>
        
        <p class="count-text">
          <span class="text-orange">{{ selectedCount }}</span> tags selected
        </p>
      </div>

    </section>


        <NavigationButtons
      backText="Back"
      :isNextDisabled="selectedCount === 0"
      @back="goBack"
      @next="goNext"
    >
    </NavigationButtons>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReviewStore } from '@/store/reviewStore'
import api from '@/api/travelgramApi'
import StepHeader from '@/components/common/header/StepHeader.vue'
import PageHeader from '@/components/common/header/PageHeader.vue'
import NavigationButtons from '@/components/common/button/NavigationButtons.vue';

const router = useRouter()
const reviewStore = useReviewStore()

// 화면에 보여줄 모든 태그 리스트 (AI 제안 + 사용자 추가)
const displayTags = ref([])

// 선택된 태그의 이름(name)을 저장하는 Set (중복 방지 및 빠른 조회)
const selectedSet = ref(new Set())

const newTagInput = ref('')

// 선택된 개수 계산
const selectedCount = computed(() => selectedSet.value.size)

onMounted(() => {
  // 1. AI가 추천했던 원본 태그들
  const aiOriginTags = reviewStore.aiHashtags || []
  
  // 2. 사용자가 이전에(혹은 방금) 선택한 태그들
  const currentSelected = reviewStore.selectedHashtags || []

  // 3. 화면에 보여줄 태그 목록 구성 (Display List)
  // 기본적으로 AI 추천 태그는 다 보여줍니다.
  const combinedTags = [...aiOriginTags]

  // 4. "사용자가 직접 추가한 커스텀 태그"를 찾아서 목록에 더해줍니다.
  // (현재 선택된 것 중에 AI 목록에 없는 것이 커스텀 태그입니다)
  currentSelected.forEach(selTag => {
    const existsInAi = aiOriginTags.some(aiTag => aiTag.name === selTag.name)
    if (!existsInAi) {
      combinedTags.push(selTag)
    }
  })

  // 5. 화면 표시용 리스트 업데이트
  displayTags.value = combinedTags

  // 6. "선택됨(Active)" 상태 복원
  // currentSelected에 있는 애들만 활성화 표시
  selectedSet.value.clear()
  currentSelected.forEach(tag => {
    selectedSet.value.add(tag.name)
  })
})

// 태그 선택 여부 확인
const isSelected = (tagName) => {
  return selectedSet.value.has(tagName)
}

// 태그 토글 (클릭 시)
const toggleTag = (tagName) => {
  if (selectedSet.value.has(tagName)) {
    selectedSet.value.delete(tagName) // 선택 해제
  } else {
    selectedSet.value.add(tagName) // 선택
  }
}

// 커스텀 태그 추가
const addCustomTag = () => {
  const val = newTagInput.value.trim()
  if (!val) return

  // # 제거 및 소문자 변환 (취향에 따라 대소문자 유지 가능)
  const cleanName = val.replace(/^#/, '')

  // 1. 이미 화면에 있는 태그인지 확인
  const exists = displayTags.value.some(t => t.name.toLowerCase() === cleanName.toLowerCase())

  if (!exists) {
    // 2. 없으면 화면 리스트에 추가 (객체 형태 유지)
    displayTags.value.push({ id: null, name: cleanName })
  }

  // 3. 무조건 선택 상태로 만듦 (있던 거면 선택만 됨)
  selectedSet.value.add(cleanName)
  
  newTagInput.value = ''
}

const goBack = () => router.push({name: 'CaptionSelect'});

const goNext = async() => {
  try {
    // 1. 최종 선택된 태그 객체들 필터링
    // 예: [{id: 1, name: '여행'}, {id: null, name: '직접추가한태그'}]
    const finalTags = displayTags.value.filter(tag => selectedSet.value.has(tag.name));
    
    // 2. 백엔드 DTO용 이름 배열 추출
    // 예: ['여행', '직접추가한태그']
    const tagNames = finalTags.map(tag => tag.name);

    // 3. Store에서 groupId 가져오기
    const groupId = reviewStore.hashtagGroupId; 

    if (!groupId) {
        alert("해시태그 그룹 ID를 찾을 수 없습니다.");
        return;
    }

    // ✨ [핵심 수정] Store 상태를 먼저 업데이트합니다! ✨
    // (Pinia Store 구조에 따라 메서드명은 다를 수 있습니다. 직접 할당 혹은 액션 호출)
    reviewStore.selectedHashtags = finalTags; 
    // 또는: reviewStore.setSelectedHashtags(finalTags);

    // 4. Payload 구성
    const payload = {
      hashtagGroupId: groupId,
      names: tagNames
    };

    // 5. API 호출 (DB 저장)
    await api.createHashtags(payload);
    
    // 6. 다음 단계 진행
    reviewStore.nextStep();
    router.push({ name: 'EditPage' });

  }catch(error){
    console.error("해시태그 저장 중 오류 발생: ", error);
    alert("해시태그 저장에 실패했습니다.");
  }
}

</script>

<style scoped>
.hashtag-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem 6rem;
}

/* 텍스트 스타일 */
.guide-title {
  color: #1b3b6f;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.guide-subtitle {
  font-size: 0.9rem;
  color: #868e96;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}
.text-orange {
  color: #ff8c00;
  font-weight: 700;
}

/* 1. 입력창 스타일 */
.input-area {
  margin-bottom: 1.5rem;
}
.input-wrapper {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  transition: all 0.2s;
}
.input-wrapper:focus-within {
  border-color: #ff8c00;
  box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
}
.prefix {
  font-weight: 600;
  color: #adb5bd;
  margin-right: 0.5rem;
}
.input-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #495057;
}
.input-wrapper input::placeholder {
  color: #dee2e6;
}
.btn-add {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: #f1f3f5;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-add:hover:not(:disabled) {
  background-color: #1b3b6f;
  color: white;
}
.btn-add:disabled {
  opacity: 0.5;
  cursor: default;
}

/* 2. 태그 클라우드 박스 */
.tag-cloud-box {
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

/* 태그 칩 디자인 (핵심) */
.tag-pill {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  
  /* 기본 상태 (선택 안됨 - 회색) */
  background-color: #f1f3f5;
  color: #868e96;
}

.tag-pill .hash {
  margin-right: 2px;
  opacity: 0.6;
}

.tag-pill:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
}

/* 선택된 상태 (주황색) */
.tag-pill.active {
  background-color: #ff8c00; /* 오렌지 */
  color: white;
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3);
  transform: translateY(-1px);
}

.tag-pill.active:hover {
  background-color: #f57c00;
}

.small-icon {
  font-size: 0.8rem;
  opacity: 0.9;
}

.count-text {
  text-align: right;
  font-size: 0.85rem;
  color: #adb5bd;
  margin: 0;
}

/* 하단 버튼 */
.navigation-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
}
.btn-back,
.btn-next {
  flex: 1;
  height: 50px;
  border-radius: 1rem;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}
.btn-back {
  background-color: white;
  color: #868e96;
  border: 2px solid #f1f3f5;
}
.btn-next {
  background-color: #1b3b6f;
  color: white;
  box-shadow: 0 4px 12px rgba(27, 59, 111, 0.2);
}
.btn-next:disabled {
  background-color: #dee2e6;
  color: #adb5bd;
  box-shadow: none;
  cursor: not-allowed;
}
</style>