<script setup lang="ts">
import { computed } from 'vue';
import type { Project } from '@/types/Project';
import MarkdownView from '@/components/MarkdownView.vue';

const props = defineProps<{
  selectedId: string | null;
  projects: Project[];
}>();

const activeProject = computed(() => 
  props.projects.find(p => p.id === props.selectedId) || null
);
</script>

<template>
  <section class="border-2 rounded-md border-zinc-950 bg-zinc-300 overflow-hidden h-full">
    <div v-if="activeProject" class="flex flex-col md:flex-row h-full">
      <div class="flex-1 overflow-y-auto p-0 md:p-0 prose prose-zinc prose-sm max-w-none custom-scrollbar scroll-pt-0">
        <MarkdownView :project="activeProject" />
      </div>
    </div>
    
    <!-- Updated Empty State with info about sections -->
    <div v-else class="flex flex-col items-start justify-start h-full px-0 pt-0 text-start">
      <main class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth h-full w-full bg-zinc-300">
      </main>
    </div>

  </section>
</template>


<style scoped>
/* Keeping your original transitions and scrollbar logic exactly as they were */
.fade-content-enter-active, 
.fade-content-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-content-enter-from, 
.fade-content-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.prose :where(h1, h2, h3) {
  position: sticky;
  top: -4rem;
  background-color: white;
  z-index: 10;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-top: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

/* Restoring your custom scrollbar for desktop */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4f39f6;
  border-radius: 5px;
}

.pointing-finger {
  display: inline-block;
  animation: nudge-down 1.5s infinite ease-in-out;
}

@keyframes nudge-down {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px); /* Moves 6px towards the sidebar */
  }
}
</style>
