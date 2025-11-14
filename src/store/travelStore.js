import { defineStore } from 'pinia'

export const useTravelStore = defineStore('travel', {
  state: () => ({
    isTraveling: false,   // 여행 중 여부
  }),
  actions: {
    startTravel() {
      this.isTraveling = true
    },
    endTravel() {
      this.isTraveling = false
    }
  }
})
