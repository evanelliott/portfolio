<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import projectsData from '@/../public/data/projects.json';
import ProjectPane from '@/components/ProjectPane.vue';
import type { Project } from '@/types/Project';

const projects = ref<Project[]>(projectsData);
const selectedId = ref<string | null>(null);

const handleProjectSelect = (id: string) => {
  selectedId.value = selectedId.value === id ? null : id;
};
</script>

<template>
  <div class="project-root fixed inset-0 flex flex-col bg-zinc-900 text-gray-100 overflow-hidden isolate sm:px-12">
    
    <!-- Top Header -->
    <header class="w-full shrink-0 z-10 py-2 mt-4">
      <div class="max-w-7xl mx-auto px-4 flex justify-between items-end">
        <h4 class="font-bold leading-none text-[18px]">Project Portfolio</h4>
        <div class="hidden sm:block text-[10px] font-bold">
          <span class="px-2">Evan Elliott</span>
          <span class="px-2 border-l border-white">Technical Lead</span>
          <span class="px-2 border-l border-white">Data Science & Engineering Specialist</span>
          
        </div>
      </div>
    </header>

    <!-- Center Viewport -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-0 overflow-hidden relative text-gray-950">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :selectedId="selectedId" :projects="projects" />
        </Transition>
      </RouterView>
    </main>

    <!-- Bottom Project Pane (Horizontal) -->
    <aside class="w-full shrink-0 bg-gray-950 backdrop-blur-sm pb-0">
      <nav class="flex flex-row w-full max-w-7xl mx-auto px-4 gap-2 overflow-x-auto overflow-y-hidden custom-scrollbar pb-0"> 
        <ProjectPane 
          v-for="project in projects" 
          :key="project.id" 
          :project="project" 
          :isActive="selectedId === project.id" 
          @click="handleProjectSelect(project.id)"
          class="flex-2 w-48 sm:w-64" 
        />
      </nav>
    </aside>
    
    <!-- Footer -->
    <footer class="w-full py-1 text-center shrink-0 bg-gray-950">
      <div class="text-[7px]">
        &copy; {{ new Date().getFullYear() }} Evan Elliott. No rights reserved.
      </div>
    </footer>

  </div>
</template>

<style>
html, body {
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: fixed;
  margin: 0;
}

.project-root {
  height: 100dvh;
}

/* Ensure the horizontal scroll is smooth and handles touch well */
nav {
  display: flex;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scroll-snap-type: x proximity;
}

/* Optional: Make items snap into place while scrolling */
nav > * {
  scroll-snap-align: start;
}

.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.2);
  border-radius: 10px;
}
</style>
