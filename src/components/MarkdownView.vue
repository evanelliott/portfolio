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
  <div class="flex flex-col h-full px-0 overflow-hidden bg-zinc-950">
    <!-- 1. UPDATED HEADER: Removed fixed h-12 and overflow-hidden -->
    <header class="z-30 bg-zinc-300 border-b border-zinc-950 px-3 py-2 sm:py-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shrink-0">
      
      <!-- Title Section -->
      <div class="flex items-baseline gap-3 min-w-1/2">
        <div class="space-y-0.5">
          <h4 class="text-sm font-bold leading-tight">
            {{ project.title }}
          </h4>
          <p class="text-[10px] text-indigo-600 font-bold mt-0">{{ project.headline }}</p>
        </div>
      </div>

      <!-- Tech Stack: flex-wrap allows items to move to a second line if space runs out -->
      <div class="flex flex-wrap justify-start sm:justify-end gap-1">
        <span v-for="tech in project.stack" :key="tech" 
              class="px-1 py-0.5 bg-indigo-100 text-indigo-600 text-[7px] tracking-[0.05em] font-mono font-semibold rounded border border-indigo-600 whitespace-nowrap">
          {{ tech }}
        </span>
      </div>
    </header>


    <!-- 2. SCROLLABLE VIEWPORT -->
    <main class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth h-full bg-white custom-scrollbar">
      <div class="mx-auto px-0 pb-0 space-y-16 text-[10px] bg-whie">
        
        <!-- EXECUTIVE SUMMARY -->
        <div class="grid grid-cols-1 gap-4 pt-0">
          <div class="sticky top-0 z-20 bg-white py-1 flex items-center gap-3 border-b shadow border-zinc-950">
            <h4 class="pl-3 font-bold">Executive Summary</h4>
          </div>
          
          <div class="px-8">
            <!-- Mobile: flex-col (Photo top) | Tablet+: flex-row (Side-by-side) -->
            <div class="flex flex-col gap-6">
              
              <div>
                <p class="text-[10px] text-zinc-900 leading-relaxed">
                  {{ project.summary }}
                </p>
              </div>
              
              <div class="w-full">
                <img :src="project.imageUrl" alt="Project screenshot" class="w-full rounded-lg border border-zinc-950 shadow-sm object-cover">
              </div>

              <!-- KPI Grid -->
              <div class="grid grid-cols-2 gap-3 px-6">
                <div v-for="kpi in project.kpis" :key="kpi.label" 
                    class="p-2 bg-zinc-100 rounded-xl border border-zinc-950 flex flex-col justify-center text-center">
                  <span class="text-[10px] font-bold text-indigo-600 leading-none">{{ kpi.value }}</span>
                  <span class="text-[9px] font-semibold text-zinc-600 mt-1">{{ kpi.label }}</span>
                </div>
              </div>

            </div>
          </div>

          <!-- Rationale Grid (3 columns on all sizes, or adjust if needed) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 px-9 gap-4 mt-4">
            <div v-for="item in project.rationale" :key="item.title" class="space-y-2">
              <h4 class="text-[10px] font-bold flex items-center gap-2">
                <span class="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                {{ item.title }}
              </h4>
              <p class="text-[10px] text-zinc-600">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- 2. ARCHITECTURAL BLUEPRINT (MODIFIED SECTION) -->
        <section class="mt-0 bg-zinc-000 space-y-8">
          <!-- Sticky Section Header -->
          <div class="sticky top-0 z-20 bg-white py-1 flex items-center gap-3 border-b border-t shadow border-zinc-950">
            <h4 class="pl-3 font-bold">Architectural Blueprints</h4>
          </div>
          
          <div class="px-3">
            <div class="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-2 px-0">
              <!-- Mandatory System Architecture -->
              <div class="flex items-center justify-center group relative cursor-pointer aspect-square rounded-lg border border-zinc-950 overflow-hidden bg-zinc-950"
                   @click="openFullscreen(project.systemArchitectureUrl, 'System Architecture')">
                <img :src="project.systemArchitectureUrl" class="w-full h-full object-cover">
                <!-- Static Dark Overlay & Title -->
                <div class="absolute inset-0 bg-zinc-950/50 flex items-center justify-center">
                  <span class="text-white text-[10px] font-bold text-center px-2">System Architecture</span>
                </div>
              </div>

              <!-- Additional Diagrams -->
              <div v-for="diag in project.additionalDiagrams" :key="diag.name"
                   class="flex items-center justify-center group relative cursor-pointer aspect-square rounded-lg border border-zinc-950 overflow-hidden bg-zinc-950"
                   @click="openFullscreen(diag.url, diag.name)">
                <img :src="diag.url" class="w-full h-full object-cover">
                <!-- Static Dark Overlay & Title -->
                <div class="absolute inset-0 bg-zinc-950/50 flex items-center justify-center">
                  <span class="text-white text-[10px] font-bold text-center px-2">{{ diag.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>


        <!-- 3. IMPLEMENTATION CINEMA -->
        <section v-if="project.videos?.length" class="mt-0 pb-0 space-y-2">
          <div class="sticky top-0 z-20 bg-white py-1 flex items-center gap-3 border-b border-t shadow border-zinc-950">
            <h4 class="pl-3 font-bold">Deep-Dive Cinema</h4>
          </div>

          <div class="px-3 sm:px-16 space-y-2">
            <!-- MAIN VIEWER -->
            <div class="group relative aspect-video w-full overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl border-3 border-zinc-400">
              <transition name="fade" mode="out-in">
                <div :key="activeVideoIndex" class="w-full h-full">
                  <ProjectDemo 
                    :url="project.videos[activeVideoIndex].url || 'https://lorem.video/720p'"
                    :title="project.videos[activeVideoIndex].title" 
                  />
                </div>
              </transition>
              
              <!-- Active Video Overlay Info -->
              <div class="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-zinc-950/100 to-transparent pointer-events-none">
                <h4 class="text-zinc-50 text-[16px] font-bold">{{ project.videos[activeVideoIndex].title }}</h4>
                <p class="text-zinc-300 text-[12px] font-semibold mb-12 max-w-2xl">{{ project.videos[activeVideoIndex].desc }}</p>
              </div>
            </div>

            <!-- THUMBNAIL STRIP (The "Filmstrip") -->
            <div class="flex gap-4 overflow-x-auto pb-0 no-scrollbar">
              <button 
                v-for="(video, index) in project.videos" 
                :key="index"
                @click="selectVideo(Number(index))"
                :class="[
                  'relative shrink-0 w-30 sm:w-30 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 text-left',
                  activeVideoIndex === index 
                    ? 'border-indigo-600 ring-4 ring-indigo-600/40 scale-95' 
                    : 'border-zinc-200 opacity-60 hover:opacity-100'
                ]"
              >
                <!-- Thumbnail Placeholder (Can be an img if you have thumbs) -->
                <div class="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                   <span class="text-[10px] font-bold text-zinc-400 px-4 text-center">
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
          <div class="sticky top-0 z-20 bg-white py-1 flex items-center gap-3 border-t border-b shadow border-zinc-950">
            <h4 class="pl-3 font-bold">Artifacts</h4>
          </div>
          <div class="bg-white p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl shadow-indigo-200">
            <!-- <div class="text-center md:text-left space-y-1"> -->
              <!-- <h4 class="font-bold text-[12px]">Technical Artifacts</h4> -->
              <!-- <p class="text-zinc-600 text-[10px] font-medium">Review the codebase and technical documentation:</p> -->
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
             class="lightbox fixed inset-0 z-[9999] bg-zinc-950/95 flex flex-col touch-none" 
             @click.self="closeFullscreen">
          
          <div class="flex justify-between items-center px-4 h-12 border-b border-zinc-950 bg-zinc-950 text-white z-[10000]">
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
  @apply px-4 py-2 bg-zinc-200 text-indigo-600 hover:bg-white hover:text-zinc-900 rounded-lg border border-zinc-950 text-[10px] text-center font-bold transition-all;
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