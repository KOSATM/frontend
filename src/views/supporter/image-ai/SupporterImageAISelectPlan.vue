<template>
  <div class="p-4">
    <PageHeader title="Image-based Travel AI" subtitle="Use AI recommendation" />

    <div class="card p-4 mt-3 history-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">How would you like to use this?</h5>
        <router-link class="btn btn-sm btn-outline-primary" :to="{ name: 'SupporterImageAINew' }">New Search</router-link>
      </div>

      <div class="selected-place card p-3 mb-3 d-flex align-items-center">
        <img :src="item.thumb" class="thumb me-3" />
        <div>
          <div class="fw-medium">{{ item.name }}</div>
          <div class="small text-muted">{{ item.desc }}</div>
        </div>
        <div class="ms-auto small text-muted">{{ item.distance }}</div>
      </div>

      <ul class="list-unstyled">
        <li
          class="option p-3 mb-2 rounded d-flex align-items-center"
          :class="{ selected: selectedOption === 'add' }"
          @click="selectOption('add')"
          @keyup.enter.space.prevent="selectOption('add')"
          role="button"
          tabindex="0"
          :aria-pressed="selectedOption === 'add'"
        >
          <div class="icon add me-3">＋</div>
          <div class="flex-fill">
            <div class="fw-medium">Add to Itinerary</div>
            <div class="small text-muted">Add this place to your travel schedule</div>
          </div>

          <div v-if="selectedOption === 'add'" class="select-check" aria-hidden="true">✓</div>
        </li>

        <li
          class="option p-3 mb-2 rounded d-flex align-items-center"
          :class="{ selected: selectedOption === 'replace' }"
          @click="selectOption('replace')"
          @keyup.enter.space.prevent="selectOption('replace')"
          role="button"
          tabindex="0"
          :aria-pressed="selectedOption === 'replace'"
        >
          <div class="icon replace me-3">↺</div>
          <div class="flex-fill">
            <div class="fw-medium">Replace Existing</div>
            <div class="small text-muted">Replace an existing schedule item</div>
          </div>

          <div v-if="selectedOption === 'replace'" class="select-check" aria-hidden="true">✓</div>
        </li>

        <li
          class="option p-3 mb-2 rounded d-flex align-items-center"
          :class="{ selected: selectedOption === 'save' }"
          @click="selectOption('save')"
          @keyup.enter.space.prevent="selectOption('save')"
          role="button"
          tabindex="0"
          :aria-pressed="selectedOption === 'save'"
        >
          <div class="icon save me-3">💾</div>
          <div class="flex-fill">
            <div class="fw-medium">Save Only</div>
            <div class="small text-muted">Save for later without adding to schedule</div>
          </div>

          <div v-if="selectedOption === 'save'" class="select-check" aria-hidden="true">✓</div>
        </li>
      </ul>

      <div class="d-flex mt-3">
        <router-link class="btn btn-link" :to="{ name: 'SupporterImageAIResults' }">Back</router-link>
        <button class="btn btn-primary ms-auto" :disabled="!selectedOption" @click="confirm">
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'

const route = useRoute()
const router = useRouter()

// item passed from previous route.state (fallback to query or sample)
const item = route?.state?.item || {
  id: route?.query?.itemId || 0,
  name: route?.query?.itemName || 'Unknown Place',
  desc: '',
  distance: '',
  thumb: '/sample/placeholder1.jpg'
}

// UI selection state (like Recommend view)
const selectedOption = ref(null)

const selectOption = (k) => {
  selectedOption.value = selectedOption.value === k ? null : k
}

// Confirm: navigate based on selection (only when user confirms)
const confirm = () => {
  if (!selectedOption.value) return

  if (selectedOption.value === 'add' || selectedOption.value === 'replace') {
    // pass both state and query for reliability; ChoicePlan will fallback to query if needed
    router.push({
      name: 'SupporterImageAIChoicePlan',
      state: { item, mode: selectedOption.value },
      query: { mode: selectedOption.value, itemId: item?.id ?? '', itemName: item?.name ?? '' }
    })
    return
  }

  // save only -> go to history (placeholder)
  if (selectedOption.value === 'save') {
    router.push({ name: 'SupporterImageAIHistory' })
  }
}
</script>

<style scoped>
.history-card { background: #FFD9A6; border-radius:12px; }
.selected-place { border-radius:10px; background:#fff; border:1px solid #f3e8ff; }
.thumb { width:72px; height:72px; object-fit:cover; border-radius:8px; }
.option { background:#fff; border:1px solid #f3e8ff; cursor:pointer; transition: box-shadow .12s, transform .08s; position:relative; }
.option.selected { border-color: #1b3b6f; background:#f3f7ff; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(27,59,111,0.06); }
.option .icon { width:48px;height:48px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:#f7f7ff;color:#6b46ff;font-weight:700;font-size:18px; }
.option:hover { box-shadow: 0 8px 20px rgba(167,139,255,0.06); transform: translateY(-2px); }

/* select check (right side) - reuse Recommend style */
.select-check {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: #1b3b6f;
  color: #fff;
  width:36px;
  height:36px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  box-shadow: 0 6px 18px rgba(27,59,111,0.12);
  border: 2px solid rgba(255,255,255,0.6);
}

button:disabled { opacity:0.6; cursor:not-allowed; }
.card { border-radius:12px; }
</style>