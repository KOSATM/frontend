<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h5>✍️ Select Caption Style</h5>
      <p class="text-muted">Choose your preferred AI-generated caption style</p>

      <div v-for="style in captionStyles" :key="style.id"
        class="caption-card"
        :class="{ active: selectedStyle === style.id }"
        @click="selectStyle(style)">
        <span class="caption-label" :class="style.labelClass">{{ style.label }}</span>
        <p class="caption-text">{{ style.text }}</p>
      </div>

      <div class="btn-area">
        <button class="btn-close" @click="$emit('close')">Done</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useReviewStore } from '@/store/reviewStore'
const reviewStore = useReviewStore()
const selectedStyle = ref(null)

const captionStyles = [
  { id: 'poetic', label: 'Poetic', text: '🌊 Lost in the endless blue...', labelClass: 'poetic' },
  { id: 'casual', label: 'Casual', text: 'Living my best island life...', labelClass: 'casual' },
  { id: 'inspirational', label: 'Inspirational', text: 'Sometimes you need to escape...', labelClass: 'inspirational' },
  { id: 'fun', label: 'Fun & Playful', text: 'Jeju mode: ON 🏖️💃', labelClass: 'fun' },
]
const selectStyle = (style) => {
  selectedStyle.value = style.id
  reviewStore.setCaption(style.text) // ✅ Pinia에 직접 저장
}
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-content { background: #fffaf3; padding: 1.5rem; border-radius: 1rem; width: 90%; max-width: 600px; max-height: 80vh; overflow-y: auto; }
.caption-card { background: white; border-radius: 1rem; border: 2px solid transparent; padding: 1rem; margin-bottom: .75rem; cursor: pointer; transition: .2s; }
.caption-card.active { border-color: #ff8c00; background: #fff8ef; }
.caption-label.poetic { background: #e7d7ff; color: #6a1b9a; padding: .2rem .5rem; border-radius: .5rem; }
.caption-label.casual { background: #fff0c2; color: #d9822b; padding: .2rem .5rem; border-radius: .5rem; }
.caption-label.inspirational { background: #d8f3dc; color: #2b7a0b; padding: .2rem .5rem; border-radius: .5rem; }
.caption-label.fun { background: #ffdce0; color: #c2185b; padding: .2rem .5rem; border-radius: .5rem; }
.btn-close { background: #1b3b6f; color: white; border: none; padding: .6rem 1.2rem; border-radius: .8rem; margin-top: 1rem; float: right; }
</style>
