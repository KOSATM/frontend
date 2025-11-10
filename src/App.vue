<template>
  <div id="app">
    <AppHeader />

    <main class="container-fms">
      <LandingPage />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import LandingPage from './views/LandingPage.vue';
</script>
