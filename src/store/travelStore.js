import { defineStore } from 'pinia'

export const useTravelStore = defineStore('travel', {
  state: () => ({
    isTraveling: false,   // 여행 중 여부
    planStep: 0,
    planId: null,         // 여행 계획 ID
    dayIndex: null,       // 현재 일차 인덱스
    planDate: null        // 현재 여행 날짜
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
    },
    // 여행 계획 정보 설정
    setPlanInfo(planId, dayIndex, planDate) {
      this.planId = planId
      this.dayIndex = dayIndex
      this.planDate = planDate
    },
    // 여행 정보 초기화
    clearPlanInfo() {
      this.planId = null
      this.dayIndex = null
      this.planDate = null
    }
  }
})