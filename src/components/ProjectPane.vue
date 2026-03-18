<script setup lang="ts">
import type { Project } from '@/types/Project';

/**
 * ProjectPane represents a single 'tile' in the 5-pane grid.
 * It displays high-level metadata and acts as the trigger for the main view.
 */
interface Props {
  project: Project;
  isActive: boolean; // Managed by PortfolioHome.vue
}

defineProps<Props>();

// Define the click event to notify the parent
defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button
    @click="$emit('click')"
    type="button"
    :aria-selected="isActive"
    class="relative flex-1 w-full text-left transition-all duration-300 ease-out group"
    :class="[
      isActive 
        ? 'scale-105 z-10' 
        : 'hover:translate-y-[-4px] opacity-70 hover:opacity-100'
    ]"
>
    <!-- Card Container -->
    <div 
      class="h-full p-5 rounded-2xl border-2 transition-colors"
      :class="[
        isActive 
          ? 'bg-white border-indigo-500 shadow-xl' 
          : 'bg-slate-50 border-transparent hover:border-slate-200 shadow-sm'
      ]"
    >
      <!-- Project ID / Name / Emoji -->
      <span 
        class="text-xs font-mono font-bold tracking-widest uppercase mb-2 block"
        :class="isActive ? 'text-indigo-600' : 'text-slate-400'"
      >
        Project #{{ project.id }}: <b>{{ project.name }}</b> {{ project.emoji }}
      </span>

      <!-- Active Indicator Arrow -->
      <div 
        v-if="isActive" 
        class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-500 rotate-45"
      ></div>
    </div>
  </button>
</template>

<style scoped>
/* Ensure the line-clamp works for the value proposition */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
/* Smooth tooltip transition */
.group:hover .group-hover\:opacity-100 {
  transition-delay: 100ms;
}
</style>
