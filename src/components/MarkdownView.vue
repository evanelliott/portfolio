<script setup lang="ts">
import { ref } from 'vue';
import ProjectDemo from './ProjectDemo.vue';
import type { Project } from '@/types/Project';

defineProps<{
  project: Project 
}>();

// Track which video is currently playing
const activeVideoIndex = ref(0);

const selectVideo = (index: number) => {
  activeVideoIndex.value = index;
};

</script>

<template>
  <!-- ROOT: Must be flex-col and h-full to create the scrolling context -->
  <div class="flex flex-col h-full px-0 overflow-hidden bg-white">
    
    <!-- 1. FIXED TOP HEADER -->
    <!-- This stays at the top and does not scroll -->
    <header class="z-30 bg-white border-b-2 border-slate-600 px-2 h-12 flex justify-between items-center shrink-0">
      <div class="flex items-baseline gap-3 py-4 min-w-0">
        <div class="space-y-0.5">
          <h4 class="text-sm font-bold leading-none">
            {{ project.title }}
          </h4>
          <p class="text-[10px] text-indigo-600 font-bold mt-0">{{ project.headline }}</p>
        </div>
      </div>

      <div class="flex flex-wrap justify-end gap-1 max-w-[40%] shrink-0 pb-0">
        <span v-for="tech in project.stack" :key="tech" 
              class="px-1.5 py-0.5 bg-indigo-200 text-indigo-600 text-[8px] tracking-[0.1em] font-mono font-semibold rounded border border-indigo-600 whitespace-nowrap">
          {{ tech }}
        </span>
      </div>
    </header>

    <!-- 2. SCROLLABLE VIEWPORT -->
    <!-- This is the container that allows sticky headers to work -->
    <main class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth h-full">
      <div class="mx-auto px-0 pb-0 space-y-16">
        
        <!-- EXECUTIVE SUMMARY -->
        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 pt-0">
          <div class="sticky top-0 z-20 bg-slate-100 mt-0 py-1 mr-2 flex items-center gap-4 border-b border-slate-100">
            <h4 class="px-2 text-[10px] font-bold">➤ Executive Summary</h4>
          </div>
          
          <div class="px-6 space-x-3">
            
            <div class="flex md:flex-row gap-6">
              <div class="w-2/5 space-y-4">

                <div class="">
                  <div class="space-y-2">
                    <p class="text-[10px] text-slate-900">
                      {{ project.summary }}
                    </p>
                  </div>
                </div>
                
                <div class="md:col-span-5 grid grid-cols-2 gap-3">
                  <div v-for="kpi in project.kpis" :key="kpi.label" 
                      class="p-2 bg-slate-100 rounded-xl border border-slate-400 flex flex-col justify-center text-center">
                    <span class="text-[10px] font-bold text-indigo-600 leading-none">{{ kpi.value }}</span>
                    <span class="text-[9px] font-semibold text-slate-600 mt-1">{{ kpi.label }}</span>
                  </div>
                </div>

              </div>

              <div class="w-3/5 min-w-0 overflow-hidden md:flex">
                <div>
                  <img :src="project.imageUrl" alt="Project screenshot" class="rounded-lg border border-slate-100 shadow-sm">
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- 2. ARCHITECTURAL BLUEPRINT -->
        <section class="mt-0 bg-slate-000 space-y-8">
          <!-- Sticky Section Header: Sticks to the top of the main container -->
          <div class="sticky top-0 z-20 bg-slate-100 mt-0 py-1 mr-2 flex items-center gap-4 border-b border-slate-100">
            <h4 class="px-2 text-[10px] font-bold">➤ Architectural Blueprints</h4>
          </div>
          
          <div class="px-6">
            <div class="px-32">
              <img :src="project.imageUrl" alt="Project screenshot" class="rounded-lg border border-slate-100 shadow-sm">
            </div>
          </div>

          <div class="grid grid-cols-3 md:grid-cols-3 px-6 gap-8">
            <div v-for="item in project.rationale" :key="item.title" class="space-y-2">
              <h4 class="text-[10px] font-bold flex items-center gap-2">
                <span class="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                {{ item.title }}
              </h4>
              <p class="text-[10px] text-slate-600">
                {{ item.description }}
              </p>
            </div>
          </div>
        </section>

        <!-- 3. IMPLEMENTATION CINEMA -->
        <section v-if="project.videos?.length" class="mt-0 pb-0 space-y-2">
          <div class="sticky top-0 z-20 bg-slate-100 py-1 mr-2 flex items-center gap-4 border-b border-slate-100">
            <h4 class="px-2 text-[10px] font-bold">➤ Deep-Dive Cinema</h4>
          </div>

          <div class="px-12 space-y-2">
            <!-- MAIN VIEWER -->
            <div class="group relative aspect-video w-full overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border-3 border-slate-400">
              <transition name="fade" mode="out-in">
                <div :key="activeVideoIndex" class="w-full h-full">
                  <ProjectDemo 
                    :url="project.videos[activeVideoIndex].url || 'https://lorem.video/720p'"
                    :title="project.videos[activeVideoIndex].title" 
                  />
                </div>
              </transition>
              
              <!-- Active Video Overlay Info -->
              <div class="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-slate-950/100 to-transparent">
                <h4 class="text-slate-50 text-[16px] font-bold">{{ project.videos[activeVideoIndex].title }}</h4>
                <p class="text-slate-300 text-[12px] font-semibold mb-12 max-w-2xl">{{ project.videos[activeVideoIndex].desc }}</p>
              </div>
            </div>

            <!-- THUMBNAIL STRIP (The "Filmstrip") -->
            <div class="flex gap-4 overflow-x-auto pb-0 no-scrollbar">
              <button 
                v-for="(video, index) in project.videos" 
                :key="index"
                @click="selectVideo(Number(index))"
                :class="[
                  'relative shrink-0 w-36 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 text-left',
                  activeVideoIndex === index 
                    ? 'border-indigo-600 ring-4 ring-indigo-600/40 scale-95' 
                    : 'border-slate-200 opacity-60 hover:opacity-100'
                ]"
              >
                <!-- Thumbnail Placeholder (Can be an img if you have thumbs) -->
                <div class="absolute inset-0 bg-slate-800 flex items-center justify-center">
                   <span class="text-[10px] font-bold text-slate-400 px-4 text-center">
                     {{ video.title }}
                   </span>
                </div>
                
                <!-- Active Indicator -->
                <div v-if="activeVideoIndex === index" class="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              </button>
            </div>
          </div>
        </section>
        
        <!-- 4. ARTIFACTS -->
        <footer v-if="project.artifacts" class="pt-0">
          <div class="sticky top-0 z-20 bg-slate-100 mt-0 py-1 mr-2 flex items-center gap-4 border-b border-slate-100">
            <h4 class="px-2 text-[10px] font-bold">➤ Artifacts</h4>
          </div>
          <div class="bg-slate-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl shadow-indigo-200">
            <!-- <div class="text-center md:text-left space-y-1"> -->
              <!-- <h4 class="font-bold text-[12px]">Technical Artifacts</h4> -->
              <!-- <p class="text-slate-600 text-[10px] font-medium">Review the codebase and technical documentation:</p> -->
            <!-- </div> -->
            <div class="flex gap-8 w-full justify-center">
              <a :href="project.artifacts.githubUrl" target="_blank" class="btn-artifact">Source Code (GitHub) →</a>
              <a :href="project.artifacts.adrUrl" target="_blank" class="btn-artifact">Architecture Design Record (ADR) →</a>
            </div>
          </div>
        </footer>
      </div>
      
      <div class="sticky bottom-0 h-1/10 w-full bg-gradient-to-t from-slate-600 to-transparent pointer-events-none z-50"></div>
    </main>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.btn-artifact {
  @apply px-4 py-2 bg-indigo-200 text-indigo-600 hover:bg-white hover:text-slate-900 rounded-lg border border-indigo-600 text-[10px] font-bold transition-all;
}

:deep(.mermaid svg) {
  height: auto !important;
  max-width: 100% !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide scrollbar for the filmstrip but allow scrolling */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scroll-container-fade {
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}
</style>
