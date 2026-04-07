<script setup lang="ts">
import { computed } from 'vue';
import type { Project } from '@/types/Project';
import MarkdownView from '@/components/MarkdownView.vue';

// 1. Accept state from App.vue via props
const props = defineProps<{
  selectedId: string | null;
  projects: Project[];
}>();

// 2. Find the project data based on the ID passed down
const activeProject = computed(() => 
  props.projects.find(p => p.id === props.selectedId) || null
);
</script>

<template>
  <!-- h-full ensures this matches the main viewport height -->
  <section class="border-2 border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden h-full">
    <div v-if="activeProject" class="flex flex-col md:flex-row h-full">

      <!-- Text Area: This is where the scrollbar lives IF text is too long -->

      <div class="flex-1 overflow-y-auto p-8 md:p-12 prose prose-slate prose-sm max-w-none custom-scrollbar scroll-pt-0">
        <MarkdownView :project="activeProject" />
      </div>

    </div>
    
    <!-- Empty State -->
    <div v-else class="flex items-center justify-center h-full text-slate-400 italic">
      👈 Select a project to view details
    </div>
  </section>
</template>


<style scoped>
/* Scoped transition for content swapping */
.fade-content-enter-active, 
.fade-content-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-content-enter-from, 
.fade-content-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Ensure the prose (Markdown) takes up available space */
.prose :where(h1, h2, h3, h4) {
  position: sticky;
  top: -2rem; /* Matches the top padding of your container */
  background-color: white; /* Prevents text from overlapping behind the header */
  z-index: 100;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-top: 4rem;
  border-bottom: 1px solid #f1f5f9; /* Optional: adds a subtle line when stuck */
}

</style>
