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
            v-for="(day, i) in days"
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
              v-for="(day, i) in days"
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

<script setup lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'

/** ------------------
 *  Mock 데이터
 * ------------------ */
interface Activity { id: string; title: string; time?: string; price?: number; icon?: string }
interface DayPlan { id: string; date: string; title: string; activities: Activity[] }

const days = ref<DayPlan[]>([
  { id: 'd1', date: 'Nov 6, 2025', title: 'Arrival & Gangnam Exploration', activities: [
    { id: 'a1', title: 'Hotel Check-in (Gangnam)', time: '5:00 PM', icon: '🏨' },
    { id: 'a2', title: 'COEX Mall & Starfield Library', time: '6:30 PM', icon: '🛍️' },
    { id: 'a3', title: 'Bongeunsa Temple', time: '8:30 PM', icon: '🛕' },
    { id: 'a4', title: 'Gangnam Street Food Tour', time: '9:30 PM', price: 80, icon: '🍢' }
  ]},
  { id: 'd2', date: 'Nov 7, 2025', title: 'Palace & Hanbok Experience', activities: [
    { id: 'b1', title: 'Gyeongbokgung Palace', time: '10:00 AM', price: 6, icon: '🏯' },
    { id: 'b2', title: 'Hanbok Rental', time: '11:30 AM', price: 20, icon: '👘' },
    { id: 'b3', title: 'Bukchon Hanok Village', time: '2:00 PM', icon: '🏘️' }
  ]},
  { id: 'd3', date: 'Nov 8, 2025', title: 'N Seoul Tower & Hongdae', activities: [
    { id: 'c1', title: 'Namsan Cable Car', time: '11:00 AM', price: 14, icon: '🚠' },
    { id: 'c2', title: 'N Seoul Tower', time: '11:30 AM', price: 15, icon: '🗼' },
    { id: 'c3', title: 'Hongdae Nightlife', time: '9:00 PM', icon: '🎵' }
  ]},
  { id: 'd4', date: 'Nov 9, 2025', title: 'DMZ Tour & War Memorial', activities: [
    { id: 'd1', title: 'DMZ Tour', time: '7:00 AM', price: 210, icon: '🚌' },
    { id: 'd2', title: 'War Memorial of Korea', time: '4:00 PM', icon: '🏛️' }
  ]},
  { id: 'd5', date: 'Nov 10, 2025', title: 'Han River & Yeouido', activities: [
    { id: 'e1', title: 'Bike Rental', time: '2:00 PM', price: 5, icon: '🚲' }
  ]},
  { id: 'd6', date: 'Nov 11, 2025', title: 'Shopping Day', activities: [
    { id: 'f1', title: 'Myeongdong', time: '11:00 AM', icon: '🛍️' },
    { id: 'f2', title: 'Lotte Dept.', time: '2:00 PM', icon: '🛒' }
  ]},
  { id: 'd7', date: 'Nov 12, 2025', title: 'Departure', activities: [
    { id: 'g1', title: 'Hotel Checkout', time: '9:00 AM', icon: '🏨' },
    { id: 'g2', title: 'Airport', time: '11:00 AM', icon: '✈️' }
  ]},
])

/** 상태 */
const totalBudget = ref(2000)
const expandedDay = ref<string|null>('d1')
const askText = ref('')
const carouselEl = ref<HTMLDivElement | null>(null)
const currentPage = ref(0)

/** 계산 */
const estimatedCost = computed(() => days.value.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + (a.price ?? 0), 0), 0))
const remaining = computed(() => totalBudget.value - estimatedCost.value)
const dateRange = 'Nov 6 - Nov 12, 2025'

function dailyCost(day: DayPlan) {
  return day.activities.reduce((s, a) => s + (a.price ?? 0), 0)
}
function currency(n: number) { return `$${n.toLocaleString()}` }

function sendAsk() {
  if (!askText.value.trim()) return
  // 실제에선 LLM 호출. 여기선 데모로 알럿
  alert('AI에게 전달됨: ' + askText.value)
  askText.value = ''
}

function onApplySuggestion(txt: string) {
  askText.value = txt
}

onMounted(() => {
  // 모바일 캐러셀 현재 페이지 계산
  const el = carouselEl.value
  if (!el) return
  const onScroll = () => {
    const idx = Math.round(el.scrollLeft / (el.clientWidth * 0.85 + 16))
    currentPage.value = Math.min(Math.max(idx, 0), days.value.length - 1)
  }
  el.addEventListener('scroll', onScroll, { passive: true })
})

/** ------------------
 *  하위 컴포넌트들
 * ------------------ */
const Chip = defineComponent({
  name: 'Chip',
  props: { label: String, value: String, tone: { type: String, default: 'sky' } },
  setup(props) {
    const toneMap: Record<string, string> = {
      sky: 'bg-sky-50 text-sky-700 ring-sky-100',
      violet: 'bg-violet-50 text-violet-700 ring-violet-100',
      green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    }
    return () => (
      <div class={['rounded-xl px-4 py-2 ring-1', toneMap[props.tone]]}>
        <div class="text-xs opacity-70">{props.label}</div>
        <div class="font-semibold">{props.value}</div>
      </div>
    )
  }
})

const ActivityItem = defineComponent({
  name: 'ActivityItem',
  props: { item: { type: Object as () => Activity, required: true } },
  setup({ item }) {
    return () => (
      <div class="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50">
        <div class="text-xl w-6 h-6">{item.icon || '📍'}</div>
        <div class="flex-1 min-w-0">
          <div class="font-medium truncate">{item.title}</div>
          <div class="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
            {item.time && <span>{item.time}</span>}
            {item.price != null && <span>•</span>}
            {item.price != null && <span>${item.price}</span>}
          </div>
        </div>
        <button class="text-slate-400 hover:text-slate-600" title="View details">›</button>
      </div>
    )
  }
})

const DayCard = defineComponent({
  name: 'DayCard',
  props: {
    day: { type: Object as () => DayPlan, required: true },
    expanded: Boolean,
    dailyCost: Number,
    isCarousel: { type: Boolean, default: false },
  },
  emits: ['toggle'],
  setup(props, { emit, slots }) {
    return () => (
      <div class={["bg-white rounded-2xl shadow-sm", props.isCarousel ? 'p-0' : '']}
           style={props.isCarousel ? '' : ''}>
        <!-- header -->
        <button class="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-blue-600 text-white"
                onClick={() => emit('toggle')}>
          <div class="text-left">
            <div class="text-sm opacity-90">Day {props.day.id.replace('d','')}</div>
            <div class="font-semibold">{props.day.title}</div>
            <div class="text-xs opacity-80">{props.day.date}</div>
          </div>
          <div class="text-right">
            <div class="text-xs opacity-90">Daily Cost</div>
            <div class="font-semibold">${props.dailyCost}</div>
          </div>
        </button>
        <!-- body -->
        <transition name="fade">
          { props.expanded && (
            <div class="px-3 sm:px-5 py-3">
              {props.day.activities.map(a => <ActivityItem item={a} key={a.id} />)}
            </div>
          )}
        </transition>
      </div>
    )
  }
})

const AIHelperCard = defineComponent({
  name: 'AIHelperCard',
  emits: ['applySuggestion'],
  setup(_, { emit }) {
    const suggestions = [
      'Can we start Day 2 earlier?',
      'Suggest vegetarian restaurants',
      'Swap Day 3 night plan to Day 5',
    ]
    return () => (
      <div class="bg-white rounded-2xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 rounded-xl bg-blue-600 text-white grid place-items-center">AI</div>
          <div class="font-semibold">Ask AI to Adjust Your Plan</div>
        </div>
        <p class="text-sm text-slate-600">
          I’ve created your Seoul itinerary! Feel free to ask me to adjust anything – change timing, swap restaurants, or add new activities. What would you like to modify?
        </p>
        <div class="mt-3 text-xs text-slate-500">Try:</div>
        <div class="mt-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm" onClick={() => emit('applySuggestion', s)}>{s}</button>
          ))}
        </div>
      </div>
    )
  }
})
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to{ opacity:0 }
</style>
