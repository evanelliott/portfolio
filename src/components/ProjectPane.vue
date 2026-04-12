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
        ? 'translate-x-1' 
        : 'opacity-100 hover:opacity-100'
    ]"
  >
    <!-- Selection Indicator -->
    <div 
      v-if="isActive"
      class="absolute left-4 top-1 bottom-1 w-1 bg-indigo-600 rounded-full"
    ></div>

    <!-- Card Container -->
    <!-- Added 'flex items-center justify-center' to center content vertically and horizontally -->
    <div 
      class="flex-1 flex items-center justify-center p-1.5 rounded-md border-2 transition"
      :class="[
        isActive 
          ? 'border-indigo-600 bg-indigo-200 shadow-sm ml-6 mr-0' 
          : 'border-slate-600 bg-white hover:bg-indigo-100 ml-6 mr-0'
      ]"
    >
      <!-- Project Emoji & Name -->
      <div class="flex flex-col items-center gap-1">
        <span class="text-[15px] leading-none">{{ project.emoji }}</span>
        <span 
          class="text-[8px] font-bold block text-center leading-tight"
          :class="isActive ? 'text-indigo-600' : 'text-slate-900'"
        >
          {{ project.name }}
        </span>
      </div>
    </div>
  </button>
</template>


<style scoped>
/* Ensure smooth movement when selected */
button {
  outline: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
