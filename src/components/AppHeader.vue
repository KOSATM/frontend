<template>
  <nav ref="navbar" class="navbar navbar-expand-lg navbar-fms fixed-top">
    <div class="container-fluid px-3">
      <router-link to="/" class="navbar-brand mx-auto fw-semibold">
        Find My Seoul
      </router-link>

      <!-- 햄버거 메뉴 -->
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <i class="bi bi-list fs-2 text-primary"></i>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav text-center">
          <li class="nav-item"><router-link to="/planner" class="nav-link">Planner</router-link></li>
          <li class="nav-item"><router-link to="/supporter" class="nav-link">Supporter</router-link></li>
          <li class="nav-item"><router-link to="/history" class="nav-link">History</router-link></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const navbar = ref(null)

const handleScroll = () => {
  if (window.scrollY > 20) navbar.value?.classList.add('scrolled')
  else navbar.value?.classList.remove('scrolled')
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))
</script>
