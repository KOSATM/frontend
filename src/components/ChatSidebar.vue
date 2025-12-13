<template>
  <section class="planner-chat">
    <!-- Header with Close Button -->
    <div class="chat-header d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
      <div class="rounded-circle d-flex justify-content-center align-items-center bg-secondary text-white" 
       style="width: 40px; height: 40px; flex-shrink: 0;">
        <i class="bi bi-airplane-fill"></i>
      </div>
      <div class="flex-grow-1">
        <h6 class="mb-0">AI 여행 어시스턴트</h6>
        <small class="text-muted">여행 일정을 수정하거나 장소를 추천받아 보세요.</small>
      </div>
      <button @click="$emit('close')" class="btn btn-sm btn-ghost">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages" ref="messagesContainer" @scroll="handleScroll">
      <div class="message-list">
        <!-- Initial AI Message -->
        <div class="message ai-message mb-3">
          <div class="message-bubble">
            <p class="mb-1">
              안녕하세요! 저는 당신의 행복한 서울 여행을 위한 AI 어시스턴트입니다.
            </p>
            <p class="mb-0">
              일정 변경, 음식이나 활동 추천에 대해 물어봐주세요!
            </p>
          </div>
        </div>

        <!-- Dynamic Messages -->
        <div v-for="message in chatMessages" :key="message.id" class="message mb-3" :class="{
          'user-message': message.type === 'user',
          'ai-message': message.type === 'ai',
        }">
          <div class="message-bubble">
            <div class="mb-0">
              <div class="markdown-body" v-html="message.content"></div>
            </div>
            <div v-if="message.type === 'ai' && message.loading" class="typing-indicator mt-2">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
        
        <!-- Loading Spinner -->
        <div v-if="isLoading" class="message ai-message mb-3">
          <div class="message-bubble loading-bubble">
            <div class="spinner-container">
              <div class="spinner-border spinner-border-sm text-secondary" role="status">
                <span class="visually-hidden">로딩 중...</span>
              </div>
              <span class="ms-2 text-muted">AI가 생각 중입니다...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import chatApi from "@/api/chatApi";
import { useChatStore } from "@/store/chatStore";
import { ref, nextTick, onMounted, watch } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useRoute, useRouter } from "vue-router";
import { marked } from "marked";

const authStore = useAuthStore();
const chatStore = useChatStore();
const router = useRouter();
const route = useRoute();

const currentMessage = ref("");
const chatMessages = ref([]);
const messagesContainer = ref(null);
const isLoading = ref(false);

const handleScroll = () => {
  // 스크롤 감지 로직 필요시 추가
};

const sendMessage = async (message) => {
  // App.vue에서 전달된 메시지 또는 currentMessage 사용
  const messageToSend = message || currentMessage.value;
  
  if (!messageToSend.trim() || isLoading.value) return;

  chatMessages.value.push({
    id: Date.now(),
    type: "user",
    content: messageToSend,
    timestamp: new Date(),
  });

  const request = {
    userId: authStore.userId,
    message: messageToSend,
    currentUrl: route.fullPath
  };
  currentMessage.value = "";
  isLoading.value = true;

  await nextTick();
  scrollToBottom();

  setTimeout(async () => {
    const res = await generateAIResponse(request);

    chatMessages.value.push({
      id: Date.now() + 1,
      type: "ai",
      content: markdownToHTML(res.data.mainResponse.message),
      timestamp: new Date(),
    });

    if (res.data.mainResponse.requirePageMove) {
      const payload = res.data.mainResponse.data;
      chatStore.setLivePlan(payload);
      router.push(res.data.mainResponse.targetUrl);
    }

    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }, 500);
};

const generateAIResponse = async (request) => {
  return await chatApi.chat(request);
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const markdownToHTML = (message) => {
  return marked.parse(message);
}

watch(
  () => chatStore.messageToSend,
  (msg) => {
    if (msg) {
      currentMessage.value = msg;
      sendMessage(msg);
    }
  }
);

onMounted(() => {
  authStore.initializeAuth();
  scrollToBottom();
});

defineExpose({
  currentMessage,
  chatMessages,
  isLoading,
  sendMessage,
  scrollToBottom,
});
</script>

<style scoped>
.planner-chat {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 0 !important;
  border: none !important;
  box-shadow: none !important;
  padding-top: 64px;
}

.chat-header {
  flex-shrink: 0;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  background: white;
  z-index: 50;
}

.chat-header .btn-ghost {
  background: transparent;
  border: none;
  color: #495057;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}

.chat-header .btn-ghost:hover {
  color: #1B3B6F;
}

.chat-messages {
  flex: 1;
  overflow-y: scroll;
  min-height: 0;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ai-message {
  align-items: flex-start;
}

.ai-message .message-bubble {
  background: #f9fafc;
  color: #2c3e50;
  border: 1px solid #e9ecef;
  border-radius: 18px 18px 18px 4px;
  max-width: 85%;
}

.user-message {
  align-items: flex-end;
}

.user-message .message-bubble {
  background: #1B3B6F;
  color: white;
  border-radius: 18px 18px 4px 18px;
  max-width: 80%;
}

.message-bubble {
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.chat-messages::-webkit-scrollbar {
  width: 12px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
  margin: 10px 0;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 6px;
  border: 3px solid transparent;
  background-clip: content-box;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #868e96;
  background-clip: content-box;
}

.loading-bubble {
  background: #f0f4ff !important;
  border: 1px solid #d0e0ff !important;
}

.spinner-container {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #6c757d;
  border-radius: 50%;
  animation: typing 1.5s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Markdown Style Override (사이드바 폭에 맞춤) */
:deep(.markdown-body) {
  font-size: 13.5px !important;
  background: transparent !important;
  color: inherit !important;
}

/* --- 여기부터 추가하세요 --- */
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
/* --- 여기까지 --- */

:deep(.markdown-body p) {
  margin-bottom: 0.5rem !important;
}
:deep(.markdown-body ul) {
  padding-left: 1.2rem !important;
  margin-bottom: 5px !important;

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
</style>