<template>
    <div>
        <label v-if="label" class="form-label mb-3">{{ label }}</label>

        <div class="row g-3">
            <div class="col-6" v-for="item in items" :key="item.id">
                <div class="item d-flex align-items-center h-100" :class="{ active: modelValue.includes(item.id) }"
                    @click="toggle(item.id)">
                    <i :class="item.icon + ' me-2'"></i>
                    <span class="text-truncate">{{ item.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label: { type: String, default: '' },
    items: { type: Array, required: true },
    modelValue: { type: Array, required: true }
})

const emit = defineEmits(['update:modelValue'])

const toggle = (id) => {
    const selected = [...props.modelValue]

    const idx = selected.indexOf(id)

    if (idx > -1) {
        selected.splice(idx, 1)
    } else {
        selected.push(id)
    }

    emit('update:modelValue', selected)
}
</script>

<style scoped>
.form-label {
    color: #1b3b6f;
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
}

/* === interest-tag 스타일을 item에 그대로 적용 === */
.item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border: 1px solid #d0d5dd;
    border-radius: 0.75rem;
    background: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    min-width: fit-content;
}

.item:hover {
    border-color: #ff8c00;
    background-color: #fef8f2;
}

.item.active {
    border-color: #ff8c00;
    background-color: #ff8c00;
    color: white;
}

.item i {
    font-size: 1rem;
}
</style>
