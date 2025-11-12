<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h5>🏷️ AI Hashtag Suggestions</h5>
      <p class="text-muted">
        Select or add hashtags based on your caption style ✨
      </p>

      <div class="hashtag-list">
        <span
          v-for="tag in allHashtags"
          :key="tag"
          @click="toggleTag(tag)"
          :class="{ active: selectedTags.includes(tag) }"
          class="tag"
        >{{ tag }}</span>
      </div>

      <div class="custom-add mt-3">
        <input v-model="customTag" placeholder="Add custom hashtag..." />
        <button @click="addTag">Add</button>
      </div>

      <div class="btn-area">
        <button class="btn-close" @click="$emit('close')">Done</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useReviewStore } from "@/store/reviewStore";
const reviewStore = useReviewStore();

const allHashtags = [
  "#JejuIsland", "#JejuTravel", "#Korea", "#TravelKorea",
  "#IslandLife", "#BeachVibes", "#NatureLovers", "#Wanderlust"
];
const selectedTags = ref([...reviewStore.hashtags || []]);
const customTag = ref("");

const toggleTag = (tag) => {
  const idx = selectedTags.value.indexOf(tag);
  idx > -1 ? selectedTags.value.splice(idx, 1) : selectedTags.value.push(tag);
  reviewStore.hashtags = [...selectedTags.value];
};

const addTag = () => {
  if (customTag.value && !selectedTags.value.includes(customTag.value)) {
    selectedTags.value.push(`#${customTag.value}`);
    reviewStore.hashtags = [...selectedTags.value];
  }
  customTag.value = "";
};
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-content { background: #fffaf3; padding: 1.5rem; border-radius: 1rem; width: 90%; max-width: 600px; max-height: 80vh; overflow-y: auto; }
.tag { display: inline-block; background: #eee; color: #333; border-radius: 1rem; padding: .4rem .8rem; margin: .25rem; cursor: pointer; font-size: .85rem; }
.tag.active { background: #ff8c00; color: #fff; }
.custom-add { display: flex; gap: .5rem; }
.custom-add input { flex: 1; border: 1px solid #ccc; border-radius: .75rem; padding: .5rem; }
.custom-add button { background: #1b3b6f; color: #fff; border: none; border-radius: .75rem; padding: .5rem 1rem; }
.btn-close { background: #1b3b6f; color: white; border: none; padding: .6rem 1.2rem; border-radius: .8rem; margin-top: 1rem; float: right; }
</style>
