<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- Main Layout Shell -->
  <div class="min-h-screen bg-gray-50 text-slate-900">
    
    <!-- This renders your PortfolioHome.vue or other routes -->
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>

    <!-- Example Footer (optional) -->
    <footer class="text-center py-8 opacity-50 text-sm">
      <hr style="border: none; height: 1px; background-color: rgba(0, 0, 0, 0.2);">
      <i class="fas fa-copyright">&copy; {{ new Date().getFullYear() }} Evan Elliott. No rights reserved.</i>
    </footer>
  </div>
</template>

<style>
/* Global transitions or Tailwind 4 Typography overrides can go here */
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
</style>
