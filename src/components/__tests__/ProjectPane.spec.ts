import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ProjectPane from '../ProjectPane.vue'
import type { Project } from '@/types/Project'

/**
 * Unit test for the ProjectPane component.
 * Verifies UI state transitions and interaction contracts.
 */
describe('ProjectPane.vue', () => {
  // Mock data updated to match the new Project.ts / projects.json schema
  const mockProject: Partial<Project> = {
    id: '1',
    name: 'GenAI',
    title: 'GenAI Code Analysis',
    emoji: '🤖',
    headline: 'LLM-Powered Code Property Graph (CPG) Queries',
    stack: ['Ollama', 'Neo4j', 'Joern'],
  }

  it('renders project metadata correctly', () => {
    const wrapper = mount(ProjectPane, {
      props: {
        project: mockProject as Project,
        isActive: false
      }
    })

    // Assert: Verify internal name and headline display as expected
    expect(wrapper.text()).toContain('GenAI')
    expect(wrapper.text()).toContain('LLM-Powered Code Property Graph')
  })

  it('emits a click event when the tile is pressed', async () => {
    const wrapper = mount(ProjectPane, {
      props: {
        project: mockProject as Project,
        isActive: false
      }
    })

    // Act: Simulate user interaction
    await wrapper.trigger('click')

    // Assert: Check the event contract with the parent
    expect(wrapper.emitted()).toHaveProperty('click')
  })

  it('applies "active" styling classes when isActive prop is true', () => {
    const wrapper = mount(ProjectPane, {
      props: {
        project: mockProject as Project,
        isActive: true
      }
    })

    // Assert: Verify visual feedback and Tailwind transitions
    // Assuming your template uses these classes for the active state
    expect(wrapper.classes()).toContain('ease-out')
    
    // Accessibility check: aria-selected should reflect active state
    expect(wrapper.attributes('aria-selected')).toBe('true')
  })
})
