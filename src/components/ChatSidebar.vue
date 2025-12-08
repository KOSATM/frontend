<template>
  <section class="planner-chat card shadow-sm p-3 d-flex flex-column">
    <!-- Header -->
    <div class="chat-header d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
      <div class="badge text-white rounded-circle d-flex justify-content-center align-items-center"
        style="width: 32px; height: 32px; background-color: #ff8c00;">
        ✈
      </div>
      <div>
        <h6 class="mb-0" style="font-family: 'Siganpyo', sans-serif">
          AI Travel Assistant
        </h6>
        <!-- <small class="text-muted" style="font-family: 'Kyobo2024', sans-serif">AI Travel Assistant</small> -->
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages flex-grow-1 mb-3" ref="messagesContainer">
      <div class="message-list">
        <!-- Initial AI Message -->
        <div class="message ai-message mb-3">
          <div class="message-bubble">
            <p class="mb-1" style="font-family: 'Kyobo2024', sans-serif">
              Hello! I'm your AI assistant for planning your Seoul plan. 🇰🇷
            </p>
            <p class="mb-0" style="font-family: 'Kyobo2024', sans-serif">
              Ask me about itinerary changes, food recommendations, or new
              activities!
            </p>
          </div>
        </div>

        <!-- Dynamic Messages -->
        <div v-for="message in chatMessages" :key="message.id" class="message mb-3" :class="{
          'user-message': message.type === 'user',
          'ai-message': message.type === 'ai',
        }">
          <div class="message-bubble">
            <p class="mb-0" style="font-family: 'Kyobo2024', sans-serif">
              {{ message.content }}
            </p>
            <div v-if="message.type === 'ai' && message.loading" class="typing-indicator mt-2">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
        
        <!-- Loading Spinner -->
        <div v-if="isLoading" class="message ai-message mb-3">
          <div class="message-bubble loading-bubble">
            <div class="spinner-container">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <span class="ms-2 text-muted" style="font-family: 'Kyobo2024', sans-serif">AI is thinking...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions mb-3">
      <p class="small text-muted mb-2" style="font-family: 'Kyobo2024', sans-serif">
        💡 Quick questions:
      </p>
      <div class="d-flex gap-2 flex-wrap">
        <button @click="sendQuickMessage('I want to start early')" class="btn btn-sm btn-outline-warning rounded-pill"
          style="font-family: 'Siganpyo', sans-serif">
          Start early
        </button>
        <button @click="sendQuickMessage('Do you have vegetarian options?')"
          class="btn btn-sm btn-outline-warning rounded-pill" style="font-family: 'Siganpyo', sans-serif">
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
    </div>

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

const authStore = useAuthStore();

const currentMessage = ref("");
const chatMessages = ref([]);
const messagesContainer = ref(null);
const textareaRef = ref(null);
const isLoading = ref(false);

const chatStore = useChatStore();

// 텍스트 영역 자동 높이 조절
const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 150) + 'px';
  }
};

const demoResponses = {
  early:
    "Nice! We can start around 8:00 AM at Gyeongbokgung and catch the guard-changing ceremony.",
  vegetarian:
    "You can try “Sanchon” in Insadong for temple food, or “Plant” in Hongdae for vegan dishes.",
  shopping:
    "Myeongdong → Hongdae → Seongsu is a good route for shopping and cafes.",
  budget:
    "You can use a 1-day transportation pass and a palace combo ticket to save money.",
  default:
    "Tell me a bit more about what you want, and I’ll organize the plan for you 🙂",
};

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return;

  const userMessage = {
    id: Date.now(),
    type: "user",
    content: currentMessage.value,
    timestamp: new Date(),
  };

  console.log(userMessage);

  const request = {
    userId: 1,
    message: currentMessage.value
  }

  chatMessages.value.push(userMessage);

  const toProcess = currentMessage.value;
  currentMessage.value = "";
  
  // 텍스트 영역 높이 초기화
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }
  
  isLoading.value = true;

  await nextTick();
  scrollToBottom();

  setTimeout(async () => {
    const aiText = await generateAIResponse(toProcess);
    chatMessages.value.push({
      id: Date.now() + 1,
      type: "ai",
      content: aiText.data.mainResponse.message,
      timestamp: new Date(),
    });
    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }, 900);
};

const sendQuickMessage = (text) => {
  currentMessage.value = text;
  sendMessage();
};

const generateAIResponse = async (text) => {
  const low = text.toLowerCase();
  if (low.includes("early")) return demoResponses.early;
  if (low.includes("vegetarian")) return demoResponses.vegetarian;
  if (low.includes("shopping")) return demoResponses.shopping;
  if (low.includes("budget") || low.includes("reduce"))
    return demoResponses.budget;
  const res = await chatApi.chat(text, authStore.userId);
  console.log(res);
  return res;
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

onMounted(async () => {
  scrollToBottom();
  authStore.initializeAuth();
});

watch(
  () => chatStore.messageToSend,
  (msg) => {
    if (msg) {
      console.log("Sending message:", msg);
      currentMessage.value = msg;
      sendMessage();
    }
  }
)
</script>

<style scoped>
/* 전역 또는 레이아웃에 한 번 선언(선택) */
:root {
  --app-header-height: 64px;
  /* 실제 헤더 높이에 맞춰 조정 */
}

/* 기존 .planner-chat 수정 */
.planner-chat {
  position: fixed;
  top: 60px;
  left: 0;
  width: 380px;
  height: calc(100vh - 60px);
  /* 앱헤더 높이(60px)만 제외하고 상하 꽉 채움 */
  z-index: 10;
  overflow: hidden;
  border-radius: 0 !important;
  /* 각지게 만들기 */
}

/* 폰트 스타일 */
.planner-chat h1,
.planner-chat h2,
.planner-chat h3,
.planner-chat h4,
.planner-chat h5,
.planner-chat h6 {
  font-family: "Siganpyo", sans-serif;
}

.planner-chat p,
.planner-chat .small,
.planner-chat .message-bubble {
  font-family: "Kyobo2024", sans-serif;
}

.planner-chat .btn {
  font-family: "Siganpyo", sans-serif;
}

.chat-messages {
  overflow-y: auto;
  padding-right: 8px;
  min-height: 0;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 메시지 버블 커스텀 스타일만 */
.ai-message {
  align-items: flex-start;
}

.ai-message .message-bubble {
  background: #f9fafc;
  color: #2c3e50;
  border: 1px solid #e9ecef;
  border-radius: 18px 18px 18px 4px;
  max-width: 85%;
  white-space: pre-line;   /* \n 을 실제 줄바꿈으로 렌더링 */
}

.user-message {
  align-items: flex-end;
}

.user-message .message-bubble {
  background: #ff8c00;
  color: white;
  border-radius: 18px 18px 4px 18px;
  max-width: 80%;
}

.message-bubble {
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  line-height: 1.4;
}

.message-bubble p {
  line-height: 1.4;
  margin-bottom: 0;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
}

.user-message .message-time {
  text-align: right;
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
  font-family: 'Kyobo2024', sans-serif;
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
</style>
