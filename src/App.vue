<!-- 컴포넌트의 UI -->
<template>
  <div class="d-flex flex-column vh-100">

    <AppHeader/>

    <div class="flex-grow-1 container-fluid">
      <div class="row">
        <div class="col-md-5 py-2">
          <AppMenu/>
        </div>
        <div class="col-md-7 py-2">
          <RouterView/>
        </div>
      </div>
    </div>
    </div>
  </template>

<!-- 컴포넌트의 초기화 또는 이벤트 처리 -->
<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppMenu from './components/AppMenu.vue';


</script>

<!-- 컴포넌트의 스타일 정의 -->
<style scoped>

</style>