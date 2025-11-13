<!-- 컴포넌트의 UI -->
<template>
    <div class="upload-section mb-4">
        <h6 class="upload-title mb-1">
            <i :class="icon + ' me-1 text-primary'"></i>
            {{ title }}
        </h6>
        <p class="upload-subtitle">{{ subtitle }}</p>

        <div class="upload-content">
            <slot></slot>
        </div>
    </div>
</template>

<!-- 컴포넌트의 초기화 또는 이벤트 처리 -->
<script setup>
defineProps({
    title: String,
    subtitle: String,
    icon: String
})
</script>

<!-- 컴포넌트 스타일 정의 -->
<style scoped>
/* 업로드 영역 (섹션) */
.upload-section {
    background-color: #f9fafc;
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid #eee;
    margin-bottom: 1.5rem;
}

.upload-title {
    font-weight: 700;
    color: #1b3b6f;
    margin-bottom: 0.5rem;
}

.upload-subtitle {
    color: #6c757d;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}
</style>