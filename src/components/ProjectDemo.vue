<template>
  <div class="rounded-lg overflow-hidden shadow-xl">
    <!-- WebP animations work just like standard images -->
    <video
      :src="url"
      :alt="title"
      class="w-full h-auto object-cover"
      loading="lazy"
      type="video/mp4"
      controls
      loop
      muted
    />
  </div>
</template>
<script setup lang="ts">
  defineProps<{
    url: string
    title: string
  }>()
</script>
