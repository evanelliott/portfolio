<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import projectsData from '@/../public/data/projects.json';
import ProjectPane from '@/components/ProjectPane.vue';
import type { Project } from '@/types/Project';

const projects = ref<Project[]>(projectsData);
const selectedId = ref<string | null>(null);

const selectProject = (id: string) => {
  selectedId.value = id;
};

// 1. Define the media query for portrait orientation
const portraitQuery = window.matchMedia("(orientation: portrait)");
const isPortrait = ref(portraitQuery.matches);

// 2. Define a robust handler for orientation changes
const handleOrientationChange = (event: MediaQueryListEvent | MediaQueryList) => {
  // We only show the prompt if it's portrait AND on a mobile-sized screen
  const isSmallScreen = window.innerWidth < 700; 
  isPortrait.value = event.matches && isSmallScreen;
};

onMounted(() => {
  // Initial check
  handleOrientationChange(portraitQuery);
  
  // Modern browsers use 'change' event on the MediaQueryList
  // We also keep 'resize' as a fallback for window size changes
  portraitQuery.addEventListener('change', handleOrientationChange);
  window.addEventListener('resize', () => handleOrientationChange(portraitQuery));
});

onUnmounted(() => {
  portraitQuery.removeEventListener('change', handleOrientationChange);
  window.removeEventListener('resize', () => handleOrientationChange(portraitQuery));
});
</script>

<template>
  <!-- h-screen + overflow-hidden prevents the browser from ever showing a scrollbar -->
  <div class="flex flex-col h-screen bg-slate-300 text-slate-900 overflow-hidden">
    
    <!-- HEADER -->
    <header class="w-full shrink-0 z-50">
      <div class="max-w-7xl mx-auto px-2 flex flex-col justify-start">
        <div :class="['flex items-center gap-4 mt-2 mb-4', isPortrait ? 'justify-center' : 'justify-start']">
          <h4 :class="['font-bold tracking-[0em] leading-none pt-0 text-[18px] text-slate-900', isPortrait ? 'text-center' : 'text-left']">
            Project Portfolio
          </h4>
        </div>
        <div v-if="!isPortrait" class="flex items-center gap-2 -mt-3 pb-2 text-[10px] font-semibold text-slate-600">
          <span class="font-bold leading-none">Evan Elliott</span>
          <span class="border-l pl-2 leading-none">Technical Lead</span>
          <span class="border-l pl-2 leading-none">
            Data Science & Engineering Specialist (Remote)
          </span>
        </div>
      </div>
    </header>

    <!-- MAIN CONTENT AREA: No overflow here -->
    <div class="flex-1 flex max-w-7xl w-full mx-auto px-1 py-0 gap-2 overflow-hidden">
      
      <!-- PORTRAIT PROMPT -->
      <div v-if="isPortrait" class="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <div class="rotate-icon text-5xl mb-6">📱</div>
        <!-- <p class="text-slate-400 font-bold text-lg">Rotate to landscape</p> -->
        <h2 class="font-bold tracking-[0.15em] leading-none pt-0 text-[12px] text-slate-600">
          Please rotate
        </h2>
      </div>

      <!-- LANDSCAPE CONTENT -->
      <template v-else>
        <!-- SIDEBAR -->
        <aside class="w-1/9 max-w-70 -ml-5 mt-4 shrink-0">
          <!-- <h3 class="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-2 px-2">
            Select Project
          </h3> -->
          <nav class="space-y-1">
            <ProjectPane 
              v-for="project in projects" 
              :key="project.id"
              :project="project"
              :is-active="selectedId === project.id"
              @click="selectProject(project.id)"
            />
          </nav>
        </aside>

        <!-- VIEWPORT: Grows to fill space, but doesn't allow overflow -->
        <main class="grow min-w-0 overflow-hidden">
          <RouterView v-slot="{ Component }">
            <Transition name="page" mode="out-in">
              <component 
                :is="Component" 
                :selectedId="selectedId" 
                :projects="projects"
              />
            </Transition>
          </RouterView>
        </main>
      </template>
    </div>
    
    <!-- FOOTER: Always visible at the bottom -->
    <footer class="w-full border-none border-slate-200 py-0 px-0 text-center shrink-0">
      <div class="max-w-7xl mx-auto text-[7px] text-slate-700 tracking-widest">
        &copy; {{ new Date().getFullYear() }} Evan Elliott. No rights reserved.
      </div>
    </footer>
  </div>
</template>



<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Animated Rotation Symbol */
.rotate-icon {
  font-size: 4rem;
  animation: rotate-device 2s ease-in-out infinite;
}

@keyframes rotate-device {
  0% { transform: rotate(0deg); }
  30% { transform: rotate(-90deg); }
  70% { transform: rotate(-90deg); }
  100% { transform: rotate(0deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
