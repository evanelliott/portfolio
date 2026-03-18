<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Project } from '@/types/Project';
import projectsData from '@/../public/data/projects.json';
import ProjectPane from '@/components/ProjectPane.vue';
import ProjectDemo from '@/components/ProjectDemo.vue';
import MarkdownView from '@/components/MarkdownView.vue';

// 1. Data State: Your 5 projects
const projects = ref<Project[]>(projectsData);

// 2. Selection State
const selectedId = ref<string | null>(null);

const activeProject = computed(() => 
  projects.value.find(p => p.id === selectedId.value) || null
);

const selectProject = (id: string) => {
  selectedId.value = id;
};
</script>

<template>
  <main class="max-w-6xl mx-auto p-6 space-y-12">

    <!-- Preamble Section -->
    <header class="text-center space-y-4 py-10">
      <h1 class="text-4xl font-bold text-slate-900">Project Portfolio</h1>
    </header>
    
    <!-- The Reactive Content Box -->
    <section class="border-2 border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden min-h-[500px]">
      <Transition name="fade" mode="out-in">
        
        <!-- State: Project Selected -->
        <div v-if="activeProject" :key="activeProject.id" class="flex flex-col md:flex-row h-full">
        </div>

        <!-- State: Default/Empty -->
        <div v-else class="flex items-center justify-center h-[500px] text-slate-400 italic">
          <div class="text-center">
            <p class="text-lg text-slate-600 max-w-2xl mx-auto">
              Hello! 👋 I’m Evan, a <strong>Technical Lead</strong> specialising in <strong>Data Science & Engineering</strong>.
            </p>
            <p class="text-lg text-slate-600 max-w-2xl mx-auto">
              I created this space to showcase how I architect <strong>production-grade solutions</strong>
              that bridge the gap between <strong>advanced analytics</strong> and <strong>robust engineering</strong>.
            </p>
            <hr style="border: none; height: 1px; background-color: rgba(0, 0, 0, 0.1);">
            <p>Select a project below to explore my work in more detail 👇</p>
          </div>
        </div>

      </Transition>
    </section>

    <!-- Project Selection Grid (The 5 Panes) -->
    <section class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <ProjectPane 
        v-for="project in projects" 
        :key="project.id"
        :project="project"
        :is-active="selectedId === project.id"
        @click="selectProject(project.id)"
      />
    </section>

    <!-- The Reactive Content Box -->
    <section class="border-2 border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden min-h-[500px]">
      <Transition name="fade" mode="out-in">
        
        <!-- State: Project Selected -->
        <div v-if="activeProject" :key="activeProject.id" class="flex flex-col md:flex-row h-full">
          <hr style="border: none; height: 1px; background-color: rgba(0, 0, 0, 0.1);">
          <!-- Animation Column -->
          <div class="md:w-1/2 p-6 bg-slate-50">
             <ProjectDemo :demoUrl="activeProject.mainAnimation" :title="activeProject.name" />
          </div>
          
          <!-- Markdown Column (Scrollable) -->
          <div class="md:w-1/2 p-8 overflow-y-auto max-h-[600px] prose prose-slate">
            <MarkdownView :project="activeProject" />
          </div>
        </div>

        <!-- State: Default/Empty -->
        <div v-else class="flex items-center justify-center h-[500px] text-slate-400 italic">
          <div class="text-center">
            <br>
          </div>
        </div>

      </Transition>
    </section>
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
