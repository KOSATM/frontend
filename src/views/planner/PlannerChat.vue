<template>
  <section class="planner-chat card shadow-sm rounded-4 p-3 h-100 d-flex flex-column">
    <!-- Header -->
    <div class="chat-header d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
      <div class="badge bg-warning text-white rounded-circle d-flex justify-content-center align-items-center" style="width: 32px; height: 32px">✈</div>
      <div>
        <h6 class="mb-0">Seoul Journey</h6>
        <small class="text-muted">AI Travel Assistant</small>
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
            <p class="mb-1">안녕하세요! 서울 여행 계획을 도와드리는 AI 어시스턴트입니다. 🇰🇷</p>
            <p class="mb-0">일정 변경, 맛집 추천, 새로운 액티비티 추가 등 무엇이든 물어보세요!</p>
          </div>
          <small class="message-time text-muted">{{ formatTime(new Date()) }}</small>
        </div>

        <!-- Dynamic Messages -->
        <div
          v-for="message in chatMessages"
          :key="message.id"
          class="message mb-3"
          :class="{ 'user-message': message.type === 'user', 'ai-message': message.type === 'ai' }"
        >
          <div class="message-bubble">
            <p class="mb-0">{{ message.content }}</p>
            <div v-if="message.type === 'ai' && message.loading" class="typing-indicator mt-2"><span></span><span></span><span></span></div>
          </div>
          <small class="message-time text-muted">{{ formatTime(message.timestamp) }}</small>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions mb-3">
      <p class="small text-muted mb-2">💡 빠른 질문:</p>
      <div class="d-flex gap-2 flex-wrap">
        <button @click="sendQuickMessage('일찍 시작하고 싶어요')" class="btn btn-sm btn-outline-warning rounded-pill">일찍 시작</button>
        <button @click="sendQuickMessage('채식주의자 옵션 있나요?')" class="btn btn-sm btn-outline-warning rounded-pill">채식 옵션</button>
        <button @click="sendQuickMessage('쇼핑 장소 추천해주세요')" class="btn btn-sm btn-outline-warning rounded-pill">쇼핑 추천</button>
        <button @click="sendQuickMessage('예산을 줄이고 싶어요')" class="btn btn-sm btn-outline-warning rounded-pill">예산 절약</button>
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
          placeholder="메시지를 입력하세요..."
        />
        <button @click="sendMessage" :disabled="!currentMessage.trim() || isLoading" class="btn btn-warning rounded-end-pill text-white">
          <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
          <span v-else>➤</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";

// 반응형 데이터
const currentMessage = ref("");
const chatMessages = ref([]);
const messagesContainer = ref(null);
const isLoading = ref(false);

// 데모 응답 데이터
const demoResponses = {
  일찍: "아침 일찍 시작하시는군요! 오전 8시에 경복궁에서 시작해서 수문장 교대식을 보시는 건 어떨까요? 관광객이 적어서 더 여유롭게 구경하실 수 있어요.",
  채식: '서울에는 훌륭한 채식 옵션들이 많아요! 인사동의 "산촌" 같은 전통 사찰음식점이나, 홍대의 "Plant" 같은 모던 비건 레스토랑을 추천드려요.',
  쇼핑: "쇼핑 좋아하시는군요! 명동은 기본이고, 홍대 걷고싶은거리, 강남 가로수길, 그리고 최신 트렌드를 원하시면 성수동 서울숲길을 추천해요!",
  예산: "예산 절약 팁을 알려드릴게요! 궁궐 통합권(10,000원)을 사면 4곳 궁궐을 모두 볼 수 있고, 지하철 1일권(8,000원)으로 대중교통을 무제한 이용하세요.",
  맛집: "서울 맛집 추천해드릴게요! 전통음식은 광장시장 빈대떡, 현대식은 강남 스시 오마카세, 간식은 명동 호떡을 꼭 드세요!",
  호텔: "숙소 추천해드려요! 명동은 관광지 접근성이 좋고, 홍대는 젊은 분위기, 강남은 고급스러운 느낌이에요. 어떤 분위기를 선호하시나요?",
  교통: "서울 대중교통 가이드를 알려드려요! T-money 카드로 지하철과 버스를 편리하게 이용하세요. 배차간격이 짧아서 대기시간도 적어요.",
  날씨: "서울 날씨에 맞는 옷차림을 추천해드려요! 11월은 쌀쌀해지는 시기라 가벼운 패딩이나 두꺼운 코트를 준비하시는 게 좋겠어요.",
  default: "죄송하지만 현재 데모 버전이라 제한적인 답변만 가능해요. 실제 서비스에서는 더 자세하고 개인화된 여행 조언을 제공할 예정입니다! ✈️",
};

// 메시지 전송
const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return;

  const userMessage = {
    id: Date.now(),
    type: "user",
    content: currentMessage.value,
    timestamp: new Date(),
  };

  chatMessages.value.push(userMessage);

  const messageToProcess = currentMessage.value;
  currentMessage.value = "";
  isLoading.value = true;

  // 스크롤 하단으로
  await nextTick();
  scrollToBottom();

  // AI 응답 시뮬레이션
  setTimeout(async () => {
    const aiResponse = generateAIResponse(messageToProcess);

    const aiMessage = {
      id: Date.now() + 1,
      type: "ai",
      content: aiResponse,
      timestamp: new Date(),
    };

    chatMessages.value.push(aiMessage);
    isLoading.value = false;

    await nextTick();
    scrollToBottom();
  }, 1000 + Math.random() * 1000); // 1-2초 랜덤 딜레이
};

// 빠른 메시지 전송
const sendQuickMessage = (message) => {
  currentMessage.value = message;
  sendMessage();
};

// AI 응답 생성
const generateAIResponse = (userMessage) => {
  const message = userMessage.toLowerCase();

  // 키워드 매칭
  for (const [keyword, response] of Object.entries(demoResponses)) {
    if (keyword !== "default" && message.includes(keyword)) {
      return response;
    }
  }

  // 패턴 매칭
  if (message.includes("추천") || message.includes("어디")) {
    return "구체적으로 어떤 종류의 추천을 원하시나요? 맛집, 관광지, 쇼핑, 액티비티 중에서 말씀해주세요!";
  }

  if (message.includes("시간") || message.includes("언제")) {
    return "시간 관련 질문이시군요! 오전/오후 선호도나 구체적인 희망 시간대를 알려주시면 더 정확한 조언을 드릴 수 있어요.";
  }

  if (message.includes("비용") || message.includes("돈") || message.includes("가격")) {
    return "비용 관련 정보를 원하시는군요! 예산 범위를 알려주시면 그에 맞는 옵션들을 추천해드릴게요.";
  }

  return demoResponses.default;
};

// 시간 포맷팅
const formatTime = (date) => {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// 스크롤 하단으로
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.planner-chat {
  background: #fff;
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 10;
}

.chat-messages {
  overflow-y: auto;
  padding-right: 8px;
}

.message-list {
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  flex-direction: column;
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

.ai-message .message-bubble {
  background: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #e9ecef;
  border-radius: 18px 18px 18px 4px;
  max-width: 85%;
}

.message-bubble {
  padding: 12px 16px;
  margin-bottom: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-bubble p {
  line-height: 1.4;
  font-size: 14px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
}

.user-message .message-time {
  text-align: right;
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

.chat-input .form-control {
  border-right: none;
}

.chat-input .btn {
  border-left: none;
  padding: 0.375rem 1rem;
}

.chat-input .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.text-success {
  color: #28a745 !important;
}
</style>
