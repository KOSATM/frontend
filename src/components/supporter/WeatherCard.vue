<template>
  <div v-if="weather" class="wc-root" :style="bgStyle">
    <div class="wc-top">
      <div class="wc-icon">
        <i :class="weather.iconClass"></i>
      </div>
      <div class="wc-right">
        <div class="wc-temp">{{ weather.temperature }}<span class="wc-deg">°C</span></div>
        <div class="wc-desc">{{ weather.desc }}</div>
        <div class="wc-loc">Seoul, KR</div>
      </div>
    </div>

    <div class="wc-bottom">
      <div class="wc-stat">
        <div class="wc-stat-icon"><i class="bi bi-cloud-drizzle"></i></div>
        <div class="wc-stat-value">{{ weather.precip }} mm</div>
        <div class="wc-stat-label">Precip</div>
      </div>
      <div class="wc-stat wc-divider">
        <div class="wc-stat-icon"><i class="bi bi-droplet"></i></div>
        <div class="wc-stat-value">{{ weather.humidity }}%</div>
        <div class="wc-stat-label">Humidity</div>
      </div>
      <div class="wc-stat">
        <div class="wc-stat-icon"><i class="bi bi-wind"></i></div>
        <div class="wc-stat-value">{{ weather.windspeed }} m/s</div>
        <div class="wc-stat-label">Wind</div>
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
    0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
    55: 'Dense drizzle', 56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 66: 'Light freezing rain',
    67: 'Heavy freezing rain', 71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
  }
  return map[code] || 'Unknown'
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
.wc-root { border-radius: 10px; overflow: hidden; color: #fff; box-shadow: 0 10px 30px rgba(14,30,60,0.12); }
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
