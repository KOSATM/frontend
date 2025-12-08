import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    messageToSend: null,

    // 채팅으로 생성된 최신 여행 플랜
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
      this.livePlanFromChat = payload;
    },

    clearLivePlan() {
      this.livePlanFromChat = null;
    },
  },
});
