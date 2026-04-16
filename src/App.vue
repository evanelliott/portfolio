<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import projectsData from '@/../public/data/projects.json';
import ProjectPane from '@/components/ProjectPane.vue';
import type { Project } from '@/types/Project';

const projects = ref<Project[]>(projectsData);
const selectedId = ref<string | null>(null);

const handleProjectSelect = (id: string) => {
  // If the clicked ID is already the selectedId, set it back to null
  if (selectedId.value === id) {
    selectedId.value = null;
  } else {
    selectedId.value = id;
  }
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
  <div class="project-root flex flex-col h-screen bg-slate-200 text-slate-900 overflow-hidden">
    
    <!-- HEADER -->
    <header class="w-full shrink-0 z-50">
      <div class="max-w-7xl mx-auto px-2 flex flex-col justify-start">
        <div :class="['flex items-center gap-4 mb-4', isPortrait ? 'justify-center mt-32' : 'justify-start mt-2']">
          <h4 :class="['font-bold leading-none pt-0 text-[18px]', isPortrait ? 'text-center' : 'text-left']">
            Project Portfolio
          </h4>
        </div>
        <div v-if="!isPortrait" class="flex items-center gap-2 -mt-3 pb-2 text-[10px] font-bold">
          <span class="leading-none">Evan Elliott</span>
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
      <div v-if="isPortrait" class="flex-1 flex flex-col items-center justify-start mt-10 p-10 text-center">
        <div class="rotate-icon text-5xl mb-0">📱</div>
        <h2 class="font-bold pt-0 text-[12px]">Please rotate your device to landscape mode</h2>
      </div>

      <!-- LANDSCAPE CONTENT -->
      <template v-else>
        <!-- VIEWPORT: Grows to fill space, but doesn't allow overflow -->
        <main class="grow min-w-0 overflow-hidden ">
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

        <!-- SIDEBAR -->
        <aside class="w-1/8 max-w-70 -ml-6 mt-0 shrink-0 flex flex-col overflow-hidden"> 
          <!-- Added 'flex flex-col' to the aside to help define the height context -->
          
          <nav class="flex flex-col h-full space-y-1 overflow-y-auto scrollbar-hide"> 
            <!-- 
              1. 'flex flex-col' makes the nav a flexbox
              2. 'h-full' ensures the nav stretches to the bottom of the sidebar
            -->
            <ProjectPane 
              v-for="project in projects" 
              :key="project.id" 
              :project="project" 
              :isActive="selectedId === project.id" 
              @click="handleProjectSelect(project.id)"
              class="shrink-0 max-h-1/5" 
            />
            <!-- 
              3. 'flex-1' tells each ProjectPane to grow and shrink equally 
                to fill the available vertical space.
            -->
          </nav>
        </aside>

      </template>
    </div>
    
    <!-- FOOTER: Always visible at the bottom -->
    <footer class="w-full border-none border-slate-200 py-0 px-0 text-center shrink-0">
      <div class="max-w-7xl mx-auto text-[7px]">
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
/* 1. The 101% trick */
.project-root {
  min-height: 100dvh; 
  /* The extra 1% provides the "scroll room" Safari needs to hide the bar */
}

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

/* Add this to your style block to keep the scrollbar subtle */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.2); /* Light indigo */
  border-radius: 10px;
}
</style>
