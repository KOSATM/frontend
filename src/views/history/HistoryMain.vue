<template>
  <div class="history-page">
    <PageHeader
      title="History"
      subtitle="Your past travel adventures"
      icon="bi-clock-history"
    />
      <ProfileSummary
      name="Jessica Han"
      bio="Travel Enthusiast"
      initials="JH"
      :totalTrips="12"
      :travelDays="28"
      :completed="3"
    />
      <h4><i class="bi bi-clock-history me-2 text-primary"></i> Completed Travel Plans</h4>
    
    
    <!-- TripCard 목록 -->
    <div class="trip-list">
      <TripCard
      v-for="trip in trips"
        :key="trip.id"
        :tripId="trip.id" 
        :title="trip.title"
        :location="trip.location"
        :date="trip.date"
        :cost="trip.cost"
        :image="trip.image"
        :isActive="trip.id === activeId"
        @click="activeId = trip.id"
        />
      </div>

      <div>
        <!-- 하단 설정 -->
        <UserSettings />
        <LogoutButton />
        
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TripCard from '@/components/common/TripCard.vue';
import UserSettings from '@/components/history/UserSettings.vue';
import LogoutButton from '@/components/common/LogoutButton.vue';
import ProfileSummary from "@/components/history/ProfileSummary.vue";
import HistoryHeader from "@/components/common/PageHeader.vue";
import PageHeader from '@/components/common/PageHeader.vue';

// ✅ 하드코딩된 여행 데이터
const trips = ref([
  {
    id: 1,
    title: 'Jeju Island Healing Trip',
    location: 'Jeju Island',
    date: 'Oct 15 - Oct 18, 2024',
    cost: '500',
    image: 'https://images.unsplash.com/photo-1585508889309-6c7f49f4f2b2?w=800'
  },
  {
    id: 2,
    title: 'Tokyo Food Tour',
    location: 'Tokyo, Japan',
    date: 'Sep 20 - Sep 25, 2024',
    cost: '1200',
    image: 'https://images.unsplash.com/photo-1576416981707-5c16f8e3ff04?w=800'
  },
  {
    id: 3,
    title: 'Busan City Escape',
    location: 'Busan',
    date: 'Aug 10 - Aug 12, 2024',
    cost: '300',
    image: 'https://images.unsplash.com/photo-1613810739984-31af6a4bb3b8?w=800'
  }
])

const activeId = ref(1)
</script>

<style scoped>
.history-page {
  background-color: #fffaf3;
  min-height: 100vh;
  padding: 2rem 1.25rem;
}

.history-header {
  margin-bottom: 1.5rem;
  text-align: left;
}

.history-header h4 {
  color: #1B3B6F;
  font-weight: 600;
}

.trip-list {
  margin-bottom: 2rem;
}
</style>
