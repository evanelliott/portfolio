<script setup lang="ts">
import { ref, computed } from 'vue';
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

// --- LIGHTBOX LOGIC ---
const fullscreenImage = ref<string | null>(null);
const fullscreenCaption = ref('');
const scale = ref(1);
const offset = ref({ x: 0, y: 0 });
const isPanning = ref(false);
const startPos = ref({ x: 0, y: 0 });

const imageStyle = computed(() => ({
  transform: `translate(${offset.value.x}px, ${offset.value.y}px) scale(${scale.value})`,
  cursor: isPanning.value ? 'grabbing' : 'grab',
  transition: isPanning.value ? 'none' : 'transform 0.15s ease-out'
}));

const openFullscreen = (url: string, title: string) => {
  fullscreenImage.value = url;
  fullscreenCaption.value = title;
  scale.value = 1;
  offset.value = { x: 0, y: 0 };
};

const closeFullscreen = () => {
  fullscreenImage.value = null;
};

const zoomIn = () => scale.value = Math.min(scale.value + 0.5, 4);
const zoomOut = () => scale.value = Math.max(scale.value - 0.5, 0.5);

const handleWheel = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? -0.2 : 0.2;
  scale.value = Math.min(Math.max(0.5, scale.value + delta), 4);
};

const startPan = (e: MouseEvent) => {
  isPanning.value = true;
  startPos.value = { x: e.clientX - offset.value.x, y: e.clientY - offset.value.y };
};

const doPan = (e: MouseEvent) => {
  if (!isPanning.value) return;
  offset.value = { x: e.clientX - startPos.value.x, y: e.clientY - startPos.value.y };
};

const endPan = () => isPanning.value = false;

</script>

<template>
  <!-- ROOT: Must be flex-col and h-full to create the scrolling context -->
  <div class="flex flex-col h-full px-0 overflow-hidden bg-white">
    
    <!-- 1. FIXED TOP HEADER -->
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
    <main class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth h-full custom-scrollbar">
      <div class="mx-auto px-0 pb-0 space-y-16 text-[10px]">
        
        <!-- EXECUTIVE SUMMARY -->
        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 pt-0">
          <div class="sticky top-0 z-20 bg-slate-100 py-1 mr-0.5 flex items-center gap-3 border-b border-slate-100">
            <h4 class="pl-2 font-bold">▪ Executive Summary</h4>
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
                      class="p-2 bg-slate-100 rounded-xl border border-slate-200 flex flex-col justify-center text-center">
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

        </div>
        
        <!-- 2. ARCHITECTURAL BLUEPRINT (MODIFIED SECTION) -->
        <section class="mt-0 bg-slate-000 space-y-8">
          <!-- Sticky Section Header -->
          <div class="sticky top-0 z-20 bg-slate-100 py-1 mr-0.5 flex items-center gap-3 border-b border-slate-100">
            <h4 class="pl-2 font-bold">▪ Architectural Blueprints</h4>
          </div>
          
          <div class="px-8">
            <div class="grid grid-cols-4 md:grid-cols-4 gap-4 px-0">
              <!-- Mandatory System Architecture -->
              <div class="group relative cursor-pointer aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50"
                   @click="openFullscreen(project.systemArchitectureUrl, 'System Architecture')">
                <img :src="project.systemArchitectureUrl" class="w-full h-full object-cover">
                <!-- Static Dark Overlay & Title -->
                <div class="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                  <span class="text-white text-[10px] font-bold text-center px-2">System Architecture</span>
                </div>
              </div>

              <!-- Additional Diagrams -->
              <div v-for="diag in project.additionalDiagrams" :key="diag.name"
                   class="group relative cursor-pointer aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50"
                   @click="openFullscreen(diag.url, diag.name)">
                <img :src="diag.url" class="w-full h-full object-cover">
                <!-- Static Dark Overlay & Title -->
                <div class="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                  <span class="text-white text-[10px] font-bold text-center px-2">{{ diag.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>


        <!-- 3. IMPLEMENTATION CINEMA -->
        <section v-if="project.videos?.length" class="mt-0 pb-0 space-y-2">
          <div class="sticky top-0 z-20 bg-slate-100 py-1 mr-0.5 flex items-center gap-3 border-b border-slate-100">
            <h4 class="pl-2 font-bold">▪ Deep-Dive Cinema</h4>
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
          <div class="sticky top-0 z-20 bg-slate-100 py-1 mr-0.5 flex items-center gap-3 border-b border-slate-100">
            <h4 class="pl-2 font-bold">▪ Artifacts</h4>
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
      <div class="sticky bottom-0 h-1/6 w-full bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
    </main>

    <!-- FULLSCREEN LIGHTBOX (TELEPORTED) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="fullscreenImage" 
             class="lightbox fixed inset-0 z-[9999] bg-slate-900/95 flex flex-col touch-none" 
             @click.self="closeFullscreen">
          
          <div class="flex justify-between items-center px-4 h-12 border-b border-slate-700 bg-slate-900 text-white z-[10000]">
            <h4 class="text-[10px] font-bold">{{ fullscreenCaption }}</h4>
            <div class="flex gap-4">
              <button @click="zoomIn" class="text-xl font-bold hover:text-indigo-400">+</button>
              <button @click="zoomOut" class="text-xl font-bold hover:text-indigo-400">-</button>
              <button @click="closeFullscreen" class="text-xl font-bold hover:text-indigo-400">✕</button>
            </div>
          </div>

          <div class="flex-1 overflow-hidden relative cursor-move" 
               @mousedown="startPan" @mousemove="doPan" @mouseup="endPan" @wheel.prevent="handleWheel">
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img :src="fullscreenImage" 
                   :style="imageStyle" 
                   draggable="false" 
                   class="max-w-[90%] max-h-[90%] object-contain shadow-2xl pointer-events-auto" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.btn-artifact {
  @apply px-4 py-2 bg-indigo-200 text-indigo-600 hover:bg-white hover:text-slate-900 rounded-lg border border-indigo-600 text-[10px] font-bold transition-all;
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
/* Previous styles remain same, ensuring z-index is high for teleport */
.lightbox {
  z-index: 9999;
  /* GPU acceleration for smooth Safari rendering */
  -webkit-transform: translate3d(0,0,0);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>