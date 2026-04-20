<script setup lang="ts">
  import { ref } from 'vue'
  import ProjectDemo from './ProjectDemo.vue'
  import type { Project } from '@/types/Project'

  defineProps<{
    project: Project
  }>()

  // Helper function to resolve dynamic assets
  const images = import.meta.glob('@/assets/*.{png,jpg,jpeg,svg,webp}', {
    eager: true,
    import: 'default',
  })

  const getImageUrl = (path: string) => {
    if (!path || path.startsWith('http')) return path
    const filename = path.split('/').pop()
    const key = Object.keys(images).find((k) => k.endsWith(`/${filename}`))
    return key ? (images[key] as string) : path
  }

  /**
   * NAVIGATION LOGIC
   * Opens images in a new tab instead of a lightbox
   */
  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer')
  }

  // Video state management
  const activeVideoIndex = ref(0)
  const selectVideo = (index: number) => {
    activeVideoIndex.value = index
  }
</script>

<template>
  <div class="flex flex-col h-full px-0 overflow-hidden bg-zinc-950">
    <!-- STICKY HEADER -->
    <header
      class="z-30 bg-zinc-300 border-b border-zinc-950 px-3 py-2 sm:py-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shrink-0"
    >
      <div class="flex items-baseline gap-3 min-w-1/2">
        <div class="space-y-0.5">
          <h4 class="text-sm font-bold leading-tight">{{ project.title }}</h4>
          <p class="text-[10px] text-indigo-600 font-bold mt-0">{{ project.headline }}</p>
        </div>
      </div>
      <div class="flex flex-wrap justify-start sm:justify-end gap-1">
        <span
          v-for="tech in project.stack"
          :key="tech"
          class="px-1 py-0.5 bg-indigo-100 text-indigo-600 text-[7px] tracking-[0.05em] font-mono font-semibold rounded border border-indigo-600 whitespace-nowrap"
        >
          {{ tech }}
        </span>
      </div>
    </header>

    <main
      class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth h-full bg-white custom-scrollbar"
    >
      <div class="mx-auto px-0 pb-0 space-y-16 text-[10px]">
        <!-- 1. EXECUTIVE SUMMARY -->
        <div class="grid grid-cols-1 gap-4 pt-0">
          <div
            class="sticky top-0 z-20 bg-white py-1 flex items-center gap-3 border-b shadow border-zinc-950"
          >
            <h4 class="pl-3 font-bold">Executive Summary</h4>
          </div>
          <div class="px-8">
            <div class="flex flex-col gap-6">
              <div>
                <p class="text-[10px] text-zinc-900 leading-relaxed">{{ project.summary }}</p>
              </div>
              <div class="w-full">
                <img
                  :src="getImageUrl(project.imageUrl)"
                  alt="Project screenshot"
                  class="w-full rounded-lg border border-zinc-950 shadow-sm object-cover"
                />
              </div>
              <div class="grid grid-cols-2 gap-3 px-6">
                <div
                  v-for="kpi in project.kpis"
                  :key="kpi.label"
                  class="p-2 bg-zinc-100 rounded-xl border border-zinc-950 flex flex-col justify-center text-center"
                >
                  <span class="text-[10px] font-bold text-indigo-600 leading-none">{{
                    kpi.value
                  }}</span>
                  <span class="text-[9px] font-semibold text-zinc-600 mt-1">{{ kpi.label }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 px-9 gap-4 mt-4">
            <div
              v-for="item in project.rationale"
              :key="item.title"
              class="space-y-2"
            >
              <h4 class="text-[10px] font-bold flex items-center gap-2">
                <span class="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                {{ item.title }}
              </h4>
              <p class="text-[10px] text-zinc-600">{{ item.description }}</p>
            </div>
          </div>
        </div>

        <!-- 2. ARCHITECTURAL BLUEPRINTS (Modified for New Tab) -->
        <section class="mt-0 space-y-8">
          <div
            class="sticky top-0 z-20 bg-white py-1 flex items-center gap-3 border-b border-t shadow border-zinc-950"
          >
            <h4 class="pl-3 font-bold">Architectural Blueprints</h4>
          </div>
          <div class="px-3">
            <div class="grid grid-cols-4 sm:grid-cols-5 gap-2 px-0">
              <!-- System Architecture -->
              <div
                @click="openInNewTab(getImageUrl(project.systemArchitectureUrl))"
                class="flex items-center justify-center group relative cursor-pointer aspect-square rounded-lg border border-zinc-950 overflow-hidden bg-zinc-950"
              >
                <img
                  :src="getImageUrl(project.systemArchitectureUrl)"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-zinc-950/50 flex items-center justify-center">
                  <span class="text-white text-[10px] font-bold text-center px-2"
                    >System Architecture</span
                  >
                </div>
              </div>

              <!-- Additional Diagrams -->
              <div
                v-for="diag in project.additionalDiagrams"
                :key="diag.name"
                @click="openInNewTab(getImageUrl(diag.url))"
                class="flex items-center justify-center group relative cursor-pointer aspect-square rounded-lg border border-zinc-950 overflow-hidden bg-zinc-950"
              >
                <img
                  :src="getImageUrl(diag.url)"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-zinc-950/50 flex items-center justify-center">
                  <span class="text-white text-[10px] font-bold text-center px-2">{{
                    diag.name
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. IMPLEMENTATION CINEMA -->
        <section
          v-if="project.videos?.length"
          class="mt-0 pb-0 space-y-2"
        >
          <div
            class="sticky top-0 z-20 bg-white py-1 flex items-center gap-3 border-b border-t shadow border-zinc-950"
          >
            <h4 class="pl-3 font-bold">Deep-Dive Cinema</h4>
          </div>

          <div class="px-3 sm:px-16 space-y-2">
            <!-- MAIN VIEWER -->
            <div
              class="group relative aspect-video w-full overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl border-3 border-zinc-400"
            >
              <transition
                name="fade"
                mode="out-in"
              >
                <div
                  :key="activeVideoIndex"
                  class="w-full h-full"
                >
                  <ProjectDemo
                    :url="project.videos[activeVideoIndex].url || 'https://lorem.video/720p'"
                    :title="project.videos[activeVideoIndex].title"
                  />
                </div>
              </transition>

              <!-- Active Video Overlay Info -->
              <div
                class="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-zinc-950/100 to-transparent pointer-events-none"
              >
                <h4 class="text-zinc-50 text-[16px] font-bold">
                  {{ project.videos[activeVideoIndex].title }}
                </h4>
                <p class="text-zinc-300 text-[12px] font-semibold mb-12 max-w-2xl">
                  {{ project.videos[activeVideoIndex].desc }}
                </p>
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
                    : 'border-zinc-200 opacity-60 hover:opacity-100',
                ]"
              >
                <!-- Thumbnail Placeholder (Can be an img if you have thumbs) -->
                <div class="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                  <span class="text-[10px] font-bold text-zinc-400 px-4 text-center">
                    {{ video.title }}
                  </span>
                </div>

                <!-- Active Indicator -->
                <div
                  v-if="activeVideoIndex === index"
                  class="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
                ></div>
              </button>
            </div>
          </div>
        </section>

        <!-- 4. ARTIFACTS -->
        <footer
          v-if="project.artifacts"
          class="pt-0"
        >
          <div
            class="sticky top-0 z-20 bg-white py-1 flex items-center gap-3 border-t border-b shadow border-zinc-950"
          >
            <h4 class="pl-3 font-bold">Artifacts</h4>
          </div>
          <div
            class="bg-white p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl shadow-indigo-200"
          >
            <!-- <div class="text-center md:text-left space-y-1"> -->
            <!-- <h4 class="font-bold text-[12px]">Technical Artifacts</h4> -->
            <!-- <p class="text-zinc-600 text-[10px] font-medium">Review the codebase and technical documentation:</p> -->
            <!-- </div> -->
            <div class="flex gap-8 w-full justify-center">
              <a
                :href="project.artifacts.githubUrl"
                target="_blank"
                class="btn-artifact"
                >Source Code (GitHub) →</a
              >
              <a
                :href="project.artifacts.adrUrl"
                target="_blank"
                class="btn-artifact"
                >Architecture Design Record (ADR) →</a
              >
            </div>
          </div>
        </footer>
      </div>
      <div
        class="sticky bottom-0 h-1/6 w-full bg-gradient-to-t from-white to-transparent pointer-events-none z-10"
      ></div>
    </main>
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
  .fixed-lightbox-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    /* Use safe-area for your black-translucent status bar */
    height: calc(50px + env(safe-area-inset-top, 0px));
    padding-top: env(safe-area-inset-top, 0px);

    background: rgba(9, 9, 11, 0.95);
    color: white;
    z-index: 999999; /* Ensure it stays above library layers */
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  }

  /* Ensure the library container fills the viewport correctly */
  :deep(.vel-container) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
