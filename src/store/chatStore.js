import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messageToSend: null,
  }),
  actions: {
    sendMessage(msg) {
      this.messageToSend = msg
    }
  }
})
