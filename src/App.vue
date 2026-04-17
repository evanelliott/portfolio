<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import projectsData from '@/../public/data/projects.json';
import ProjectPane from '@/components/ProjectPane.vue';
import type { Project } from '@/types/Project';

const projects = ref<Project[]>(projectsData);
const selectedId = ref<string | null>(null);

const handleProjectSelect = (id: string) => {
  selectedId.value = selectedId.value === id ? null : id;
};

// --- Mobile/Orientation Logic ---
const portraitQuery = window.matchMedia("(orientation: portrait)");
const isPortrait = ref(portraitQuery.matches);

const handleOrientationChange = (event: MediaQueryListEvent | MediaQueryList) => {
  const isSmallScreen = window.innerWidth < 700; 
  isPortrait.value = event.matches && isSmallScreen;
};

onMounted(() => {
  handleOrientationChange(portraitQuery);
  portraitQuery.addEventListener('change', handleOrientationChange);
  window.addEventListener('resize', () => handleOrientationChange(portraitQuery));
});

onUnmounted(() => {
  portraitQuery.removeEventListener('change', handleOrientationChange);
  window.removeEventListener('resize', () => handleOrientationChange(portraitQuery));
});
</script>

<template>
  <!-- 
    1. 'fixed inset-0' + 'overflow-hidden' locks the app background 
    2. 'isolate' prevents children from fighting over z-index layers 
  -->
  <div class="project-root fixed inset-0 flex flex-col bg-slate-200 text-slate-900 overflow-hidden isolate">
    
    <header class="w-full shrink-0 z-10 relative">
      <div class="max-w-7xl mx-auto px-2 flex flex-col">
        <div :class="['flex items-center gap-4 mb-4', isPortrait ? 'justify-center mt-32' : 'justify-start mt-2']">
          <h4 :class="['font-bold leading-none text-[18px]', isPortrait ? 'text-center' : 'text-left']">
            Project Portfolio
          </h4>
        </div>
        <div v-if="!isPortrait" class="flex items-center gap-2 -mt-3 pb-2 text-[10px] font-bold">
          <span>Evan Elliott</span>
          <span class="border-l pl-2">Technical Lead</span>
          <span class="border-l pl-2">Data Science & Engineering Specialist</span>
        </div>
      </div>
    </header>

    <div class="flex-1 flex max-w-7xl w-full mx-auto px-1 py-0 gap-2 overflow-hidden relative">
      <div v-if="isPortrait" class="flex-1 flex flex-col items-center justify-start mt-10 p-10 text-center">
        <div class="rotate-icon text-5xl mb-4">📱</div>
        <h2 class="font-bold text-[12px]">Please rotate your device to landscape mode</h2>
      </div>

      <template v-else>
        <main class="grow min-w-0 overflow-hidden">
          <RouterView v-slot="{ Component }">
            <Transition name="page" mode="out-in">
              <component :is="Component" :selectedId="selectedId" :projects="projects" />
            </Transition>
          </RouterView>
        </main>

        <aside class="w-1/8 max-w-70 -ml-6 shrink-0 flex flex-col"> 
          <nav class="flex flex-col h-full space-y-1 overflow-y-auto custom-scrollbar"> 
            <ProjectPane 
              v-for="project in projects" 
              :key="project.id" 
              :project="project" 
              :isActive="selectedId === project.id" 
              @click="handleProjectSelect(project.id)"
              class="flex-1" 
            />
          </nav>
        </aside>
      </template>
    </div>
    
    <footer class="w-full py-2 px-0 text-center shrink-0">
      <div class="max-w-7xl mx-auto text-[7px]">
        &copy; {{ new Date().getFullYear() }} Evan Elliott.
      </div>
    </footer>

    <!-- 
       CRITICAL: Any Lightbox component should be wrapped in <Teleport to="body"> 
       inside its respective component to jump over the header/sidebar layers.
    -->
  </div>
</template>

<style>
/* Reset for mobile Safari address bar issues */
html, body {
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: fixed; /* Stops rubber-banding */
  margin: 0;
}

#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
}

.project-root {
  height: 100dvh; /* Dynamic viewport height respects Safari bars */
  touch-action: none; /* Prevents global page dragging */
}

/* Re-enable scrolling ONLY for the navigation */
nav.overflow-y-auto {
  touch-action: pan-y; 
  -webkit-overflow-scrolling: touch;
}

.rotate-icon {
  animation: rotate-device 2s ease-in-out infinite;
}

@keyframes rotate-device {
  0%, 100% { transform: rotate(0deg); }
  30%, 70% { transform: rotate(-90deg); }
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.2);
  border-radius: 10px;
}
</style>
