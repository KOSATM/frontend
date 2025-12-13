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
            <div v-if="message.type === 'ai' && message.loading" class="typing-indicator mt-2">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
        
        <div v-if="isLoading" class="message ai-message mb-3">
          <div class="message-bubble loading-bubble">
            <div class="spinner-container">
              <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
              <span class="ms-2 text-muted" style="font-size: 12px;">Thinking...</span>
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
import { marked } from "marked";
import { nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// Store & Router
const authStore = useAuthStore();
const chatStore = useChatStore();
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
    const mainResponse = res.data.mainResponse;

    chatMessages.value.push({
      id: Date.now() + 1,
      type: "ai",
      content: markdownToHTML(mainResponse.message),
      timestamp: new Date(),
    });

    if (mainResponse?.data) {
      console.log("🔥 서버에서 받은 플랜 payload:", mainResponse.data);
      chatStore.setLivePlan(mainResponse.data);
    }

    if (mainResponse.requirePageMove && mainResponse.targetUrl) {
      router.push(mainResponse.targetUrl);
    }

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
/* [중요] 레이아웃 시스템과의 통합을 위해 
  Position Fixed 관련 스타일을 모두 제거하고 
  Flexbox 기반으로 변경했습니다. 
*/

.chat-layout-wrapper {
  /* sidebar-area 내부를 꽉 채움 */
  width: 100%;
  height: 100%; 
  overflow: hidden; /* 이중 스크롤 방지 */
}

/* 메시지 영역 스크롤 */
.chat-messages {
  overflow-y: auto;
  background-color: #fff;
}

/* 메시지 버블 스타일 */
.message-bubble {
  padding: 10px 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 13.5px;
  line-height: 1.5;
  word-break: break-word; /* 좁은 폭에서 단어 줄바꿈 */
}

.ai-message {
  align-items: flex-start;
  margin-right: 1rem;
}

.ai-message .message-bubble {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #f1f3f5;
  border-radius: 16px 16px 16px 2px;
}

.user-message {
  align-items: flex-end;
  margin-left: 1rem;
}

.user-message .message-bubble {
  background: #1B3B6F; /* 메인 테마 컬러에 맞춤 */
  color: white;
  border-radius: 16px 16px 2px 16px;
}

/* Markdown Style Override (사이드바 폭에 맞춤) */
:deep(.markdown-body) {
  font-size: 13.5px !important;
  background: transparent !important;
  color: inherit !important;
}

/* 제목 태그(h1~h6)들의 크기와 여백을 강제로 줄임 */
:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
  font-size: 1.1em !important; /* 본문보다 약간만 크게 설정 (약 15px) */
  font-weight: 700 !important; /* 굵기는 유지 */
  margin-top: 12px !important; /* 위쪽 여백 줄임 */
  margin-bottom: 6px !important; /* 아래쪽 여백 줄임 */
  line-height: 1.4 !important;
  border-bottom: none !important; /* h1, h2에 자주 붙는 밑줄 제거 */
}
:deep(.markdown-body p) {
  margin-bottom: 0.5rem !important;
}
:deep(.markdown-body ul) {
  padding-left: 1.2rem !important;
}
/* 이미지 크기 제한 및 스타일링 */
:deep(.markdown-body img) {
  max-width: 100% !important;    /* 가로: 말풍선 너비를 넘지 않도록 설정 */
  height: auto !important;       /* 세로: 비율에 맞춰 자동 조절 */
  max-height: 300px !important;  /* 세로 최대 크기 제한 (너무 길쭉한 이미지 방지) */
  object-fit: contain !important; /* 이미지가 찌그러지지 않고 비율 유지 */
  
  border-radius: 8px !important; /* 이미지 모서리를 둥글게 (보기 좋게) */
  display: block !important;     /* 블록 요소로 변경 */
  margin: 10px 0 !important;     /* 위아래 여백 추가 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important; /* 살짝 그림자 효과 */
}

/* (선택 사항) 로딩 중이거나 깨진 이미지 아이콘 숨김 처리 */
:deep(.markdown-body img[alt=""]) {
  display: none !important;
}
/* 입력창 스타일 */
.chat-input-wrapper {
  background: #fff;
}

.chat-input-container {
  display: flex;
  align-items: flex-end; /* 텍스트 많아질 때 버튼 하단 정렬 */
  gap: 6px;
  padding: 8px 10px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
}

.chat-text-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  padding: 4px 0;
  max-height: 100px;
  resize: none;
}

.icon-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #adb5bd;
  border-radius: 50%;
  transition: all 0.2s;
  padding: 0;
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

/* 퀵 액션 버튼 스타일 */
.btn-xs {
  padding: 2px 10px;
  font-size: 11px;
}

/* 스크롤바 커스텀 */
.chat-messages::-webkit-scrollbar,
.custom-scrollbar-x::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.chat-messages::-webkit-scrollbar-thumb,
.custom-scrollbar-x::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 2px;
}

/* Typing Animation */
.typing-indicator span {
  width: 4px;
  height: 4px;
  background: #adb5bd;
  display: inline-block;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
  margin: 0 1px;
}
.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
@keyframes typing {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
</style>