import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MarkdownView from '../MarkdownView.vue'
import type { Project } from '@/types/Project';
import mermaid from 'mermaid'
import { nextTick } from 'process';

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
    emoji: '🔄',
    valueProposition: 'High-throughput data pipelines.',
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
    // Verify that the markdown content is rendered
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

  it('handles mermaid errors by showing an error message', async () => {
    // 1. Force mermaid.run to FAIL for this specific test
    vi.mocked(mermaid.run).mockRejectedValueOnce(new Error('Mermaid Crash'));

    // 2. Mount the component (pass the "Project #1" text as a prop if needed)
    const wrapper = mount(MarkdownView, {
      props: { project: mockProject as Project }
    });

    // 3. Trigger the logic (if it doesn't run on mount)
    // await wrapper.vm.fetchAndRender(); 

    await flushPromises();

    // 4. Now it should contain the error message
    expect(wrapper.text()).toContain('Error loading project documentation');
  })
})
