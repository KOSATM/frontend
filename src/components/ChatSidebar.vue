<template>
  <div class="chat-layout-wrapper d-flex flex-column h-100 bg-white">

    <div class="chat-header d-flex align-items-center gap-2 p-3 border-bottom">
  <div class="badge text-white rounded-circle d-flex justify-content-center align-items-center flex-shrink-0"
    style="width: 32px; height: 32px; background-color: #1B3B6F;">
    <i class="bi bi-airplane-fill fs-6"></i>
  </div>

  <div class="overflow-hidden d-flex flex-column justify-content-center">
    <h6 class="mb-0 fw-bold text-truncate" style="line-height: 1.2;">
      AI 여행 어시스턴트
    </h6>

    <small class="text-muted">
      서울 여행 플래너
    </small>
  </div>
</div>

    <div class="chat-messages flex-grow-1 p-3" ref="messagesContainer">
      <div class="message-list">
        <div class="message ai-message mb-3">
          <div class="message-bubble">
            <p class="mb-1">안녕하세요. 서울 여행 플래너입니다.</p>
            <p class="mb-0">여정과 음식, 활동에 관해 물어봐주세요!</p>
          </div>
        </div>

        <div v-for="message in chatMessages" :key="message.id" class="message mb-3" :class="{
          'user-message': message.type === 'user',
          'ai-message': message.type === 'ai',
        }">
          <div class="message-bubble">
            <div class="markdown-body" v-html="message.content"></div>

            <!-- 🖼️ 플랜 데이터의 이미지 표시 -->
            <div v-if="message.images && message.images.length > 0" class="place-images-gallery mt-3">
              <div v-for="(place, idx) in message.images" :key="idx" class="place-image-card">
                <img v-if="place.image" :src="place.image" :alt="place.title" class="place-img" />
                <div class="place-card-info">
                  <p class="place-card-title">{{ place.title }}</p>
                  <p class="place-card-name text-muted">{{ place.placeName }}</p>
                  <p v-if="place.address" class="place-card-address text-muted small">{{ place.address }}</p>
                </div>
              </div>
            </div>

            <div v-if="message.type === 'ai' && message.loading" class="typing-indicator mt-2">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="message ai-message mb-3">
          <div class="message-bubble loading-bubble">
            <div class="spinner-container">
              <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
              <small class="ms-2 text-muted">생각 중...</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="quick-actions px-3 pb-2">
      <div class="d-flex gap-2 overflow-x-auto pb-2 custom-scrollbar-x">
        <button @click="sendQuickMessage('Start early')" class="btn btn-xs btn-outline-secondary rounded-pill text-nowrap">
          🌅 Early Start
        </button>
        <button @click="sendQuickMessage('Vegetarian food')" class="btn btn-xs btn-outline-secondary rounded-pill text-nowrap">
          🥗 Vegetarian
        </button>
        <button @click="sendQuickMessage('Shopping spots')" class="btn btn-xs btn-outline-secondary rounded-pill text-nowrap">
          🛍️ Shopping
        </button>
        <button @click="sendQuickMessage('Budget friendly')" class="btn btn-xs btn-outline-secondary rounded-pill text-nowrap">
          💰 Save Cost
        </button>
      </div>
    </div> -->

    <div class="chat-input-wrapper p-3 border-top bg-white">
      <div class="chat-input-container">
        <textarea
          v-model="currentMessage"
          @keydown.enter.exact.prevent="sendMessage"
          :disabled="isLoading"
          class="chat-text-input"
          placeholder="질문을 입력해주세요..."
          rows="1"
          @input="autoResize"
          ref="textareaRef"
        ></textarea>

        <button class="icon-btn voice-btn" title="Voice input">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
            <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
          </svg>
        </button>

        <button
          @click="sendMessage"
          :disabled="!currentMessage.trim() || isLoading"
          class="icon-btn send-btn"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" style="width: 0.8rem; height: 0.8rem;"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import chatApi from "@/api/chatApi";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useTravelStore } from "@/store/travelStore";
import { marked } from "marked";
import { nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// Store & Router
const authStore = useAuthStore();
const chatStore = useChatStore();
const travelStore = useTravelStore();
const router = useRouter();
const route = useRoute();

// State
const currentMessage = ref("");
const chatMessages = ref([]);
const messagesContainer = ref(null);
const textareaRef = ref(null);
const isLoading = ref(false);

// Methods
const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 100) + "px"; // 최대 높이 제한 줄임
  }
};

const sendQuickMessage = (msg) => {
  currentMessage.value = msg;
  sendMessage();
};

// 메시지 전송
const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return;

  //  유저 메시지 추가
  chatMessages.value.push({
    id: Date.now(),
    type: "user",
    content: currentMessage.value,
    timestamp: new Date(),
  });

  const request = {
    userId: authStore.userId,
    message: currentMessage.value,
    currentUrl: route.fullPath
  };
  currentMessage.value = "";
  isLoading.value = true;

  if (textareaRef.value) textareaRef.value.style.height = "auto";
  await nextTick();
  scrollToBottom();

  setTimeout(async () => {
    const res = await chatApi.chat(request);
    console.log('Chat Response (chatApi already unwrapped):', res); // 디버깅용

    // ✅ chatApi.chat()은 axios response.data를 반환함
    // res 구조: { success, status, data: { message, response, data: [...] }, error }
    const apiRes = res;

    let message = "";
    if (apiRes?.data?.message) {
      message = apiRes.data.message;
    } else if (apiRes?.message) {
      message = apiRes.message;
    } else {
      message = "응답을 받지 못했습니다.";
    }

    // 🖼️ 이미지 데이터 추출 (PlaceSuggestAgent 응답)
    let imagesData = [];
    if (apiRes?.data?.data && Array.isArray(apiRes.data.data)) {
      // apiRes.data.data = [{title, image, address, ...}, ...]
      imagesData = apiRes.data.data.map(place => ({
        title: place.title,
        placeName: place.placeName,
        address: place.address,
        image: place.image
      }));
      console.log("🖼️ 추출된 이미지:", imagesData.length, "개");
    } else {
      console.warn("⚠️ 이미지 데이터 없음. apiRes.data.data:", apiRes?.data?.data);
    }

    chatMessages.value.push({
      id: Date.now() + 1,
      type: "ai",
      content: markdownToHTML(message),
      images: imagesData,
      timestamp: new Date(),
    });

    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }, 500);

};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Watchers & Lifecycle
watch(() => chatStore.messageToSend, (msg) => {
  if (msg) {
    currentMessage.value = msg;
    sendMessage();
  }
});

// 마크다운 문서 HTML 형식으로 변환
const markdownToHTML = (message) => {
  let htmlContent = marked.parse(message);
  return htmlContent;
}


onMounted(() => {
  authStore.initializeAuth();
  scrollToBottom();
});
</script>

<style scoped>
/* [수정 사항]
  - 글로벌(_typography.scss)에서 설정된 폰트 패밀리를 그대로 상속받습니다.
  - 불필요한 font-family 재정의 코드를 모두 삭제했습니다.
  - 오직 가독성을 위한 font-size 확대와 레이아웃/여백 조정에만 집중했습니다.
*/

.chat-layout-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* 기본 글자 크기를 여기서 한 번만 키워주면 내부 요소들이 상속받습니다 */
  font-size: 1.25rem;
  color: #333;
}

/* --- 상단 헤더 영역 --- */
.chat-header h6 {
  /* h6 태그는 이미 글로벌에서 memoment 폰트가 적용되어 있으므로 크기만 조정 */
  font-size: 1.5rem;
  margin: 0;
}

.chat-header small {
  font-size: 1rem;
  color: #6c757d;
}

/* --- 메시지 영역 --- */
.chat-messages {
  overflow-y: auto;
  background-color: #fff;
}

/* 메시지 말풍선 공통 */
.message-bubble {
  padding: 12px 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 1.25rem; /* 말풍선 텍스트 크기 확보 */
  line-height: 1.5;
  word-break: break-word;
}

/* AI 메시지 */
.ai-message {
  align-items: flex-start;
  margin-right: 1rem;
}
.ai-message .message-bubble {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #f1f3f5;
  border-radius: 20px 20px 20px 4px;
}

/* 유저 메시지 */
.user-message {
  align-items: flex-end;
  margin-left: 1rem;
}
.user-message .message-bubble {
  background: #1B3B6F;
  color: white;
  border-radius: 20px 20px 4px 20px;
}

/* [Markdown 스타일 재정의] */
:deep(.markdown-body) {
  /* 글로벌 p 태그 스타일을 따라가지만, 혹시 모를 초기화를 위해 크기만 명시 */
  font-size: 1.25rem !important;
  background: transparent !important;
  color: inherit !important;
  line-height: 1.6 !important;
}

/* 마크다운 내부 제목 태그 (h1~h6) */
/* 글로벌 h 태그 스타일이 적용되므로 크기와 여백만 조정합니다 */
:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
  font-size: 1.4em !important;
  margin-top: 1.2rem !important;
  margin-bottom: 0.6rem !important;
  line-height: 1.3 !important;
  border-bottom: none !important;
}

:deep(.markdown-body p) {
  margin-bottom: 0.8rem !important;
}

:deep(.markdown-body ul),
:deep(.markdown-body ol) {
  padding-left: 1.5rem !important;
}

:deep(.markdown-body li) {
  margin-bottom: 0.4rem !important;
}

/* 이미지 스타일 */
:deep(.markdown-body img) {
  max-width: 100% !important;
  height: auto !important;
  max-height: 350px !important;
  border-radius: 12px !important;
  margin: 10px 0 !important;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
}

/* --- 입력창 영역 --- */
.chat-input-wrapper {
  background: #fff;
}

.chat-input-container {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 24px;
}

.chat-text-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;

  /* 주의: textarea/input은 브라우저 기본 스타일 때문에 글로벌 body 폰트를
     상속받지 않는 경우가 많습니다.
     이 경우에만 font-family: inherit;을 주면 글로벌 폰트를 따라갑니다.
  */
  font-family: inherit;
  font-size: 1.25rem;
  line-height: 1.5;

  padding: 4px 0;
  max-height: 120px;
  resize: none;
}

.chat-text-input::placeholder {
  color: #adb5bd;
  font-size: 1.2rem;
}

/* 버튼 아이콘 */
.icon-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #adb5bd;
  border-radius: 50%;
  transition: all 0.2s;
  padding: 0;
  cursor: pointer;
}

.icon-btn svg {
  width: 20px;
  height: 20px;
}

.icon-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.send-btn {
  background: #1B3B6F;
  color: white;
}
.send-btn:hover {
  background: #162d52;
}
.send-btn:disabled {
  background: #e9ecef;
  color: #ced4da;
}

/* 스크롤바 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
}

/* 타이핑 인디케이터 */
.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #adb5bd;
  display: inline-block;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
  margin: 0 2px;
}
.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* 🖼️ 이미지 갤러리 스타일 */
.place-images-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.place-image-card {
  border-radius: 10px;
  overflow: hidden;
  background: white;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.2s ease;
}

.place-image-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #1B3B6F;
}

.place-img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  display: block;
}

.place-card-info {
  padding: 8px;
}

.place-card-title {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #1B3B6F;
}

.place-card-name {
  font-size: 11px;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.place-card-address {
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
