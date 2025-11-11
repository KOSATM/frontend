<template>
  <section>
    <h5 class="mb-3"><i class="bi bi-people-fill me-2"></i>Nearby Public Restrooms</h5>

    <div class="card mb-3 map-card p-3 shadow-sm border-0">
      <div class="map-gradient position-relative rounded">
        <div class="gps-center d-flex flex-column align-items-center justify-content-center">
          <i class="bi bi-send fs-1 text-primary"></i>
          <div class="text-primary small mt-1">GPS Loading...</div>
        </div>

        <i v-for="(m, i) in mapMarkers" :key="i"
           class="bi bi-people-fill restroom-icon text-primary"
           :style="{ left: m.left, top: m.top }"></i>
      </div>
    </div>

    <div class="list-group">
      <a v-for="(r, i) in restrooms" :key="i" href="#"
         class="list-group-item list-group-item-action mb-2 d-flex align-items-center rounded border-0 shadow-sm">
        <div class="me-3 icon-box d-flex align-items-center justify-content-center">
          <i class="bi bi-people-fill text-primary fs-4"></i>
        </div>
        <div class="flex-fill">
          <div class="fw-medium">{{ r.name }}</div>
          <div class="small text-muted">
            <i class="bi bi-geo-alt me-1"></i> {{ r.distance }} &nbsp; • &nbsp;
            <i class="bi bi-clock me-1"></i> {{ r.hours }}
          </div>
        </div>
        <div class="ms-3 text-muted"><i class="bi bi-chevron-right"></i></div>
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const mapMarkers = ref([
  { left: '20%', top: '25%' },
  { left: '35%', top: '60%' },
  { left: '70%', top: '30%' },
  { left: '85%', top: '55%' },
]);

const restrooms = ref([
  { name: 'Gangnam Station Public Restroom', distance: '80m away', hours: '24/7' },
  { name: 'COEX Mall Restroom (B1F)', distance: '350m away', hours: '10:00 - 22:00' },
  { name: 'Bongeunsa Temple Restroom', distance: '520m away', hours: '05:00 - 21:00' },
]);
</script>

<style scoped>
.map-card { background: transparent; }
.map-gradient { height:200px; background: linear-gradient(90deg,#f3fffb,#eef6ff); border-radius:12px; position:relative; overflow:hidden; }
.gps-center { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); text-align:center; }
.restroom-icon { position:absolute; transform: translate(-50%,-50%); font-size:22px; opacity:0.95; background: rgba(255,255,255,0.85); border-radius:6px; padding:6px; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
.icon-box { width:56px;height:56px;border-radius:10px;background:#fff;border:1px solid #f0f0f0; }
</style>