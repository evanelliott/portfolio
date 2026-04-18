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
  <div class="project-root min-h-screen flex flex-col bg-zinc-950 text-zinc-100 sm:px-16 isolate">
    
    <header class="w-full shrink-0 z-20 pt-12 pb-4 top-0 bg-zinc-950 backdrop-blur-md">
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
    <div class="flex-1 flex flex-col">
      <!-- Project Pane Bar -->
      <aside class="top-[80px] z-10 bg-zinc-950 px-4 pb-4">
        <!-- flex-1 on the panes inside this flex container will force them to distribute evenly -->
        <nav class="flex flex-row h-full w-full p-0 gap-2 sm:gap-5"> 
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

      <!-- REMOVED: overflow-y-auto and flex-1 relative -->
      <!-- Let the browser handle the scroll -->
      <main class="text-zinc-950 bg-zinc-950">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :selectedId="selectedId" :projects="projects" />
          </Transition>
        </RouterView>
      </main>
    
      <footer class="w-full py-0.5 text-center shrink-0 bg-zinc-950 z-20">
        <div class="text-[7px] text-zinc-500">
          &copy; {{ new Date().getFullYear() }} Evan Elliott. No rights reserved.
        </div>
      </footer>
    </div>
  </div>
</template>


<style>
html {
  /* This ensures the 'top' of the bounce and the address bar see this color */
  background-color: #09090b; 
}

body {
  /* Using dvh here is fine for the body background */
  min-h: 100dvh;
  margin: 0;
}

.project-root {
  /* Essential for the content to go UNDER the translucent bars */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Ensure images/content don't break the layout width */
img, video {
  max-width: 100%;
  height: auto;
}
</style>
