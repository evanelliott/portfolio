import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MarkdownView from '../MarkdownView.vue'
import type { Project } from '@/types/Project';
import mermaid from 'mermaid'

// 1. Mock External Dependencies
vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    run: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('MarkdownView.vue', () => {
  const mockProject = {
    id: '1',
    name: 'ETL Orchestrator',
    valueProposition: 'High-throughput data pipelines.',
    markdownFileName: 'project-0.md',
    mainAnimation: 'etl-demo.gif',
    artifacts: { githubUrl: 'https://github.com', adrUrl: 'https://adr.com' },
    animations: [{ fileName: 'demo', description: 'Step 1' }],
    mermaidDiagram: 'graph TD; A-->B',
    techStack: ['Python', 'Airflow', 'Docker'],
    topics: ['Data Engineering', 'ETL', 'Orchestration'],
    furtherReading: [],
    date: '2024-01-01',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock global fetch for Markdown ingestion
    global.fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve('# Technical Docs\nThis is a test.'),
    })
  })

  it('fetches and renders markdown on mount', async () => {
    const wrapper = mount(MarkdownView, {
      props: { project: mockProject as Project }
    })

    // Wait for async fetch and DOM updates
    await flushPromises()

    expect(global.fetch).toHaveBeenCalledWith('/portfolio/data/project-0.md')
    expect(wrapper.html()).toContain('System Architecture</h3>')
    expect(wrapper.html()).toContain('GitHub Repo →</span>')
  })

  it('triggers the Mermaid.js engine after content is loaded', async () => {
    mount(MarkdownView, {
      props: { project: mockProject as Project }
    })

    await flushPromises()

    // Verify senior-level integration: Mermaid should be triggered to parse the diagram
    expect(mermaid.run).toHaveBeenCalled()
  })

  it('displays the "Visual Demonstrations" section with correct descriptions', async () => {
    const wrapper = mount(MarkdownView, {
      props: { project: mockProject as Project }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Visual Demonstrations')
    expect(wrapper.text()).toContain('Step 1')
  })

  it('handles fetch errors gracefully by showing an error message', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'))
    
    const wrapper = mount(MarkdownView, {
      props: { project: mockProject as Project }
    })

    await flushPromises()
    
    expect(wrapper.text()).toContain('Error loading project documentation')
  })
})
