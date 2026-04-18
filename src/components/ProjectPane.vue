<script setup lang="ts">
import type { Project } from '@/types/Project';

/**
 * ProjectPane represents a single 'tile' in the sidebar.
 */
interface Props {
  project: Project;
  isActive: boolean; // Passed from App.vue
}

defineProps<Props>();

// Define the click event to notify the parent (App.vue)
defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button
    @click="$emit('click')"
    type="button"
    :aria-selected="isActive"
    class="relative w-full h-full flex flex-col text-left transition-all duration-200 ease-out group"
    :class="[
      isActive 
        ? 'translate-y-2 sm:translate-y-0 sm:translate-x-2'
        : ''
    ]"
  >
    <!-- Selection Indicator -->
    <!-- Mobile: Horizontal bar at top | Desktop (sm): Vertical bar on left -->
    <div 
      v-if="isActive"
      class="absolute bg-indigo-600 rounded-full transition-all
             right-1 left-1 -top-2 h-1 
             sm:top-1 sm:bottom-1 sm:-left-2 sm:right-auto sm:h-auto sm:w-1"
    ></div>

    <!-- Card Container -->
    <div 
      class="flex-1 flex items-center justify-center p-2 rounded-md border transition"
      :class="[
        isActive 
          ? 'border-indigo-600 bg-indigo-300 shadow-sm' 
          : 'border-zinc-600 bg-zinc-300'
      ]"
    >
      <!-- Project Emoji & Name -->
      <div class="flex flex-col items-center gap-1">
        <span class="text-[15px] leading-none">{{ project.emoji }}</span>
        <span 
          class="text-[8px] font-bold block text-center leading-tight"
          :class="isActive ? 'text-indigo-600' : 'text-zinc-950'"
        >
          {{ project.name }}
        </span>
      </div>
    </div>
  </button>
</template>

<style scoped>
button {
  outline: none;
}
/* Removed fixed margins like mb-5 to allow the flex-1 distribution in App.vue to work perfectly */
</style>
