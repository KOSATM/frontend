<template>
  <section class="planner-chat card shadow-sm d-flex flex-column">
    <!-- Header -->
    <div class="chat-header d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
      <div class="rounded-circle d-flex justify-content-center align-items-center bg-secondary text-white" 
       style="width: 40px; height: 40px; flex-shrink: 0;">
    <i class="bi bi-airplane-fill"></i> </div>

  <div>
    <h6 class="mb-0">
      AI 여행 어시스턴트
    </h6>
    <small class="text-muted">
      여행 일정을 수정하거나 장소를 추천받아 보세요.
    </small>
  </div>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages flex-grow-1 mb-3" ref="messagesContainer">
      <div class="message-list">
        <!-- Initial AI Message -->
        <div class="message ai-message mb-3">
          <div class="message-bubble">
            <p class="mb-1" >
              안녕하세요! 저는 당신의 행복한 서울 여행을 위한 AI 어시스턴트입니다.
            </p>
            <p class="mb-0" >
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
              <!-- {{ message.content }} -->
              <div class="markdown-body" v-html="message.content"
              ></div>
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

    <!-- Quick Actions
    <div class="quick-actions mb-3">
      <p class="small text-muted mb-2">
        💡 Quick questions:
      </p>
      <div class="d-flex gap-2 flex-wrap">
        <button @click="sendQuickMessage('I want to start early')" class="btn btn-sm btn-outline-warning rounded-pill">
          Start early
        </button>
        <button @click="sendQuickMessage('Do you have vegetarian options?')"
          class="btn btn-sm btn-outline-warning rounded-pill">
          Vegetarian
        </button>
        <button @click="sendQuickMessage('Recommend me shopping areas')"
          class="btn btn-sm btn-outline-warning rounded-pill">
          Shopping
        </button>
        <button @click="sendQuickMessage('I want to reduce my budget')"
          class="btn btn-sm btn-outline-warning rounded-pill">
          Save budget
        </button>
      </div>
    </div> -->

    <!-- Chat Input -->
    <div class="chat-input-wrapper">
      <div class="chat-input-container">
        
        
        <textarea 
          v-model="currentMessage" 
          @keydown.enter.exact.prevent="sendMessage"
          :disabled="isLoading"
          class="chat-text-input" 
          placeholder="Ask anything..."
          rows="1"
          @input="autoResize"
          ref="textareaRef"
        ></textarea>
        
        <button class="icon-btn voice-btn" title="Voice input">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
            <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
          </svg>
        </button>
        
        <button 
          @click="sendMessage" 
          :disabled="!currentMessage.trim() || isLoading"
          class="icon-btn send-btn"
          title="Send message"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
          </svg>
        </button>
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
const textareaRef = ref(null);
const isLoading = ref(false);

// textarea 자동 리사이즈
const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height =
      Math.min(textareaRef.value.scrollHeight, 150) + "px";
  }
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
    const res = await generateAIResponse(request);

    //  AI 메시지 출력
    chatMessages.value.push({
      id: Date.now() + 1,
      type: "ai",
      content: markdownToHTML(res.data.mainResponse.message),
      timestamp: new Date(),
    });

    //    여기서 payload 추출
    if (res.data.mainResponse.requirePageMove) {
      const payload = res.data.mainResponse.data;
      console.info(JSON.stringify(payload)+"++++++++++++++++++");
      //  store에 저장 → PlannerList에서 watch 중
      chatStore.setLivePlan(payload);

      //  페이지 이동
      router.push(res.data.mainResponse.targetUrl);
    }

    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }, 500);
};

// AI 응답 생성
const generateAIResponse = async (request) => {
  return await chatApi.chat(request);
};

// 스크롤 하단 고정
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop =
      messagesContainer.value.scrollHeight;
  }
};

// 마크다운 문서 HTML 형식으로 변환
const markdownToHTML = (message) => {
  let htmlContent = marked.parse(message);
  return htmlContent;
}

// 외부에서 메시지 주입 (선택)
watch(
  () => chatStore.messageToSend,
  (msg) => {
    if (msg) {
      currentMessage.value = msg;
      sendMessage();
    }
  }
);

onMounted(() => {
  authStore.initializeAuth();
  scrollToBottom();
});
</script>


<style scoped>
/* 전역 또는 레이아웃에 한 번 선언(선택) */
:root {
  --app-header-height: 64px;
  /* 실제 헤더 높이에 맞춰 조정 */
}

/* 기존 .planner-chat 수정 */
/* 1. 전체 컨테이너 설정 */
.planner-chat {
  /* ❌ 기존 position: fixed 관련 속성 모두 제거 */
  /* position: fixed; */
  /* top: 60px; */
  /* left: 0; */
  /* width: 380px; */
  
  /* ✅ 변경: 부모(사이드바)를 가득 채우도록 설정 */
  width: 100%;
  height: 100%; 
  border-radius: 0 !important; /* 사이드바에 딱 붙게 */
  border: none !important; /* 불필요한 테두리 제거 (선택) */
  box-shadow: none !important; /* 사이드바 자체 그림자 사용 권장 */
  
  /* Flexbox 설정 (이미 클래스에 있지만 확실하게 명시) */
  display: flex;
  flex-direction: column;
  background-color: #fff;
  
  /* p-3가 있으면 입력창이 바닥에서 붕 뜹니다. 
     padding은 내부 요소에게 각각 주는 것이 훨씬 깔끔합니다. */
  padding: 0 !important; 
}

/* 2. 헤더: 높이 고정 */
.chat-header {
  flex-shrink: 0; /* 찌그러짐 방지 */
  padding: 1rem 1rem 0.5rem 1rem; /* p-3 대신 여기서 패딩 조절 */
}

/* 3. 메시지 영역: 남는 공간 모두 차지 (핵심!) */
.chat-messages {
  flex-grow: 1;      /* 남은 높이를 다 먹음 */
  overflow-y: auto;  /* 내용 넘치면 스크롤 */
  min-height: 0;     /* Flexbox 스크롤 버그 방지 */
  padding: 0 1rem;   /* 좌우 여백 */
}

/* 4. 퀵 액션 버튼들 */
.quick-actions {
  flex-shrink: 0;
  padding: 0 1rem;
}

/* 5. 입력창 영역: 바닥 고정 */
.chat-input-wrapper {
  flex-shrink: 0;    /* 절대 줄어들지 않음 */
  background: white;
  padding: 1rem;     /* 입력창 주변 여백 */
  border-top: 1px solid #e9ecef;
  
  /* (선택) 입력창이 떠있는 느낌을 주려면 그림자 추가 */
  /* box-shadow: 0 -4px 12px rgba(0,0,0,0.03); */
}
/* 메시지 버블 등 나머지 스타일은 그대로 두시면 됩니다 */
.message {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ai-message { align-items: flex-start; }
.ai-message .message-bubble {
  background: #f9fafc;
  color: #2c3e50;
  border: 1px solid #e9ecef;
  border-radius: 18px 18px 18px 4px;
  max-width: 85%;
  white-space: pre-line;
}
.user-message { align-items: flex-end; }
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
  white-space: normal !important;
  overflow: hidden;
}

/* 입력창 내부 스타일 */
.chat-input-container {
  display: flex;
  align-items: flex-end; /* 텍스트가 여러 줄일 때 아이콘은 아래에 유지 */
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 24px;
  transition: all 0.2s ease;
}
.chat-input-container:focus-within {
  border-color: #1B3B6F; /* 포커스 색상 변경 (테마 컬러) */
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.chat-text-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.95rem;
  color: #495057;
  padding: 0.25rem 0.5rem;
  resize: none;
  overflow-y: auto;
  min-height: 24px;
  max-height: 150px;
  line-height: 1.5;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 1.2rem !important; /* 최소한의 indent */
  margin-bottom: 5px !important;
}

.markdown-body ol li {
  margin-bottom: 100px !important;
}

.markdown-body li {
  margin: 2px 0 !important; /* 좁게 관리 */
}


/* 타이핑 인디케이터 */
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

  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }

  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 빠른 액션 버튼 커스텀만 */
.quick-actions .btn {
  font-size: 12px;
  padding: 4px 12px;
  border-width: 1px;
  transition: all 0.2s;
}

.quick-actions .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 채팅 입력 영역 - 사진과 동일한 디자인 */
.chat-input-wrapper {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  background: white;
}

.chat-input-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 24px;
  transition: all 0.2s ease;
}

.chat-input-container:focus-within {
  border-color: #adb5bd;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chat-text-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.95rem;
  color: #495057;
  padding: 0.25rem 0.5rem;
  resize: none;
  overflow-y: auto;
  min-height: 24px;
  max-height: 150px;
  line-height: 1.5;
}

.chat-text-input::placeholder {
  color: #adb5bd;
}

.chat-text-input::-webkit-scrollbar {
  width: 4px;
}

.chat-text-input::-webkit-scrollbar-track {
  background: transparent;
}

.chat-text-input::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.chat-text-input::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: #6c757d;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.icon-btn:hover:not(:disabled) {
  background: #e9ecef;
  color: #495057;
}

.send-btn {
  background: #1B3B6F;
  color: white;
}

.send-btn:hover:not(:disabled) {
  background: #152f59;
}

.send-btn:disabled {
  background: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

/* 커스텀 스크롤바 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.bg-success-soft {
  background-color: #d1edff !important;
}

/* Loading Spinner */
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
</style>