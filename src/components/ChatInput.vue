<template>
  <div class="chat-input-fixed">
    <div class="chat-input-wrapper" ref="wrapperRef">
      <div class="chat-input-container">
        <textarea 
          :value="modelValue" 
          @input="$emit('update:modelValue', $event.target.value); handleInput()"
          @keydown.enter.exact.prevent="$emit('send-message')"
          :disabled="isLoading"
          class="chat-text-input" 
          placeholder="Ask anything..."
          rows="1"
          ref="textareaRef"
        ></textarea>
        
        <button class="icon-btn voice-btn" title="Voice input">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
            <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
          </svg>
        </button>
        
        <button 
          @click="handleSend" 
          :disabled="!modelValue.trim() || isLoading"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

defineProps({
  modelValue: { type: String, required: true },
  isLoading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "send-message"]);

const textareaRef = ref(null);
const wrapperRef = ref(null);

const handleSend = () => {
  emit("send-message");
};

const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 150) + "px";
  }
};

const handleInput = () => {
  autoResize();
};

onMounted(() => {
  autoResize();
});

defineExpose({ autoResize });
</script>

<style scoped>
.chat-input-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 100%);
  border-top: 1px solid #e9ecef;
  z-index: 100;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.chat-input-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.chat-input-container {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 24px;
  transition: all 0.2s ease;
}

.chat-input-container:focus-within {
  border-color: #1B3B6F;
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
  font-family: inherit;
}

.chat-text-input::placeholder {
  color: #adb5bd;
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
  padding: 0;
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
</style>
