<template>
  <div class="rounded-lg overflow-hidden shadow-xl">
    <!-- WebP animations work just like standard images -->
    <img 
      :src="demoUrl" 
      :alt="title"
      class="w-full h-auto object-cover"
      loading="lazy"
    />
  </div>
</template>
<script setup lang="ts">
defineProps<{
  demoUrl: string;
  title: string;
}>();
</script>