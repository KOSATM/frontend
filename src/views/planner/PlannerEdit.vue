<template>
  <div class="min-h-screen bg-[#F7F7FB] text-slate-900">
    <!-- Top App Bar -->
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">✈️</div>
          <h1 class="font-semibold">Seoul Journey</h1>
        </div>
        <button class="lg:hidden p-2" aria-label="menu">☰</button>
      </div>
    </header>

    <!-- Page -->
    <main class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-12 lg:gap-6">
      <!-- Left: AI helper (desktop only) -->
      <aside class="hidden lg:block lg:col-span-3 lg:sticky lg:top-20 self-start">
        <AIHelperCard @applySuggestion="onApplySuggestion" />
      </aside>

      <!-- Right: Timeline -->
      <section class="lg:col-span-9 pt-6 pb-40">
        <!-- Trip header -->
        <div class="bg-white rounded-2xl p-5 shadow-sm">
          <div class="flex items-center gap-2 text-pink-600 mb-1">
            <span>📅</span>
            <span class="font-semibold">Your 7-Day Seoul Adventure</span>
          </div>
          <p class="text-sm text-slate-500 mb-4">{{ dateRange }} • Seoul, Korea</p>

          <div class="flex flex-wrap gap-3">
            <Chip label="Total Budget" :value="currency(totalBudget)" />
            <Chip label="Estimated Cost" tone="violet" :value="currency(estimatedCost)" />
            <Chip label="Remaining" tone="green" :value="currency(remaining)" />
          </div>
        </div>

        <!-- Mobile AI helper card -->
        <div class="lg:hidden mt-4">
          <AIHelperCard @applySuggestion="onApplySuggestion" />
        </div>

        <!-- Day cards: desktop list / mobile horizontal carousel -->
        <div class="mt-6 hidden lg:flex lg:flex-col gap-3">
          <DayCard
            v-for="(day) in days"
            :key="day.id"
            :day="day"
            :expanded="expandedDay === day.id"
            :dailyCost="dailyCost(day)"
            @toggle="expandedDay = expandedDay === day.id ? null : day.id"
          />
        </div>

        <div class="mt-4 lg:hidden">
          <div class="flex gap-4 overflow-x-auto snap-x snap-mandatory px-1" ref="carouselEl">
            <DayCard
              v-for="(day) in days"
              :key="day.id"
              class="min-w-[85%] snap-center"
              :day="day"
              :isCarousel="true"
              :expanded="expandedDay === day.id"
              :dailyCost="dailyCost(day)"
              @toggle="expandedDay = expandedDay === day.id ? null : day.id"
            />
          </div>
          <!-- page dots -->
          <div class="flex items-center justify-center gap-2 mt-2">
            <div
              v-for="(day, i) in days"
              :key="'dot-' + day.id"
              class="h-1.5 w-6 rounded-full"
              :class="i === currentPage ? 'bg-slate-800' : 'bg-slate-300'"
            />
          </div>
        </div>

        <!-- Next CTA -->
        <div class="fixed bottom-20 md:bottom-6 inset-x-4 md:inset-x-auto md:right-8 z-40">
          <button class="w-full md:w-auto px-5 py-3 rounded-2xl shadow-md bg-emerald-600 text-white font-semibold hover:brightness-110 active:translate-y-0.5">
            Next: Select Hotel
          </button>
        </div>
      </section>
    </main>

    <!-- Bottom chat input (mobile + desktop) -->
    <div class="fixed bottom-0 inset-x-0 bg-white border-t z-50">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2">
        <input
          v-model="askText"
          type="text"
          class="flex-1 rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask AI to modify your itinerary"
          @keyup.enter="sendAsk"
        />
        <button class="p-3 rounded-xl bg-blue-600 text-white" @click="sendAsk">➤</button>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to{ opacity:0 }
</style>
