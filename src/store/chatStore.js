// src/store/chatStore.js
import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    messageToSend: null,

    // 채팅으로 생성된 최신 여행 플랜 + 변경 시간
    livePlanFromChat: null,
  }),

  actions: {
    sendMessage(msg) {
      this.messageToSend = msg;
    },

    clearMessage() {
      this.messageToSend = null;
    },

    setLivePlan(payload) {
      console.log("✅ [chatStore] setLivePlan 호출, payload:", payload);

      // 항상 “새 객체”로 교체 + 시간 포함
      this.livePlanFromChat = {
        data: JSON.parse(JSON.stringify(payload)),
        updatedAt: Date.now(),
      };

      console.log(
        "✅ [chatStore] livePlanFromChat 갱신:",
        this.livePlanFromChat
      );
    },

    clearLivePlan() {
      this.livePlanFromChat = null;
    },
  },
});
