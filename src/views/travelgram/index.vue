<template>
  <div class="travelgram-page">
    <PageHeader
      title="Travelgram"
      subtitle="Your past travel adventures"
      icon="bi-instagram"
    />
      <ProfileSummary
      name="Jessica Han"
      bio="Travel Enthusiast"
      initials="JH"
      :totalplans="12"
      :travelDays="28"
      :completed="3"
    />
    <h4 class="my-3">
      <i class="bi bi-instagram me-2 text-primary"></i> Completed Travel Plans
    </h4>
    
    
    <!-- planCard 목록 -->
    <div class="plan-list">
      <planCard
      v-for="plan in plans"
        :key="plan.id"
        :planId="plan.id" 
        :title="plan.title"
        :location="plan.location"
        :date="plan.date"
        :cost="plan.cost"
        :image="plan.image"
        :isActive="plan.id === activeId"
        @click="activeId = plan.id"
        />
      </div>

      <div>
        
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import planCard from '@/components/common/PlanCard.vue';
import ProfileSummary from "@/components/travelgram/ProfileSummary.vue";
import PageHeader from '@/components/common/PageHeader.vue';

const store = useStore()

// ✅ 하드코딩된 여행 데이터
const plans = ref([
  {
    id: 80,
    title: 'Jeju Island Healing plan',
    location: 'Jeju Island',
    date: 'Oct 15 - Oct 18, 2024',
    cost: '500',
    image: 'https://images.unsplash.com/photo-1585508889309-6c7f49f4f2b2?w=800'
  },
  {
    id: 81,
    title: 'Tokyo Food Tour',
    location: 'Tokyo, Japan',
    date: 'Sep 20 - Sep 25, 2024',
    cost: '1200',
    image: 'https://images.unsplash.com/photo-1576416981707-5c16f8e3ff04?w=800'
  },
  {
    id: 82,
    title: 'Busan City Escape',
    location: 'Busan',
    date: 'Aug 10 - Aug 12, 2024',
    cost: '300',
    image: 'https://images.unsplash.com/photo-1613810739984-31af6a4bb3b8?w=800'
  }
])

const activeId = ref(1)

// store에서 프로필 이미지 가져오기 (없으면 asset의 기본값)
const profileImage = computed(() => {
  const stored = store?.getters?.getProfileImage
  if (stored) return stored
  return new URL('../../assets/img/profile-logo.png', import.meta.url).href
})
</script>

<style scoped>
.travelgram-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem;
}

.travelgram-header {
  margin-bottom: 1.5rem;
  text-align: left;
}

.travelgram-header h4 {
  color: #1B3B6F;
  font-weight: 600;
}

.plan-list {
  margin-bottom: 2rem;
}
</style>
