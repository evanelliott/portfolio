<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import mermaid from 'mermaid';
import type { Project } from '@/types/Project';
import ProjectDemo from './ProjectDemo.vue';

const props = defineProps<{
  project: Project
}>();

const markdownHtml = ref('');
const isLoading = ref(true);

mermaid.initialize({ startOnLoad: false, theme: 'neutral' });

const fetchAndRender = async () => {
  isLoading.value = true;
  try {
    await nextTick();

    // 1. Find the element and strip the 'processed' flag
    const el = document.querySelector('.mermaid');
    if (el) {
      el.removeAttribute('data-processed');
      // 2. Force the new diagram text into the div before rendering
      el.textContent = props.project.mermaidDiagram;
    }

    // 3. Your existing call now works every time
    await mermaid.run();

  } catch {
    markdownHtml.value = '<p class="text-red-500">Error loading project documentation.</p>';
  } finally {
    isLoading.value = false;
  }
};


watch(() => props.project.id, fetchAndRender, { immediate: true });
</script>


<template>
  <div class="space-y-8 pb-12 text-slate-700">
    
    <!-- 1. PROJECT OVERVIEW (Header no longer sticky) -->
    <section class="space-y-6">
      <h4 class="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-2">Project Overview</h4>
      <div class="flex flex-wrap gap-1.5">
        <p class="text-sm text-slate-500 leading-snug italic">
          {{ project.tagline }}
        </p>
      </div>

      <!-- INSIGHTS GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <h5 class="text-[9px] font-bold uppercase text-slate-400 mb-1">Value Prop</h5>
          <p class="text-xs leading-relaxed font-medium">"{{ project.valueProposition }}"</p>
        </div>
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <h5 class="text-[9px] font-bold uppercase text-slate-400 mb-1">Use Case</h5>
          <p class="text-xs leading-relaxed">{{ project.useCase }}</p>
        </div>
      </div>

      <!-- TAGS AREA -->
      <div class="flex flex-col gap-4 border-b border-slate-50 pb-0">
        <div v-if="project.techStack.length">
          <h4 class="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-2">Tech Stack</h4>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="tech in project.techStack" :key="tech" 
                  class="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-mono rounded border border-slate-200">
              {{ tech }}
            </span>
          </div>
        </div>

        <div v-if="project.topics.length">
          <h4 class="text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-2">Topics</h4>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="topic in project.topics" :key="topic" 
                  class="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 text-[10px] rounded-md">
              {{ topic }}
            </span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 3. ARCHITECTURE (Now Sticky) -->
    <section v-if="project.mermaidDiagram" class="pt-4">
      <h4 class="sticky top-0 bg-white z-10 text-[9px] font-bold uppercase tracking-widest text-slate-300 py-3 border-b border-slate-50 mb-3">
        System Architecture
      </h4>
      <div class="mermaid scale-90 origin-top-left p-4 rounded-lg bg-white border border-slate-100">
        {{ project.mermaidDiagram }}
      </div>
    </section>

    <!-- 4. VISUAL DEMOS (Now Sticky) -->
    <section v-if="project.animations?.length" class="pt-6 space-y-6">
      <h4 class="sticky top-0 bg-white z-10 text-[9px] font-bold uppercase tracking-widest text-slate-300 py-3 border-b border-slate-50 mb-2">
        Visual Demos
      </h4>
      <div v-for="(anim, index) in project.animations" :key="index" class="space-y-3">
        <p class="text-[11px] text-slate-500 flex gap-2 items-start leading-snug">
          <span class="font-bold text-indigo-500">{{ index + 1 }}.</span>
          {{ anim.description }}
        </p>
        <div class="rounded-lg overflow-hidden border border-slate-200 shadow-sm max-w-3xl">
          <ProjectDemo :demoUrl="anim.fileName" :title="anim.fileName" />
        </div>
      </div>
    </section>
    
    <!-- 5. ARTIFACTS -->
    <section class="flex-col gap-2 pt-8 border-t border-slate-100">
      <h4 class="sticky top-0 bg-white z-10 text-[9px] font-bold uppercase tracking-widest text-slate-300 py-3 border-b border-slate-50 mb-2">
        Links
      </h4>
      <div class="flex flex-wrap gap-1.5">
        <a :href="project.artifacts.githubUrl" target="_blank" class="btn-artifact-sm">GITHUB</a>
        <a :href="project.artifacts.adrUrl" target="_blank" class="btn-artifact-sm">ADR</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.btn-artifact-sm {
  @apply px-3 py-1.5 bg-slate-900 text-white hover:bg-indigo-600 rounded text-[9px] font-bold tracking-widest transition-all;
}

:deep(.prose) {
  font-size: 0.75rem;
  line-height: 1.5;
}



</style>
