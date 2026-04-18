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
  <div class="project-root fixed inset-0 flex flex-col bg-zinc-950 text-zinc-100 sm:px-16 overflow-hidden isolate">
    
    <!-- Top Header -->
    <header class="w-full shrink-0 z-20 pt-4 sm:pt-0 sm:pb-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-0 flex justify-between items-end">
        <h4 class="font-bold leading-none text-[18px]">Project Portfolio</h4>
        <div class="hidden sm:block text-[10px] font-bold">
          <span class="px-2">Evan Elliott</span>
          <span class="px-2 border-l border-white">Technical Lead</span>
          <span class="pl-2 border-l border-white">Data Science & Engineering Specialist</span>
        </div>
      </div>
    </header>

    <!-- Main Layout Container -->
    <!-- On mobile, Project Bar is horizontal (col). On Desktop, it's vertical (row) -->
    <div class="flex-1 flex flex-col sm:flex-row overflow-hidden">
      
      <!-- Project Pane Bar -->
      <!-- sm:h-full ensures it stretches the vertical height on desktop -->
      <aside class="order-1 sm:order-1 w-full sm:w-22 h-auto sm:h-full shrink-0 bg-zinc-950 z-10 pb-2 sm:pb-0 sm:pr-2">
        <!-- flex-1 on the panes inside this flex container will force them to distribute evenly -->
        <nav class="flex flex-row sm:flex-col h-full w-full p-2 gap-2 sm:gap-4"> 
          <ProjectPane 
            v-for="project in projects" 
            :key="project.id" 
            :project="project" 
            :isActive="selectedId === project.id" 
            @click="handleProjectSelect(project.id)"
            class="flex-1 min-w-0 min-h-0" 
          />
        </nav>
      </aside>

      <!-- Main Viewport -->
      <main class="order-2 sm:order-2 flex-1 relative overflow-y-auto text-slate-950 bg-zinc-900/20 custom-scrollbar">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :selectedId="selectedId" :projects="projects" />
          </Transition>
        </RouterView>
      </main>

    </div>
    
    <footer class="w-full py-0.5 text-center shrink-0 bg-zinc-950 z-20">
      <div class="text-[7px] text-zinc-500">
        &copy; {{ new Date().getFullYear() }} Evan Elliott. No rights reserved.
      </div>
    </footer>
  </div>
</template>


<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #09090b;
}

.project-root {
  padding-top: env(safe-area-inset-top);
}

nav {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.custom-scrollbar::-webkit-scrollbar { 
  width: 4px; 
  height: 4px; 
}
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
