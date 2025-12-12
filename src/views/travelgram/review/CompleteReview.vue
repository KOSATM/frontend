<template>
  <PageHeader
    title="Travelgram"
    subtitle="당신의 지난 여행 기록들"
    icon="bi-instagram"
  />
  <div class="complete-page">
    <div class="complete-container">
      <div class="success-icon">
        🎉
      </div>

      <h2>인스타그램에 후기가 성공적으로 업로드 되었습니다!</h2>
      <p class="message">
        당신의 여행 후기가 인스타그램에 공유되었습니다.<br />
        당신의 추억이 다른 사람들의 여행에 영감을 주기를 바랍니다!
      </p>

      <div class="share-box">
        <p>Would you like to view your post on Instagram?</p>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          class="btn-view"
        >
          <i class="bi bi-instagram me-2"></i>View on Instagram
        </a>
      </div>

          <NavigationButtons
      backText="Back to Travelgram"
      nextText="Back to Main"
      @back="goToTravelgram"
      @next="goHome"
    >
    </NavigationButtons>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import NavigationButtons from '@/components/common/button/NavigationButtons.vue';

const router = useRouter()

const goToTravelgram = () => router.push({ name: 'Travelgram' })
const goHome = () => router.push('/')
</script>

<style scoped>
.complete-page {
  background-color: #fffaf3;
  min-height: 100vh;
  text-align: center;
  padding: 2rem 1.25rem;
}

/* 🎉 중앙 카드 */
.complete-container {
  margin-top: 3rem;
  background: white;
  border-radius: 1.5rem;
  padding: 2.5rem 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  display: inline-block;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 1.2s ease infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

h2 {
  color: #1B3B6F;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.message {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* 🔗 인스타 바로가기 */
.share-box {
  background: #f9f9f9;
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 2rem;
}

.btn-view {
  background: #ff8c00;
  color: white;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 1rem;
  font-weight: 600;
  display: inline-block;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-view:hover {
  background: #e67800;
}

/* 버튼 그룹 */
.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-back,
.btn-home {
  border: none;
  border-radius: 1rem;
  padding: 0.7rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back {
  background: #fff;
  color: #1B3B6F;
  border: 2px solid #1B3B6F;
}
.btn-home {
  background: #1B3B6F;
  color: #fff;
}

.btn-home:hover {
  background: #16305c;
}
</style>
