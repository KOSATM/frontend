<template>
  <div id="app">
    <!-- 🔸 Navbar -->
    <nav ref="navbar" class="navbar navbar-expand-lg navbar-fms fixed-top">
      <div class="container-fluid px-3">
        <a class="navbar-brand mx-auto fw-semibold" href="#">Find My Seoul</a>

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
            <li class="nav-item"><a class="nav-link" href="#">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#">Planner</a></li>
            <li class="nav-item"><a class="nav-link" href="#">About</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 🔸 메인 콘텐츠 -->
    <main class="container-fms">
      <LandingPage />
    </main>

    <!-- 🔸 Footer -->
    <footer class="footer-fms">
      <p class="mb-1">© 2025 Find My Seoul. All Rights Reserved.</p>
      <p class="mb-0">
        Built with ❤️ using <a href="https://getbootstrap.com/">Bootstrap 5</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import LandingPage from './components/LandingPage.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const navbar = ref(null)

const handleScroll = () => {
  if (window.scrollY > 20) navbar.value?.classList.add('scrolled')
  else navbar.value?.classList.remove('scrolled')
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))
</script>
