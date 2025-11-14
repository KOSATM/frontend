<template>
  <section class="planner-chat card shadow-sm rounded-4 p-3 d-flex flex-column">
    <!-- Header -->
    <div
      class="chat-header d-flex align-items-center gap-2 mb-3 pb-2 border-bottom"
    >
      <div
        class="badge bg-warning text-white rounded-circle d-flex justify-content-center align-items-center"
        style="width: 32px; height: 32px"
      >
        ✈
      </div>
      <div>
        <h6 class="mb-0" style="font-family: 'Siganpyo', sans-serif">
          Seoul Journey
        </h6>
        <small class="text-muted" style="font-family: 'Kyobo2024', sans-serif"
          >AI Travel Assistant</small
        >
      </div>
      <div class="ms-auto">
        <span class="badge bg-success-soft text-success small">Online</span>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages flex-grow-1 mb-3" ref="messagesContainer">
      <div class="message-list">
        <!-- Initial AI Message -->
        <div class="message ai-message mb-3">
          <div class="message-bubble">
            <p class="mb-1" style="font-family: 'Kyobo2024', sans-serif">
              Hello! I'm your AI assistant for planning your Seoul trip. 🇰🇷
            </p>
            <p class="mb-0" style="font-family: 'Kyobo2024', sans-serif">
              Ask me about itinerary changes, food recommendations, or new
              activities!
            </p>
          </div>
          <small class="message-time text-muted">{{
            formatTime(new Date())
          }}</small>
        </div>

        <!-- Dynamic Messages -->
        <div
          v-for="message in chatMessages"
          :key="message.id"
          class="message mb-3"
          :class="{
            'user-message': message.type === 'user',
            'ai-message': message.type === 'ai',
          }"
        >
          <div class="message-bubble">
            <p class="mb-0" style="font-family: 'Kyobo2024', sans-serif">
              {{ message.content }}
            </p>
            <div
              v-if="message.type === 'ai' && message.loading"
              class="typing-indicator mt-2"
            >
              <span></span><span></span><span></span>
            </div>
          </div>
          <small class="message-time text-muted">{{
            formatTime(message.timestamp)
          }}</small>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions mb-3">
      <p
        class="small text-muted mb-2"
        style="font-family: 'Kyobo2024', sans-serif"
      >
        💡 Quick questions:
      </p>
      <div class="d-flex gap-2 flex-wrap">
        <button
          @click="sendQuickMessage('I want to start early')"
          class="btn btn-sm btn-outline-warning rounded-pill"
          style="font-family: 'Siganpyo', sans-serif"
        >
          Start early
        </button>
        <button
          @click="sendQuickMessage('Do you have vegetarian options?')"
          class="btn btn-sm btn-outline-warning rounded-pill"
          style="font-family: 'Siganpyo', sans-serif"
        >
          Vegetarian
        </button>
        <button
          @click="sendQuickMessage('Recommend me shopping areas')"
          class="btn btn-sm btn-outline-warning rounded-pill"
        >
          Shopping
        </button>
        <button
          @click="sendQuickMessage('I want to reduce my budget')"
          class="btn btn-sm btn-outline-warning rounded-pill"
        >
          Save budget
        </button>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="chat-input">
      <div class="input-group">
        <input
          type="text"
          v-model="currentMessage"
          @keyup.enter="sendMessage"
          :disabled="isLoading"
          class="form-control form-control-sm rounded-start-pill"
          placeholder="Type your message..."
        />
        <button
          @click="sendMessage"
          :disabled="!currentMessage.trim() || isLoading"
          class="btn btn-warning rounded-end-pill text-white"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
          ></span>
          <span v-else>➤</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";

const currentMessage = ref("");
const chatMessages = ref([]);
const messagesContainer = ref(null);
const isLoading = ref(false);

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
  chatMessages.value.push(userMessage);

  const toProcess = currentMessage.value;
  currentMessage.value = "";
  isLoading.value = true;

  await nextTick();
  scrollToBottom();

  setTimeout(async () => {
    const aiText = generateAIResponse(toProcess);
    chatMessages.value.push({
      id: Date.now() + 1,
      type: "ai",
      content: aiText,
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

const generateAIResponse = (text) => {
  const low = text.toLowerCase();
  if (low.includes("early")) return demoResponses.early;
  if (low.includes("vegetarian")) return demoResponses.vegetarian;
  if (low.includes("shopping")) return demoResponses.shopping;
  if (low.includes("budget") || low.includes("reduce"))
    return demoResponses.budget;
  return demoResponses.default;
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

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
/* 전역 또는 레이아웃에 한 번 선언(선택) */
:root {
  --app-header-height: 64px; /* 실제 헤더 높이에 맞춰 조정 */
}

/* 기존 .planner-chat 수정 */
.planner-chat {
  position: sticky;
  top: var(--app-header-height, 64px); /* 헤더 아래에서 고정 */
  height: calc(80vh - var(--app-header-height, 64px)); /* 높이 보정(선택) */
  z-index: 10;
  overflow: hidden;
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
  background: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #e9ecef;
  border-radius: 18px 18px 18px 4px;
  max-width: 85%;
}

.user-message {
  align-items: flex-end;
}
.user-message .message-bubble {
  background: linear-gradient(135deg, #28a745, #20c997);
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

/* 채팅 입력 커스텀 */
.chat-input .form-control {
  border-right: none;
  border-radius: 50rem 0 0 50rem;
}

.chat-input .btn {
  border-left: none;
  padding: 0.375rem 1rem;
  border-radius: 0 50rem 50rem 0;
}

.chat-input .btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.4);
}

.chat-input .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
</style>
