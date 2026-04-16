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
  <section class="border-2 rounded-md border-slate-600 bg-white overflow-hidden h-full">
    <div v-if="activeProject" class="flex flex-col md:flex-row h-full">
      <div class="flex-1 overflow-y-auto p-0 md:p-0 prose prose-slate prose-sm max-w-none custom-scrollbar scroll-pt-0">
        <MarkdownView :project="activeProject" />
      </div>
    </div>
    
    <!-- Updated Empty State with info about sections -->
    <div v-else class="flex flex-col items-start justify-start h-full px-0 pt-0 text-start">

      <!-- 1. FIXED TOP HEADER -->
      <!-- This stays at the top and does not scroll -->
      <header class="z-30 bg-white border-b-2 border-slate-600 px-2 h-12 flex justify-start items-center w-full">
        <div class="flex items-baseline gap-3 py-4 min-w-0">
          <div class="space-y-0.5">
            <h4 class="text-sm font-bold leading-none">
              <span class="pointing-finger">👈</span> Select a project to begin
            </h4>
            <p class="text-[10px] text-indigo-600 font-bold mt-0">Includes:</p>
          </div>
        </div>
      </header>

      <!-- 2. SCROLLABLE VIEWPORT -->
      <!-- This is the container that allows sticky headers to work -->
      <main class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth h-full w-full bg-slate-100">
        <div class="mx-auto px-0 pb-0 space-y-0 text-[10px]">
          
          <!-- EXECUTIVE SUMMARY -->
          <section class="mt-0 pb-0 space-y-1">
            <div class="sticky top-0 z-20 bg-slate-100 py-1 mr-0.5 flex items-center gap-3 border-b border-slate-100">
              <h4 class="pl-2 font-bold">■ Executive Summary</h4><i>Core impact and KPI breakdown</i>
            </div>
            
          </section>

          <!-- 2. ARCHITECTURAL BLUEPRINT -->
          <section class="mt-0 pb-0 space-y-1">
            <div class="sticky top-0 z-20 bg-slate-100 py-1 mr-0.5 flex items-center gap-3 border-b border-slate-100">
              <h4 class="pl-2 font-bold">■ Architectural Blueprints</h4><i>Visual overview of the system structure and logic</i>
            </div>
          </section>

          <!-- 3. IMPLEMENTATION CINEMA -->
          <section class="mt-0 pb-0 space-y-1">
            <div class="sticky top-0 z-20 bg-slate-100 py-1 mr-0.5 flex items-center gap-3 border-b border-slate-100">
              <h4 class="pl-2 font-bold">■ Deep-Dive Cinema</h4><i>A collection of videos exploring the project in detail</i>
            </div>
          </section>
          
          <!-- 4. ARTIFACTS -->
          <section class="mt-0 pb-0 space-y-1">
            <div class="sticky top-0 z-20 bg-slate-100 py-1 mr-0.5 flex items-center gap-3 border-b border-slate-100">
              <h4 class="pl-2 font-bold">■ Artifacts</h4><i>Links to source code and documentation</i>
            </div>
          </section>
        </div>
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
  display: inline-block; /* Required for transform to work */
  animation: nudge-left 1.5s infinite ease-in-out;
}

@keyframes nudge-left {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-6px); /* Moves 6px towards the sidebar */
  }
}

</style>
