import { defineStore } from 'pinia'

export const useTravelStore = defineStore('travel', {
  state: () => ({
    isTraveling: false,   // 여행 중 여부
    planStep: 0
  }),
  actions: {
    startTravel() {
      this.isTraveling = true
    },
    endTravel() {
      this.isTraveling = false
    },
    increaseStep() {
      this.planStep++
    },
    decreaseStep() {
      this.planStep--
    },
    resetStep() {
      this.planStep = 0
    }
  }
})
