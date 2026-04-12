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
  <section class="border-3 border-slate-600 rounded-2xl bg-white overflow-hidden h-full">
    <div v-if="activeProject" class="flex flex-col md:flex-row h-full">
      <div class="flex-1 overflow-y-auto p-1 md:p-1 prose prose-slate prose-sm max-w-none custom-scrollbar scroll-pt-0">
        <MarkdownView :project="activeProject" />
      </div>
      <div class="sticky bottom-0 h-1/10 w-full bg-gradient-to-t from-slate-600 to-transparent pointer-events-none z-50"></div>
    </div>
    
    <!-- Updated Empty State with info about sections -->
    <div v-else class="flex flex-col items-center justify-start h-full px-0 pt-1 text-center">
        <!-- Main Call to Action -->
        <div class="mb-4">
          <h2 class="text-[13px] font-black text-slate-800 flex items-center gap-3">
            <span class="animate-pulse">👈</span> Select a project to begin
          </h2>
          <div class="h-1 w-12 bg-indigo-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <!-- Technical Modules List -->
        <div class="text-left max-w-md border-slate-200 pl-0 py-1 space-y-2">
          <p class="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">
            Includes:
          </p>
          
          <div class="space-y-2">
            <div class="space-y-0.5">
              <p class="text-[11px] font-bold text-slate-700 leading-none">Executive Summary</p>
              <p class="text-[10px] text-slate-400 font-medium leading-tight italic">Core impact and KPI breakdown.</p>
            </div>

            <div class="space-y-0.5">
              <p class="text-[11px] font-bold text-slate-700 leading-none">Architectural Blueprints</p>
              <p class="text-[10px] text-slate-400 font-medium leading-tight italic">Visual overview of the system structure and logic.</p>
            </div>

            <div class="space-y-0.5">
              <p class="text-[11px] font-bold text-slate-700 leading-none">Deep Dive Cinema</p>
              <p class="text-[10px] text-slate-400 font-medium leading-tight italic">A collection of videos exploring the project in detail.</p>
            </div>

            <div class="space-y-0.5">
              <p class="text-[11px] font-bold text-slate-700 leading-none">Technical Artifacts</p>
              <p class="text-[10px] text-slate-400 font-medium leading-tight italic">Links to source code and documentation.</p>
            </div>
          </div>
        </div>
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
</style>
