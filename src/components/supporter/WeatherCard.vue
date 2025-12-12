<template>
  <div v-if="weather" class="wc-root" :style="bgStyle">
    <div class="wc-top">
      <div class="wc-icon">
        <i :class="weather.iconClass"></i>
      </div>
      <div class="wc-right">
        <div class="wc-temp">{{ weather.temperature }}<span class="wc-deg">°C</span></div>
        <div class="wc-desc">{{ weather.desc }}</div>
        <div class="wc-loc">대한민국, 서울</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  latitude: { type: Number, default: 37.5665 },
  longitude: { type: Number, default: 126.9780 }
})

const weather = ref(null)

const weatherCodeToText = (code) => {
  const map = {
    0: '맑음',
    1: '대체로 맑음',
    2: '구름 많음',
    3: '흐림',
    45: '안개',
    48: '착빙성 안개', // 안개가 얼어붙는 현상
    51: '가벼운 이슬비',
    53: '중간 이슬비',
    55: '짙은 이슬비',
    56: '가벼운 어는 이슬비',
    57: '짙은 어는 이슬비',
    61: '약한 비',
    63: '중간 비',
    65: '강한 비',
    66: '가벼운 어는 비',
    67: '강한 어는 비',
    71: '약한 눈',
    73: '중간 눈',
    75: '강한 눈',
    80: '소나기',
    81: '다소 강한 소나기',
    82: '폭우성 소나기',
    95: '뇌우',
    96: '뇌우 (약한 우박)',
    99: '뇌우 (강한 우박)'
  }
  return map[code] || '알 수 없음'
}

async function fetchOpenMeteo() {
  try {
    const lat = props.latitude
    const lon = props.longitude
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,cloudcover&daily=precipitation_sum&timezone=Asia%2FSeoul`
    const res = await fetch(url)
    const data = await res.json()
    if (data && data.current_weather) {
      const cw = data.current_weather
      let humidity = '--'
      let clouds = '--'
      let precip = '--'
      try {
        const nowISO = new Date().toISOString().slice(0,13) + ':00'
        const idx = data.hourly.time.indexOf(nowISO)
        if (idx >= 0) {
          humidity = Math.round(data.hourly.relativehumidity_2m[idx])
          clouds = Math.round(data.hourly.cloudcover[idx])
        }
      } catch (e) {
        console.warn('Failed to parse hourly weather arrays', e)
      }
      try {
        if (data.daily && data.daily.precipitation_sum && data.daily.precipitation_sum.length > 0) {
          precip = Math.round(data.daily.precipitation_sum[0] * 10) / 10
        }
      } catch (e) {
        console.warn('Failed to parse daily precipitation', e)
      }

      const w = {
        temperature: Math.round(cw.temperature),
        windspeed: Math.round(cw.windspeed * 10) / 10,
        code: cw.weathercode,
        desc: weatherCodeToText(cw.weathercode),
        humidity: humidity,
        clouds: clouds,
        precip: precip,
        time: new Date().toLocaleTimeString()
      }

      const code = w.code
      if ([0,1].includes(code)) w.iconClass = 'bi bi-brightness-high'
      else if ([2,3].includes(code)) w.iconClass = 'bi bi-cloud-sun'
      else if (code >= 80 && code < 90) w.iconClass = 'bi bi-cloud-rain'
      else if (code >= 95) w.iconClass = 'bi bi-cloud-lightning'
      else w.iconClass = 'bi bi-cloud'

      weather.value = w
    }
  } catch (err) {
    console.warn('Weather fetch failed', err)
  }
}

onMounted(() => {
  fetchOpenMeteo()
})

// dynamic background based on local hour
const hour = ref(new Date().getHours())

const getGradientForHour = (h) => {
  // 0-5 night, 6-11 morning, 12-17 day, 18-23 evening
  if (h >= 6 && h < 12) return 'linear-gradient(180deg,#7ac7ff 0%, #2b9bf0 100%)' // morning
  if (h >= 12 && h < 18) return 'linear-gradient(180deg,#3aa0e6 0%, #1570b8 100%)' // day
  if (h >= 18 && h < 21) return 'linear-gradient(180deg,#2b6fb3 0%, #1e4f84 100%)' // evening
  return 'linear-gradient(180deg,#10273b 0%, #16394f 100%)' // night
}

const bgStyle = computed(() => ({ background: getGradientForHour(hour.value) }))

// update hour periodically in case user keeps the page open
const timer = setInterval(() => {
  const h = new Date().getHours()
  if (h !== hour.value) hour.value = h
}, 30 * 60 * 1000) // every 30 minutes

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.wc-root { 
  /* 너비를 100%로 설정하여 사이드바 패딩 안쪽을 가득 채움 */
  width: 100%; 
  box-sizing: border-box; /* 패딩 포함 너비 계산 */
  
  border-radius: 16px; /* 모서리 둥글기 통일 (Checklist와 비슷하게) */
  overflow: hidden; 
  color: #fff; 
  box-shadow: 0 4px 15px rgba(14,30,60,0.08); /* 그림자 부드럽게 조정 */
  
  /* 마진은 layout.scss의 gap으로 제어하므로 여기선 제거하거나 최소화 */
  margin-bottom: 0; 
}
.wc-top { display:flex; gap:12px; align-items:center; padding:18px; }
.wc-icon { width:110px; display:flex; align-items:center; justify-content:center; }
.wc-icon i { font-size:48px; color:rgba(255,255,255,0.95); }
.wc-right { flex:1; text-align:right; padding-right:8px; }
.wc-temp { font-size:34px; font-weight:700; line-height:1; }
.wc-deg { font-size:16px; margin-left:4px; }
.wc-desc { font-size:18px; font-weight:700; margin-top:6px; color:rgba(255,255,255,0.95); }
.wc-loc { font-size:12px; opacity:0.9; margin-top:6px; color:rgba(255,255,255,0.9); }
.wc-bottom { display:flex; background:#fff; color:#2b79b0; padding:12px 10px; align-items:center; }
.wc-stat { flex:1; text-align:center; }
.wc-divider { border-left:1px solid rgba(0,0,0,0.06); border-right:1px solid rgba(0,0,0,0.06); }
.wc-stat-icon i { font-size:20px; color:#2b79b0; }
.wc-stat-value { font-weight:600; margin-top:6px; color:#1f2937; }
.wc-stat-label { font-size:12px; color:#6b7280; margin-top:4px; }
@media (max-width:767px){ .wc-icon i { font-size:40px; } .wc-temp { font-size:24px; } .wc-desc { font-size:16px; } }
</style>
