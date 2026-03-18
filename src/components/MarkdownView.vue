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

// Initialize Mermaid for your Architecture Diagrams
mermaid.initialize({ startOnLoad: false, theme: 'neutral' });

const fetchAndRender = async () => {
  isLoading.value = true;
  try {
    await nextTick();
    await mermaid.run();
  } catch {
    markdownHtml.value = '<p class="text-red-500">Error loading project documentation.</p>';
  } finally {
    isLoading.value = false;
  }
};

// Re-run whenever the user selects a different project
watch(() => props.project.id, fetchAndRender, { immediate: true });
</script>

<template>
  <div class="space-y-12">
    <!-- 1. Header & Value Prop -->
    <section>
      <h2 class="text-3xl font-bold text-slate-900">Project #{{ project.id }}: {{ project.name }}</h2>
      <p class="text-xl text-indigo-600 font-medium mt-2 italic">
        <i>{{ project.valueProposition }}</i>
      </p>
    </section>

    <!-- 2. Artifacts (GitHub & ADR) -->
    <section class="flex gap-4 border-y border-slate-100 py-4">
      <a :href="project.artifacts.githubUrl" target="_blank" class="btn-artifact">
        <span class="font-bold text-sm">GitHub Repo →</span>
      </a>
      <br />
      <a :href="project.artifacts.adrUrl" target="_blank" class="btn-artifact">
        <span class="font-bold text-sm">Architecture Design Record (ADR) →</span>
      </a>
    </section>

    <!-- 3. Tech Stack -->
    <section v-if="project.techStack.length" class="bg-slate-900 text-white p-6 rounded-xl">
      <h3 class="text-lg font-bold mb-3">Tech Stack</h3>
      <ul class="list-disc list-inside space-y-2">
        <li v-for="technology in project.techStack" :key="technology">
            {{ technology }}
        </li>
      </ul>
    </section>

    <!-- 4. Topics -->
    <section v-if="project.topics.length" class="bg-slate-900 text-white p-6 rounded-xl">
      <h3 class="text-lg font-bold mb-3">Topics</h3>
      <ul class="list-disc list-inside space-y-2">
        <li v-for="topic in project.topics" :key="topic">
            {{ topic }}
        </li>
      </ul>
    </section>

    <!-- 5. Dynamic Markdown Content (The Body) -->
    <article 
      v-html="markdownHtml" 
      class="prose prose-slate max-w-none prose-headings:text-slate-800"
    ></article>
    
    <!-- 6. System Architecture (Mermaid) -->
    <section v-if="project.mermaidDiagram" class="space-y-4">
      <h3 class="text-xl font-bold">System Architecture</h3>
      <div class="mermaid bg-white p-4 rounded-lg border border-slate-200">
        {{ project.mermaidDiagram }}
      </div>
    </section>

    <!-- 7. Ordered Animations Section -->
    <section class="space-y-8">
      <h3 class="text-xl font-bold border-b pb-2">Visual Demonstrations</h3>
      <div v-for="(anim, index) in project.animations" :key="index" class="space-y-4">
        <p class="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-r-lg border-l-4 border-indigo-400">
          <strong>Step {{ index + 1 }}:</strong> {{ anim.description }}
        </p>
        <ProjectDemo :demoUrl="anim.fileName" :title="anim.fileName" />
      </div>
    </section>

    <!-- 8. Further Reading -->
    <section v-if="project.furtherReading.length" class="bg-slate-900 text-white p-6 rounded-xl">
      <h3 class="text-lg font-bold mb-3">Further Reading</h3>
      <ul class="list-disc list-inside space-y-2">
        <li v-for="link in project.furtherReading" :key="link.url">
          <a :href="link.url" target="_blank" class="hover:text-indigo-300 transition-colors">
            {{ link.label }}
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.btn-artifact {
  @apply px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-all no-underline;
}
</style>
