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
  <div class="project-root min-h-screen flex flex-col bg-zinc-950 text-zinc-100 sm:px-16 overflow-hidden isolate">
    
    <!-- Top Header -->
    <header class="w-full shrink-0 z-20 pt-8 sm:pt-0 pb-2 sm:pb-1">
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
      <aside class="order-1 sm:order-1 w-full sm:w-20 h-auto sm:h-full shrink-0 bg-zinc-950 z-10 px-4 sm:px-0 pb-4 sm:pr-4 sm:py-4">
        <!-- flex-1 on the panes inside this flex container will force them to distribute evenly -->
        <nav class="flex flex-row sm:flex-col h-full w-full p-0 gap-2 sm:gap-4"> 
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
      <main class="order-2 sm:order-2 flex-1 relative overflow-y-auto text-zinc-950 bg-zinc-950 custom-scrollbar">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :selectedId="selectedId" :projects="projects" />
          </Transition>
        </RouterView>
      </main>

    </div>
  </div>
</template>


<style>
/* Important: Removed height: 100% to allow the document to grow and scroll */
html, body {
  margin: 0;
  padding: 0;
  background-color: #09090b;
  /* Helps with smooth momentum scrolling on iOS */
  -webkit-overflow-scrolling: touch;
}

.project-root {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Ensure images/content don't break the layout width */
img, video {
  max-width: 100%;
  height: auto;
}
</style>
