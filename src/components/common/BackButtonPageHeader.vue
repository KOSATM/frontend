<!-- 컴포넌트의 UI -->
<template>
    <div class="backbtnpage-header d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center">
            <i v-if="showBack" class="bi bi-arrow-left-short back-icon" @click="onBackClick"></i>
            <div>
                <h6 class="backbtnpage-title mb-0">{{ title }}</h6>
                <small class="backbtnpage-subtitle text-muted">{{ subtitle }}</small>
            </div>
        </div>
    </div>
</template>

<!-- 컴포넌트의 초기화 또는 이벤트 처리 -->
<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    showBack: { type: Boolean, default: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }
})

const emit = defineEmits(['back'])
const router = useRouter()

const onBackClick = () => {
    emit('back')
    router.go(-1)
}
</script>

<!-- 컴포넌트 스타일 정의 -->
<style scoped>
.backbtnpage-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-bottom: 0.75rem;
}

.back-icon {
    font-size: 1.6rem;
    cursor: pointer;
    color: #ff8c00;
    margin-right: 0.5rem;
    transition: transform 0.2s;
}

.back-icon:hover {
    transform: translateX(-2px);
}

.backbtnpage-title {
    font-weight: 700;
    color: #1b3b6f;
}

.backbtnpage-subtitle {
    font-size: 0.9rem;
}
</style>