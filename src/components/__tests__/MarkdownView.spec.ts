import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MarkdownView from '../MarkdownView.vue'
import type { Project } from '@/types/Project';

// 1. Mock External Dependencies
vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    run: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('MarkdownView.vue', () => {
  // Updated to match the new projects.json structure
  const mockProject = {
    id: '1',
    name: 'GenAI',
    title: 'GenAI Code Analysis',
    emoji: '🤖',
    headline: 'LLM-Powered Code Property Graph (CPG) Queries',
    summary: 'A sophisticated source code analysis tool...',
    stack: ['Ollama', 'Neo4j', 'Joern'],
    kpis: [{ value: 'Graph-Based', label: 'Context' }],
    imageUrl: 'https://placehold.co',
    rationale: [
      { title: 'Graph Representation', description: 'Using Joern to parse code.' }
    ],
    videos: [
      { title: 'Graph Traversals', desc: 'Visualising data flow.', url: 'https://lorem.video' }
    ],
    mermaidDiagram: 'graph TD\n    Code --> CPG',
    artifacts: {
      githubUrl: 'https://github.com',
      adrUrl: 'https://github.com'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock global fetch for Markdown ingestion
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('# Technical Docs\nThis is a test.'),
    })
  })

  it('renders project headline and summary on mount', async () => {
    const wrapper = mount(MarkdownView, {
      props: { project: mockProject as unknown as Project }
    })

    await flushPromises()
    
    // Check for the new headline field
    expect(wrapper.text()).toContain('LLM-Powered Code Property Graph (CPG) Queries')
    expect(wrapper.html()).toContain('GenAI Code Analysis')
  })

  it('displays the "Videos" or "Demos" section with correct descriptions', async () => {
    const wrapper = mount(MarkdownView, {
      props: { project: mockProject as unknown as Project }
    })

    await flushPromises()

    // Updated from 'Step 1' to the new 'desc' field in the videos array
    expect(wrapper.text()).toContain('Visualising data flow')
  })
})
