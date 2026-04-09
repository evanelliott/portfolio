<template>
  <div class="rounded-lg overflow-hidden shadow-xl">
    <!-- WebP animations work just like standard images -->
    <video 
      :src="demoUrl" 
      :alt="title"
      class="w-full h-auto object-cover"
      loading="lazy"
      type="video/mp4"
      controls autoplay loop muted 
    />
  </div>
</template>
<script setup lang="ts">
defineProps<{
  demoUrl: string;
  title: string;
}>();
</script>