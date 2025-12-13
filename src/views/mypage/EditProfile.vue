<template>
  <div class="now-wrap">
    <div class="now-card">
      <div class="now-top">
        <span class="badge">NOW</span>
        <span class="dot" aria-hidden="true"></span>
        <span class="status">진행 중</span>
      </div>

      <div class="now-title">{{ current.title }}</div>

      <div class="now-sub">
        <span class="time">{{ current.time }}</span>
        <span class="sep">•</span>
        <span class="place">{{ current.place }}</span>
      </div>

      <div class="progress">
        <div class="bar" :style="{ width: current.progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const current = ref({
  title: "남산타워 야경 보기",
  time: "19:30 – 21:00",
  place: "Namsan",
  progress: 35,
});
</script>

<style scoped>
/* =========================
   1) 밤 몽환 배경
========================= */
.now-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  overflow: hidden;
  position: relative;

  /* 몽환적인 밤 하늘 + 네온 안개 느낌 */
  background:
    radial-gradient(900px 600px at 70% 18%, rgba(140, 120, 255, .22), transparent 60%),
    radial-gradient(800px 520px at 20% 80%, rgba(90, 210, 255, .14), transparent 55%),
    radial-gradient(520px 420px at 40% 30%, rgba(255, 120, 220, .10), transparent 60%),
    linear-gradient(135deg, #070A22 0%, #15103A 45%, #2A0F55 100%);
}

/* 별가루/노이즈 느낌(아주 은은하게) */
.now-wrap::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,.08) 1px, transparent 1px);
  background-size: 18px 18px;
  opacity: .10;
  pointer-events: none;
}

/* =========================
   2) 중앙 카드(직사각형) + 스카이라인 도트
========================= */
.now-card {
  width: min(580px, 92vw);
  border-radius: 18px;
  padding: 22px 22px 18px;
  position: relative;
  overflow: hidden;

  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow:
    0 18px 70px rgba(0,0,0,.28),
    inset 0 1px 0 rgba(255,255,255,.14);
}

/* 카드 표면에 은은한 쉬머(빛 번짐) */
.now-card::before {
  content: "";
  position: absolute;
  inset: -40% -20% auto -20%;
  height: 160%;
  background: radial-gradient(closest-side, rgba(255,255,255,.14), transparent 70%);
  transform: rotate(18deg);
  opacity: .45;
  pointer-events: none;
}

/* ✅ 도트로 그린 마천루(카드 배경) */
.now-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: .75;
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;

  /* 위로 갈수록 스카이라인이 사라지게(가독성) */
  mask-image: linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,.6) 45%, transparent 78%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,.6) 45%, transparent 78%);

  /* SVG(도트 패턴 + 마천루 마스크) 데이터 URI */
  background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20600%20240%27%20preserveAspectRatio%3D%27none%27%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3Cpattern%20id%3D%27dots%27%20width%3D%2710%27%20height%3D%2710%27%20patternUnits%3D%27userSpaceOnUse%27%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%272%27%20cy%3D%272%27%20r%3D%271.2%27%20fill%3D%27%23ffffff%27%20fill-opacity%3D%270.28%27%2F%3E%0A%20%20%20%20%3C%2Fpattern%3E%0A%0A%20%20%20%20%3Cmask%20id%3D%27skyMask%27%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%27600%27%20height%3D%27240%27%20fill%3D%27black%27%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%2720%27%20%20y%3D%27110%27%20width%3D%2770%27%20height%3D%27120%27%20rx%3D%276%27%20fill%3D%27white%27%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%27105%27%20y%3D%2770%27%20%20width%3D%2762%27%20height%3D%27160%27%20rx%3D%276%27%20fill%3D%27white%27%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%27180%27%20y%3D%2795%27%20%20width%3D%2780%27%20height%3D%27135%27%20rx%3D%276%27%20fill%3D%27white%27%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%27275%27%20y%3D%2750%27%20%20width%3D%2770%27%20height%3D%27180%27%20rx%3D%276%27%20fill%3D%27white%27%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%27360%27%20y%3D%2785%27%20%20width%3D%2778%27%20height%3D%27145%27%20rx%3D%276%27%20fill%3D%27white%27%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%27455%27%20y%3D%27105%27%20width%3D%2760%27%20height%3D%27125%27%20rx%3D%276%27%20fill%3D%27white%27%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%27525%27%20y%3D%2765%27%20%20width%3D%2755%27%20height%3D%27165%27%20rx%3D%276%27%20fill%3D%27white%27%2F%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%27M310%2036%20L326%2050%20L294%2050%20Z%27%20fill%3D%27white%27%2F%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%27M132%2058%20L144%2070%20L120%2070%20Z%27%20fill%3D%27white%27%2F%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%27M548%2052%20L558%2065%20L538%2065%20Z%27%20fill%3D%27white%27%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%27308%27%20y%3D%2718%27%20width%3D%274%27%20height%3D%2724%27%20fill%3D%27white%27%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%27546%27%20y%3D%2735%27%20width%3D%273%27%20height%3D%2718%27%20fill%3D%27white%27%2F%3E%0A%20%20%20%20%3C%2Fmask%3E%0A%0A%20%20%20%20%3ClinearGradient%20id%3D%27fade%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%270%27%20y2%3D%271%27%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%270%27%20stop-color%3D%27%23000%27%20stop-opacity%3D%270%27%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%270.45%27%20stop-color%3D%27%23000%27%20stop-opacity%3D%270.15%27%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%271%27%20stop-color%3D%27%23000%27%20stop-opacity%3D%270.55%27%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%3C%2Fdefs%3E%0A%0A%20%20%3Crect%20width%3D%27600%27%20height%3D%27240%27%20fill%3D%27url(%23dots)%27%20mask%3D%27url(%23skyMask)%27%2F%3E%0A%20%20%3Crect%20width%3D%27600%27%20height%3D%27240%27%20fill%3D%27url(%23fade)%27%2F%3E%0A%3C%2Fsvg%3E");
}

/* =========================
   3) 텍스트 / 요소
========================= */
.now-top {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 2;
}

.badge {
  font-size: 12px;
  letter-spacing: .12em;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.16);
  border: 1px solid rgba(255,255,255,.22);
  color: rgba(255,255,255,.92);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(150, 255, 210, .95);
  box-shadow: 0 0 0 6px rgba(150, 255, 210, .14);
}

.status {
  font-size: 13px;
  color: rgba(255,255,255,.84);
}

/* 일정 이름: 카드 중앙 */
.now-title {
  margin: 18px 0 10px;
  text-align: center;
  font-size: 28px;
  line-height: 1.15;
  font-weight: 850;
  color: rgba(255,255,255,.96);
  text-shadow: 0 10px 26px rgba(0,0,0,.28);
  position: relative;
  z-index: 2;
}

.now-sub {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(255,255,255,.82);
  margin-bottom: 14px;
  position: relative;
  z-index: 2;
}

.sep { opacity: .6; }

.progress {
  height: 6px;
  border-radius: 999px;
  background: rgba(255,255,255,.14);
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.bar {
  height: 100%;
  border-radius: 999px;
  background: rgba(255,255,255,.80);
  box-shadow: 0 10px 26px rgba(255,255,255,.16);
  transition: width .35s ease;
}
</style>
