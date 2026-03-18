<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- Main Layout Shell -->
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-white">
    
    <!-- This renders your PortfolioHome.vue or other routes -->
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>

    <!-- Example Footer (optional) -->
    <footer class="text-center py-8 opacity-50 text-sm">
      &copy; {{ new Date().getFullYear() }} Data Science Portfolio
    </footer>
  </div>
</template>

<style>
/* Global transitions or Tailwind 4 Typography overrides can go here */
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
